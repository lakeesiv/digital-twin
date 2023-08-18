import os
import sys
import pathlib
import logging
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from etl.mqtt_client import MQTTClient
import time
import datetime
from threading import Thread


class MQTTManager():
    def __init__(self, mqtt_cfg, msg_handler=None, unique_id="mqtt_manager", logger=logging.getLogger()):
        self.logger=logger
        self.mqtt_cfg=mqtt_cfg
        self.msg_handler = self if msg_handler is None else msg_handler
        self.unique_id = unique_id if(self.mqtt_cfg["mqtt_client_name"] is None) else self.mqtt_cfg["mqtt_client_name"]
        self.mqtt_connections = list()

        self.init_mqtt_manager()

    def init_mqtt_manager(self):
        self.mqttclient = MQTTClient(self.unique_id, logger=self.logger)
        self.mqttclient.setMessageHandler(self.msg_handler)
        self.topics_in=self.mqtt_cfg["mqtt_topics_in"]
        self.topic_out=self.mqtt_cfg["mqtt_topic_out"]
        #Connection started externally
        #self.connect()

        
    def connect(self):
        #self.mqttclient.setMessageHandler(self.msg_handler)
        #self.logger.info("MQTT config : " + str(self.mqtt_cfg))
        self.mqttclient.setUsername_pw(self.mqtt_cfg["mqtt_username"], password=self.mqtt_cfg["mqtt_password"])
        self.mqttclient.connect(mqtt_cfg=self.mqtt_cfg, topics=self.topics_in)
        #mqtt_connection=Thread(target=self.mqttclient.connect, kwargs={"mqtt_cfg": self.mqtt_cfg,"topics": self.topics_in})
        #self.mqtt_connections.append(mqtt_connection)
        #mqtt_connection.run()
        
        return self.mqttclient.connected # connected

    def disconnect(self):
        self.logger.info("Disconnecting MQTT")
        self.mqttclient.disconnect()
        for mqtt_connection in self.mqtt_connections:
            mqtt_connection.join()

    def subscribe_query(self, query):
        new_topics=self.topics_from_query(query)
        self.logger.info("Topics: " + str(self.topics_in))
        
        for topic in self.topics_in:
            self.mqttclient.subscribe(topic)
        
        return new_topics
        
    def topics_from_query(self, query):
        topics=dict()
        if ("spaces" in query):
            for space in query["spaces"]:
                pass
                
        if ("assets" in query):
            for asset in query["assets"]:
                pass

        if ("sensors" in query):
            for sensor in query["sensors"]:
                if(not sensor["acp_id"] in topics):
                    topics[sensor["acp_id"]]=self.define_topic_from_acpid(sensor["acp_id"])

        #self.logger.info("topics:" + str(topics.values()) + " - " + str(topics))
        for topic in topics.values():
            self.topics_in+=topic
        
        return topics

    def define_topic_from_acpid(self, sensor_id):
        if (sensor_id.startswith("enl") or sensor_id.startswith("elsys")):
            return [self.replace_last(prefix, "+", sensor_id) for prefix in self.mqtt_cfg["mqtt_topics_prefix"]["lora"]]
        #else if (sensor_id.startswith("monnit") or sensor_id.startswith("ifm")):
        else:
            return [self.replace_last(prefix, "+", sensor_id) for prefix in self.mqtt_cfg["mqtt_topics_prefix"]["other"]]


    def replace_last(self, string, old, new, count=1):
        reverse_str = string[::-1]
        reverse_old = old[::-1]
        reverse_new = new[::-1]
        reverse_new_string = reverse_str.replace(reverse_old, reverse_new, count)
        new_string=reverse_new_string[::-1]
        
        return new_string
        
    def handle_message(self, message, topic=None):
        self.logger.info("Default message handler :" + message)
        #Implement your own handle_message function here
        #OR: pass the instance to the object that implements it in the constructor

    def publish(self, message):
        self.mqttclient.publish(self.topic_out, message)
