import logging
import json
import sys
import os
import pathlib
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from etl.decoders.decoder_monnit import Decoder_Monnit
from etl.decoders.decoder_ifmbms import Decoder_IFMBMS
from etl.decoders.decoder_ttn import Decoder_TTN
from etl.decoders.decoder_notifier import Decoder_Notifier

class Decoder():
    @staticmethod
    def transform(msg, topic=None, logger=logging.getLogger()):
        transformed_msg=dict()
        try:
            message = io.deserialiseJSON2Dict(msg)
            #logger.info("JSON message : " + str(message))
        except (json.JSONDecodeError, NameError) as je:
            logger.error("Message contains a NON valid JSON => \n" + msg +"\n"+ je)
            return

        #ToDo: do your transformation
        #transformed_msg=message.copy()
        
        if (not message): return
        sensor_data, gateway_data, data_connector_data, service_data = Decoder.extractData(message, topic, logger=logger)

        #logger.info("Message Parts: " + str(sensor_data) + " - " +  str(gateway_data) + " - " + str(data_connector_data) + " - "+ str(service_data))
        
        if (not sensor_data and not gateway_data and not data_connector_data and not service_data): return
        
        transformed_msg["sensor"]=sensor_data
        transformed_msg["gateway"]=gateway_data
        transformed_msg["data_connector"]=data_connector_data
        transformed_msg["service"]=service_data

        return transformed_msg

    @staticmethod
    def extractData(message, topic=None, logger=logging.getLogger()):
        service_data = dict()
        sensor_data = dict()
        gateway_data = dict()
        data_connector_data = dict()
        decoders={
            "monnit" : Decoder_Monnit(logger=logger),
            "ifmbms" : Decoder_IFMBMS(logger=logger),
            "ttn" : Decoder_TTN(logger=logger),
            "notifier" : Decoder_Notifier(logger=logger)
        }
        if(message):
            if ("msg_type" in message and message["msg_type"]=="rt_data" and "request_data" in message): #when data from ACP WS
                message=message["request_data"][0]
                topic=None
                #logger.debug("======", message)

            if (topic and "notifier" in topic):
                #sensor_data, gateway_data, data_connector_data = self.extractTTNData(message, topic)
                sensor_data, gateway_data, data_connector_data, service_data = decoders["notifier"].decode(message, topic)
            if ((topic and "monnit" in topic) or "monnit_gw" in message):
                #sensor_data, gateway_data, data_connector_data = self.extractMonnitData(message, topic)
                sensor_data, gateway_data, data_connector_data = decoders["monnit"].decode(message, topic)
            if ((topic and "IfM-BMS" in topic) or "point_id" in message):
                #sensor_data, gateway_data, data_connector_data = self.extractIfMBMSData(message, topic)
                sensor_data, gateway_data, data_connector_data = decoders["ifmbms"].decode(message, topic)
            if ((topic and "ttn" in topic) or "end_device_ids" in message):
                #sensor_data, gateway_data, data_connector_data = self.extractTTNData(message, topic)
                sensor_data, gateway_data, data_connector_data = decoders["ttn"].decode(message, topic)


        return sensor_data, gateway_data, data_connector_data, service_data
