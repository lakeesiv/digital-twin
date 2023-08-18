import logging
import os
import sys
import pathlib
import json
from datetime import datetime
from tabulate import tabulate
import pandas as pd
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from etl.RTManager import RTManager
from etl.DBManager import DBManager
from etl.decoders.decoder import Decoder


class ETL:
    def __init__(self, basic_cfg, vs_cfg, logger=logging.getLogger(), owner=None):
        self.logger=logger
        self.basic_cfg=basic_cfg
        self.cfg=vs_cfg
        self.init_etl()
        self.owner=owner
        
    def init_etl(self):
        self.rt_manager = RTManager(self.cfg["rt_cfg"], self, self.basic_cfg["sensor_parameters_path"], logger=self.logger)
        self.db_manager = DBManager(self.cfg["db_cfg"], self.basic_cfg["sensor_parameters_path"], logger=self.logger)
        self.logger.info("==== Starting ETL ====")
        self.logger.info(self.cfg["db_cfg"])
        self.logger.info("======================")

    def read(self, query):
        #query={"acp_id": "enl-iaqco3-081622", "from": "01/01/2023", "to": "28/02/2023", "parameters": ["all"]}
        df=self.db_manager.read(query)
        #self.logger.info(df)
        #To Do: store df somewhere for access, or use it for something.
        return df
        
    def subscribe(self, query):
        self.logger.info("======= Starting subscriptions =======")
        #query = {"sensors": [ {"acp_id": "enl-iaqco3-081622", "parameters": ["all"]},  {"acp_id": "elsys-co2-058b19", "parameters": ["all"]} ]}
        #query = {"sensors": [ {"acp_id": "enl-iaqco3-081622", "parameters": ["all"]},  {"acp_id": "enl-iaqco3-0837d7", "parameters": ["all"]} ]}
        

        #all_synetica_sensors= ["enl-iaqco3-083b3f", "enl-iaqco3-0837d7", "enl-iaqco3-08185c", "enl-iaqc-08833e", "enl-iaqc-08734d", "enl-iaqc-0838aa", "enl-iaqc-0839c5", "enl-iaqc-082f4d", "enl-iaqc-081bd7", "enl-iaqco3-084e85", "enl-iaqc-0857ab", "enl-iaqc-085a26", "enl-iaqc-0812d9", "enl-iaqc-081a75", "enl-iaqc-087019", "enl-iaqc-0824ea", "enl-iaqc-084596", "enl-iaqco3-084a98", "enl-iaqc-088b66", "enl-iaqco3-0865dc", "enl-iaqco3-081622", "enl-iaqco3-086d3d", "enl-iaqc-085e9a", "enl-iaqc-0880a2", "enl-iaqc-0862a3"]
        #query = {"sensors":[]}
        #for sensor_id in all_synetica_sensors:
            #query["sensors"].append({"acp_id" : sensor_id, "parameters":["all"]})
        
        self.rt_manager.subscribe_query(query)
        self.rt_manager.connect()

    def getPartitionedData(self, data):
        partitionedData=list()
        for sensor in self.data["acp_id"].unique():
            sensor_data = self.data.loc[self.data["acp_id"] == sensor]
            partitionedData.append(sensor_data)
            #print ("sensor ", sensor, " data :\n", sensor_data["acp_ts", "value"])
        return partitionedData

    def publish(self, data):
        self.logger.info("===> Message to publish\n" + str(data) + "\n=====")
        self.rt_manager.publish(data)
        

    def handle_message(self, msg, topic=None):
        self.logger.info("-----------------------------------")
        #self.logger.info("Handling new message : " + str(msg))
        transformed_msg=Decoder.transform(msg, topic)
        if(transformed_msg):
            #self.logger.info("Transformed Message: " + str(transformed_msg))
            filtered_msg=self.rt_manager.filterParametersFromSensorMessage(transformed_msg)
            #self.logger.info("Filtered Message: " + str(filtered_msg))
            
            df=pd.DataFrame([filtered_msg])
            self.logger.info("Handling new message\n"+str(tabulate(df, headers='keys', tablefmt='psql')))
            #To Do: store df somewhere for access, or use it for something.
            #self.db_manager.store(transformed_msg)
            if(not self.owner is None):
                predictions=self.owner.handle_reading(filtered_msg)
                self.logger.info("Predictions: " + str(predictions))
                for p in predictions: self.publish(predictions[p])
            
