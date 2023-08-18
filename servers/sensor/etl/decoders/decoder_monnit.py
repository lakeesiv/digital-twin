import logging
import pathlib
import json
import pandas as pd
from datetime import datetime
import sys
import os
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from etl.decoders.decoder_abs import Decoder_Abstract

class Decoder_Monnit(Decoder_Abstract):
    def __init__(self, logger=logging.getLogger()):
        self.logger=logger
        
    def decode(self, message, topic=None):
        sensor_data = dict()
        gateway_data = dict()
        data_connector_data = dict()

        try:
            sensor_data["sensor_id"] = message["acp_id"]
            sensor_data["sensor_ts"] = float(message["acp_ts"])
            sensor_data["acp_ts"] = sensor_data["sensor_ts"]
            sensor_data["decoded_payload"] = message
            sensor_data["sensor_singal_strength"] = message["monnit_signalstrength"]
            sensor_data["sensor_voltage"] = message["monnit_signalvoltage"]
            
            gateway_data["gateway_id"] = message["monnit_gw"]
            gateway_data["gateway_ts"] = float(message["monnit_ts"])
            sensor_data["gateway_id"] = gateway_data["gateway_id"]

            data_connector_data["data_connector_id"] = message["data_connector"]
            data_connector_data["data_connector_ts"] = float(message["monnit_sensormgr_ts"])
            sensor_data["data_connector_id"] = data_connector_data["data_connector_id"]
        
        except KeyError as ke:
            self.logger.error("Monnit message not well formed : " + str(ke) + "\n" + str(message))
        
        return sensor_data, gateway_data, data_connector_data
