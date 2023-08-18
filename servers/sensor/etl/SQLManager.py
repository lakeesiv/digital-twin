import os
import sys
import pathlib
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
import logging

class SQLManager:

    def __init__(self, filedb_cfg, logger=logging.getLogger()):
        self.logger=logger
        self.filedb_cfg=filedb_cfg
        self.init_db()

    def init_db(self):
        self.database = dict()


    def updateSensor(self, sensor_data):
        pass

    def updateGateway(self, gateway_data):
        pass
    def updateDataConnector(self, data_connector_data):
        pass
    
    def updateService(self, service_data):
        pass

    def store(self, message):
        self.updateSensor(message["sensor"])
        self.updateGateway(message["gateway"])
        self.updateDataConnector(message["data_connector"])
        self.updateService(message["service"])

    def read(self, query):
        pass
