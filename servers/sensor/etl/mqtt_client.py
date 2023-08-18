#!/usr/bin/python
#author: Dr. Jorge Merino
#organisation: University of Cambridge. Institute for Manufacturing.
#date: 2020.04.29
#last_edit: 2023.02.10
#license: GPL-3.0 (GNU General Public License version 3): https://opensource.org/licenses/GPL-3.0

import logging
import traceback
import paho.mqtt.client as mqtt
import inspect
#=====================================================================#
#=========================== MQTT ====================================#
#=====================================================================#

class MQTTClient():
    def __init__(self, client_id, host=None, port=None, logger=logging.getLogger()):
        self.logger=logger
        self.client_id=client_id
        self.host=host
        self.port=port
        self.connected=False
        self.disconnected=False
        self.topics_sub=list()
        self.client = mqtt.Client(client_id, clean_session=True, userdata=None)
        #self.client = mqtt.Client(client_id=mqtt_cfg["user"], clean_session=True, userdata=None)
        self.client.on_connect = self.on_connect
        self.client.on_disconnect = self.on_disconnect #only if loop is handled manually (i.e., loop_start() + loop_end() to reconnect)
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish

        # Blocking call that processes network traffic, dispatches callbacks and
        # handles reconnecting. Fine for handling subscriptions only.
        #self.client.loop_forever()
        # Other loop*() functions are available that give a threaded interface and a
        # manual interface.
    
    def setUsername_pw(self, username, password=None):
        if(self.client!=None):
            self.client.username_pw_set(username, password=password)

    def connect(self, mqtt_cfg=None, host=None, port=None, topics=None):
        #Adding the topics to the list without subscribing yet, while offline.
        #This can only be done before connecting, otherwise, the list is only updated through the "subscribe" function
        if(topics is None): topics=[]
        self.topics_sub=list(set(self.topics_sub+topics))
            
        if(host!=None and port!=None):
            self.host = host
            self.port = port
        elif(isinstance(mqtt_cfg, dict) and mqtt_cfg["mqtt_host"]!=None and mqtt_cfg["mqtt_port"]!=None):
            self.host = mqtt_cfg["mqtt_host"]
            self.port = mqtt_cfg["mqtt_port"]          
        if(self.host!=None and self.port!=None):
            try:
                self.logger.info("MQTT " + self.client_id + " - Connecting to " + self.host + ":" + str(self.port))
                self.client.connect_async(self.host, self.port)
                #self.client.loop_start()
                self.client.loop_forever()
            except ValueError as e:
                self.logger.error("MQTT " + self.client_id + " - Connection failed. Check mqtt.cfg")
                self.logger.error("MQTT " + self.client_id + " - error + " + str(e))
        else:
            self.logger.error("MQTT " + self.client_id + " - Connection configuration not provided")

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self, client, userdata, flags, rc):
        #print(str(self.host) + ":" + str(self.port))
        if(rc==0):
            self.logger.info("MQTT " + self.client_id + " - Connected to MQTT Broker " + str(self.host) + ":" + str(self.port))
            self.connected=True
            self.disconnected=False
        elif(rc==1):
            self.logger.error("MQTT " + self.client_id + " - Connection refused: incorrect protocol version, check mqtt.conf")
        elif(rc==2):
            self.logger.error("MQTT " + self.client_id + " - Connection refused: invalid client identifier, check mqtt.conf")
        elif(rc==3):
            self.logger.error("MQTT " + self.client_id + " - Connection refused: server unavailable, check mqtt.conf")
        elif(rc==4):
            self.logger.error("MQTT " + self.client_id + " - Connection refused - bad username or password, check mqtt.conf")
        elif(rc==5):
            self.logger.error("MQTT " + self.client_id + " - Connection refused - not authorised by the broker, check mqtt.conf")
        else:
            self.logger.error("MQTT " + self.client_id + " - Connection refused - reason not provided, check with the broker administrator")

        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        # self.client.subscribe("topic1", 0)
        # self.client.subscribe("topic2", 0)
        for topic in self.topics_sub:
            self.client.subscribe(topic)

    def disconnect(self):
        self.disconnected=True
        self.connected=False
        self.client.disconnect()
        self.client.loop_stop()

    def on_disconnect(self, client, userdata, rc):
        self.conected=False
        if (rc != 0):
            self.logger.warning("MQTT " + self.client_id + " - Unexpected disconnection")
        else:
            self.logger.warning("MQTT " + self.client_id + " - Controlled disconnection")
        if(not self.disconnected):
            self.connect()

    def subscribe(self, topic):
        if (not topic in self.topics_sub):
            self.topics_sub.append(topic)
            self.client.subscribe(topic)
            self.logger.info("MQTT " + self.client_id + " - Subscribed to topic " + topic)
        else:
            self.logger.warning("MQTT  " + self.client_id + " - Already subscribed to topic " + topic)

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self, client, userdata, msg):
        message=str(msg.payload.decode("utf-8"))
        #print("message = " + message)
        topic=str(msg.topic)

        #self.logger.info("MQTT " + self.client_id + " <<" + topic + ">>: " + message)
        #self.logger.info("message topic=" + msg.topic)
        #self.logger.info("message qos=" + msg.qos)
        #self.logger.info("message retain flag=",msg.retain)

        if (self.msg_handler!=None):
            try:
                self.msg_handler.handle_message(msg=message, topic=topic)
            except NameError as ne:
                self.logger.error("Function handle_message() not defined in the msg_handler provided to the mqtt_client: " + str(self.msg_handler))
                self.logger.error(ne, exc_info=True)
                self.logger.error("Members: " + str(inspect.getmembers(self.msg_handler, predicate=inspect.ismethod)))

    def publish(self, topic, data, prefix=None):
        self.logger.info("MQTT " + self.client_id + " - Trying to publish message to broker")
        if (prefix!=None): topic=prefix+topic
        if(self.connected):
            self.logger.info("MQTT " + self.client_id + " - Still connected. publishing")
            self.client.publish(topic, payload=str(data), qos=0, retain=False)

    # The callback for when the client published a message.
    def on_publish(self, client, flags, rc):
        self.logger.info("MQTT " + self.client_id + " - Message published to broker, connack code: "+str(rc))

    def setMessageHandler(self, msg_handler):
        self.msg_handler=msg_handler
        self.logger.info("MSG_HANDLER Members: " + str(inspect.getmembers(msg_handler, predicate=inspect.ismethod)))
