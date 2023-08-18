#!/usr/bin/python
#author: Dr. Jorge Merino
#organisation: University of Cambridge. Institute for Manufacturing.
#date: 2020.04.29
#last_edit: 2023.02.10
#license: GPL-3.0 (GNU General Public License version 3): https://opensource.org/licenses/GPL-3.0

import logging
import traceback
import sys
import asyncio
import websockets
import json


#=====================================================================#
#=========================== WS ====================================#
#=====================================================================#

class WebSocketClient():
    def __init__(self, client_id, host=None, port=None, logger=logging.getLogger()):
        self.logger=logger
        self.client_id = client_id
        self.host = host
        self.port = port
        self.connected = False
        self.topics_sub = list()
        self.websocket = None
        self.loop = None
        self.subscriptions = list()
        #self.host= 'localhost'
        #self.host = 'ws://cdbb.uk/rtmonitor/WS/mqtt_acp'
        #self.host = 'ws://localhost:8083'
        #self.host = 'ws://tfc-app8.cl.cam.ac.uk:8083/rtmonitor/WS/mqtt_acp'
        #self.port=None

    def connect(self):
        asyncio.run(self.connect_keepAlive())
        #asyncio.get_event_loop().run_until_complete(self.connect_keepAlive())
        
    def init_ws(self):
        self.loop = asyncio.get_event_loop()
        #data = await loop.run_in_executor(None, self.connect_keepAlive)

                
    async def connect_keepAlive(self):
        conn_str=self.host if self.host.startswith("wss://") else "wss://"+self.host
        conn_str=self.host if self.host.startswith("ws://") else "ws://"+self.host
        conn_str=(conn_str + ":" + str(self.port)) if self.port!=None else conn_str
        #conn_str+="/rtmonitor/WS/mqtt_csn"
        conn_str+="/rtmonitor/WS/mqtt_acp"
        #async for self.websocket in websockets.connect(conn_str):
        async with websockets.connect(conn_str) as self.websocket:
            try:
                self.logger.info("WS " + self.client_id + " - Connected to WS Broker " + str(self.host) + ":" + str(self.port))
                self.connected=True
                await self.register()
                await self.subscribe()
                '''
                async for message in self.websocket:
                    await self.msg_handler(message)
                '''
                #after the connection was successful, we want to check that
	        #that the connection is stable every 15(?) minutes
	        #self.check_periodic(self);
            except websockets.InvalidURI as iuri:
                self.logger.error("WS " + self.client_id + " - Connection refused: Invalid URI or server unavailable, check config")
                self.connected=False
            except OSError as ose:
                self.logger.error("WS " + self.client_id + " - Connection refused: TCP or server unavailable, check config")
                self.connected=False
            except websockets.InvalidHandshake as ih:
                self.logger.error("WS " + self.client_id + " - Connection refused: Opening handshake failed")
                self.connected=False
            except TimeoutError as te:
                self.logger.error("WS " + self.client_id + " - Connection refused: Timedout or server unavailable, check config")
                self.connected=False
            except websockets.ConnectionClosed:
                self.logger.error("WS " + self.client_id + " - Connection closed!")
                self.connected=False
                #continue

    

    async def register(self):
        # To register the client in acp RTMonitor
        connect_msg = {
            "msg_type": "rt_connect",
            "client_data":{
                "rt_client_id": "acp_twinair_api",
                "rt_client_name": "acp_twinair_api",
                "rt_client_url" : "ifm.cdbb.uk",
                "rt_token" : "888"
            }
        }
        '''
        connect_msg = {
	    "msg_type": "rt_connect",
	    "client_data": {
	        "rt_client_name": "splash_rain",
	        "rt_client_id": "splash_rain",
	        "rt_client_url": "ifm.cdbb.uk",
	        "rt_token": "888"
	    }
        }
        '''
        if (self.connected):
            try:
                self.logger.info("Registering to:" + str(connect_msg))
                await self.websocket.send(json.dumps(connect_msg))
                registration = await self.websocket.recv()
                self.logger.info("WS " + self.client_id + " - " + str(registration))
                msg = json.loads(registration)
                msg_type = True if "msg_type" in msg != None else False

                if (msg_type and msg["msg_type"] == "rt_connect_ok"):
                    self.logger.info("WS " + self.client_id + " - REGISTERED")
                    #data=await self.read(["elsys-co2-058b19"])
                    #self.logger.info("WS " + self.client_id + " - Requested data: " + str(data))
            except websockets.ConnectionClosed as ce:
                self.logger.error("WS " + self.client_id + " - Connection closed!\n" + str(ce))
                self.connected=False
            except RuntimeError as re:
                self.logger.error("WS " + self.client_id + " - recv() called multiple times!\n" + str(re))
        else:
            self.logger.warn("WS " + self.client_id + " - NOT CONNECTED")
            
        
    async def disconnect(self):
        if (self.websocket!= None):
            self.websocket.close(reason="Controlled disconnection")
        self.connected=False

    async def read(self, query):
        data = await self.request(query)
        return data

    async def request(self, query):
        data=dict()
        req_latest_id = "request_all"
        sensor_list=[acp_id for acp_id in query]
        request_msg = {
            "msg_type": "rt_request",
	    "request_id": req_latest_id,
	    "options": ["latest_records"],
            "filters": [
                { "key":"acp_id",
                  "test":"in",
                  "values": sensor_list
                }
            ]
        }

        if (self.connected):
            try:
                #request latest
                self.logger.info("WS " + self.client_id + " - Requesting last:" + str(request_msg))
                #websocket.send(json.dumps(request_msg))
                await self.websocket.send(json.dumps(request_msg))
                req = await self.websocket.recv()
                self.logger.info("WS " + self.client_id + " - " + str(req))
                data=json.loads(req)
            except json.JSONDecodeError as je:
                pass
            except ConnectionClosed as ce:
                self.logger.error("WS " + self.client_id + " - Connection closed!\n" + str(ce))
                self.connected=False
            except RuntimeError as re:
                self.logger.error("WS " + self.client_id + " - recv() called multiple times!\n" + str(re))
        else: self.logger.warn("WS " + self.client_id + " - NOT CONNECTED")
        return data

    def add_subscription(self, query=[]):
        self.subscriptions += query

        
    async def subscribe(self, query=[]):
        subscribe_id = "subscribe_all"
        sensor_list=self.subscriptions+[acp_id for acp_id in query]
        subscribe_msg = {
            "msg_type": "rt_subscribe",
            "request_id": "acp_twinair_api"
        }
        if(len(sensor_list)>0):
            subscribe_msg["filters"] = [
                { "key":"acp_id",
                  "test":"in",
                  "values": sensor_list
                }
            ]
        '''
        subscribe_msg = {
	    "msg_type": "rt_subscribe",
	    "request_id": subscribe_id
        }
        '''

        if (self.connected):
            try:
	        #subscribe to all incoming
                self.logger.info("WS " + self.client_id + " - Subscribing to:" + str(subscribe_msg))
                #websocket.send(json.dumps(subscribe_msg))
                await self.websocket.send(json.dumps(subscribe_msg))
                
                #if only one is excected:
                #message = await websocket.recv()
                #self.logger.info("WS " + self.client_id + " - " + str(message))

                #normal subscriptions expect more than one
                async for message in self.websocket:
                    #self.logger.debug("WS " + self.client_id + " - Message: " + str(message))
                    self.msg_handler.handle_message(message, subscribe_msg)
	        
            except websockets.ConnectionClosed as ce:
                self.logger.error("WS " + self.client_id + " - Connection closed!\n" + str(ce))
                self.connected=False
            except RuntimeError as re:
                self.logger.error("WS " + self.client_id + " - recv() called multiple times!\n" + str(re))
        else:
            self.logger.warn("WS " + self.client_id + " - NOT CONNECTED. Saving new subscription and awaiting connection")
            self.subscriptions += query

    
    def setMessageHandler(self, msg_handler):
        self.msg_handler=msg_handler

    
    
    
