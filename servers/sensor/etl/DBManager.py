import logging
from etl.FileManager import FileManager
from etl.SQLManager import SQLManager
import pathlib
import sys
import os
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io


class DBManager:

    def __init__(self, db_cfg, sensor_parameters_path = "etl/static/sensor_parameters.json", logger=logging.getLogger()):
        self.logger=logger
        self.db_cfg=db_cfg
        self.init_db(sensor_parameters_path)

    def init_db(self, sensor_parameters_path):
        if(self.db_cfg["db_type"]=="file"):
            self.db=FileManager(self.db_cfg, logger=self.logger)
        if(self.db_cfg["db_type"]=="sql"):
            self.db=SQLManager(self.db_cfg, logger=self.logger)
        
        self.sensor_parameters = io.readJSON(sensor_parameters_path)
        #self.logger.info(self.sensor_parameters)
        
        
    def store(self, message):
        #self.logger.info("Message: " + str(message))
        self.db.store(message)

    def read(self, query):
        '''
        Examples of a query:
        - {"acp_id": "enl_iaqco3_123456", "from": "01/01/2023", "to": "28/02/2023", "parameters": ["co", "co2", "pm1.0", "o3"]}
        # this includes all pm parameters and the operating environment (humidity, temperature, pressure)
        - {"acp_id": "enl_iaqco3_123456", "from": "01/03/2023", "to": "now", "parameters": ["pm", "openv"]}
        # this includes all parameters in the sensor
        - {"acp_id": "enl_iaqco3_123456", "from": "01/03/2023", "to": "now", "parameters": ["all"]} 
        '''
        query = self.expand_query(query)
        self.logger.info("DBManager.read => Query: ")
        self.logger.info(query)
        return self.db.read(query)

    def expand_query(self, query):
        if ("from" in query and query["from"] == "start"):
            self.logger.error("The WILDCARD 'start' has not been implemented yet")
        if ("to" in query and query["to"] == "now"):
            self.logger.error("The WILDCARD 'now' has not been implemented yet")
        if (not "parameters" in query): query["parameters"] = ["all"]
        if("all" in query["parameters"]):
            sensor_type = self.extractSensorTypeFromID(query)
            query["parameters"] = self.sensor_parameters[sensor_type]
        if ("pm" in query["parameters"]):
            sensor_type = self.extractSensorTypeFromID(query)
            query["parameters"].remove("pm")
            for param in self.sensor_parameters[sensor_type]:
                if (param.startswith("pm")): query["parameters"].append(param)
        query["parameters"].insert(0, "acp_id")
        query["parameters"].insert(1, "acp_ts")
        return query

    def extractSensorTypeFromID(self, query):
        if(not "acp_id" in query): return []
        else:
            acp_id_parts=query["acp_id"].split("-")
            sensor_type=acp_id_parts[0]+"-"+acp_id_parts[1]
            return sensor_type
        
