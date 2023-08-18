import logging
import os
import sys
import pathlib
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from lib.jsonReader import JSONReader
from etl.MQTTManager import MQTTManager
from etl.WSManager import WebSocketManager
import json
from datetime import datetime

class RTManager:
    def __init__(self, rt_cfg, msg_handler=None, sensor_parameters_path = "etl/static/sensor_parameters.json", logger=logging.getLogger()):
        self.logger=logger
        self.rt_cfg=rt_cfg
        self.init_rt(msg_handler, sensor_parameters_path)
        self.parameters=dict()

    def init_rt(self, msg_handler, sensor_parameters_path):
        if(self.rt_cfg["rt_type"]=="websockets"):
            self.rt=WebSocketManager(self.rt_cfg["ws_cfg"], msg_handler, logger=self.logger)
        if(self.rt_cfg["rt_type"]=="mqtt"):
            self.rt=MQTTManager(self.rt_cfg["mqtt_cfg"], msg_handler, logger=self.logger)
        
        self.sensor_parameters = io.readJSON(sensor_parameters_path)
        #self.logger.info(self.sensor_parameters)
        

    def connect(self):
        self.rt.connect()

    def subscribe_query(self, query):
        '''
        Examples of a query-subscriptions:
        - {"sensors": [ {"acp_id": "enl_iaqco3_123456", "parameters": ["co", "co2", "pm1.0", "o3"]}, 
        {"acp_id": "enl_iaqc_789012", "parameters": ["co", "co2", "pm1.0"]}, 
        {"acp_id": "enl_iaqco3_456789", "parameters": ["pm", "openv"]}, 
        {"acp_id": "enl_iaqco3_123456", "parameters": ["all"]} ]}
        # To do: include spaces and assets. 
        - {"spaces": [ {"acp_id" : "MR1", "parameters" : ["co", "co2", "pm1.0", "o3"], {"acp_id" : "MR2", "parameters" : ["co", "co2", "temperature"]]}
        - {"asset": [ {"acp_id" : "pump1", "parameters" : ["vibration", "on_off", "input_pressure", "output_pressure"], {"acp_id" : "MR2", "parameters" : ["co", "co2", "temperature"]]} 
        '''
        query = self.expand_query(query)
        self.logger.info(query)
        
        # stores the parameters for each sensor acp_id
        for elem in query["sensors"]:
            self.parameters[elem["acp_id"]]=elem["parameters"]

        new_topics=self.rt.subscribe_query(query)

    def expand_query (self, query):
        if ("spaces" in query):
            for space in query["spaces"]:
                space = self.expand_query_space(space)
                
        if ("assets" in query):
            for asset in query["assets"]:
                asset = self.expand_query_asset(asset)

        if ("sensors" in query):
            for sensor in query["sensors"]:
                sensor = self.expand_query_parameters(sensor)
        return query

    def expand_query_space(self, space):
        #To Do: connect with IFCxBrick to figure out sensors in space
        pass

    def expand_query_asset(self, asset):
        #To Do: connect with IFCxBrick to figure out sensors in an asset
        pass
    
    def expand_query_parameters(self, sensor_query):
        parameters=list()
        parameters.append("acp_id")
        parameters.append("acp_ts")
        if ("parameters" in sensor_query):
            if("all" in sensor_query["parameters"]):
                sensor_type = self.extractSensorTypeFromID(sensor_query)
                parameters = self.sensor_parameters[sensor_type].copy()
            if ("pm" in sensor_query["parameters"]):
                sensor_type = self.extractSensorTypeFromID(sensor_query)
                for param in self.sensor_parameters[sensor_type]:
                    if (param.startswith("pm") or param in ["mc_pm1_0", "mc_pm2_5", "mc_pm4_0", "mc_pm10_0", "nc_pm0_5", "nc_pm1_0", "nc_pm2_5", "nc_pm4_0", "nc_pm10_0", "pm_tps"]):
                        parameters.append(param)
        else:
            sensor_type = self.extractSensorTypeFromID(sensor_query)
            parameters = self.sensor_parameters[sensor_type].copy()

        sensor_query["parameters"]=parameters        
        return sensor_query

    def extractSensorTypeFromID(self, query):
        if(not "acp_id" in query): return []
        else:
            acp_id_parts=query["acp_id"].split("-")
            sensor_type=acp_id_parts[0]+"-"+acp_id_parts[1]
            return sensor_type
        
    def filterParametersFromSensorMessage(self, msg):
        if (not "acp_id" in msg["sensor"]): return msg
        json_reader = JSONReader(None, self.parameters[msg["sensor"]["acp_id"]])
        filtered_msg=json_reader.filter_message(msg)
        filtered_msg["acp_ts"]=msg["sensor"]["acp_ts"]
        filtered_msg["acp_id"]=msg["sensor"]["acp_id"]
        
        return filtered_msg
        
    def publish(self, data):
        self.rt.publish(data)
