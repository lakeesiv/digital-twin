import os
import sys
import pathlib
import logging
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from etl.ws_client import WebSocketClient
import time
import datetime
from threading import Thread

class WebSocketManager():
    def __init__(self, websocket_cfg, msg_handler=None, unique_id="websocket_manager", logger=logging.getLogger()):
        self.logger=logger
        self.ws_cfg=websocket_cfg
        self.msg_handler = self if msg_handler is None else msg_handler
        self.unique_id = unique_id if(self.ws_cfg["ws_client_name"] is None) else self.ws_cfg["ws_client_name"]
        self.ws_connections = list()
        self.topics_in=list()
        self.init_ws_manager()

    def init_ws_manager(self):
        self.wsclient = WebSocketClient(self.unique_id, host=self.ws_cfg["ws_host"], port=self.ws_cfg["ws_port"], logger=self.logger)
        self.wsclient.setMessageHandler(self.msg_handler)
        #Connection started externally
        #self.connect()
        
        
    def connect(self):
        self.logger.info("WS config : " + str(self.ws_cfg))
        self.wsclient.connect()

        #ws_connection=Thread(target=self.wsclient.connect, kwargs={"ws_cfg": self.ws_cfg,"topics": self.topics_in})
        #self.ws_connections.append(ws_connection)
        #ws_connection.run()

    def disconnect(self):
        self.logger.info("Disconnecting WS")
        self.wsclient.disconnect()
        for ws_connection in self.ws_connections:
            ws_connection.join()

    def subscribe_query(self, query):
        new_topics=self.topics_from_query(query)
        self.logger.info("Topics: " + str(self.topics_in))
        
        #for topic in self.topics_in:
        self.wsclient.add_subscription(self.topics_in)
        
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
                    topics[sensor["acp_id"]]=sensor["acp_id"]

        #self.logger.info("topics:" + str(topics.values()) + " - " + str(topics))
        self.topics_in+=topics.values()
        
        return topics


    def handle_message(self, message, topic=None):
        self.logger.info("Default message handler :" + message)
        #Implement your own handle_message function here
        #OR: pass the instance to the object that implements it in the constructor
