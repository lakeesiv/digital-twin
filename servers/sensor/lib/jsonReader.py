import json
import pandas as pd
import logging
import lib.iolibs as io
import sys
import os
import pathlib
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'etl/'))
from etl.decoders.decoder import Decoder

class JSONReader:
    def __init__(self, dpath, parameters = None, logger=logging.getLogger()):
        """
        Loads the json file in a dataframe and collects all sensor types available
        :param path: Path to the json file
        """
        self.logger=logger
        self.dpath = dpath
        self.parameters = parameters #filter monitoring parameters (if none load everything)
        #self.logger.debug(parameters)
    """
    loads the data from the json file
    :return:
    """
    def read_day_file(self):
        
        json_message_list = []
        message = None
    
        #sensor files are massive, so we need to account for memory.
        with open(self.dpath, 'r') as openfile:
            for line in openfile:
                #reset the message
                message = None
                try:
                    #load the message in a json object
                    #message=self.read_message(io.deserialiseJSON2Dict(line))
                    transformed_msg=Decoder.transform(line, logger=self.logger)
                    #self.logger.info(transformed_msg)
                    if(transformed_msg):
                        message=self.filter_message(transformed_msg)
                        #self.logger.info(message)
                    if (not message is None):
                        json_message_list.append(message)
                    
                except json.JSONDecodeError as je:
                    #this means one of the lines could not be converted to a json object
                    continue
        #self.logger.info(json_message_list)        
        #Transform into dataframe
        self.df = pd.DataFrame(json_message_list)
        #self.logger.info(self.df)

        if ("dp_ts" in self.df.columns): self.df.index = self.df["dp_ts"]

    def filter_message(self, message_dict):
        filter_dict = dict()
        #self.logger.info(message_dict)
        if ((not message_dict is None) and ("sensor" in message_dict)):
            try:
                if("data" in message_dict["sensor"]["decoded_payload"]):
                    for (k,v) in message_dict["sensor"]["decoded_payload"]["data"].items():
                        message_dict["sensor"][k]=v
                elif("decoded_payload" in message_dict["sensor"]):
                    for (k,v) in message_dict["sensor"]["decoded_payload"].items():
                        message_dict["sensor"][k]=v
                if("cooked_payload" in message_dict["sensor"]):
                    for (k,v) in message_dict["sensor"]["cooked_payload"].items():
                        message_dict["sensor"][k]=v
            except (KeyError,ValueError) as e:
                self.logger.error("Error while filtering the message" + str(message_dict) + " : \n" + str(e))
                #pass
        
            #self.logger.info(message_dict)

            if (self.parameters):
                #self.logger.debug(parameters)
                for key in self.parameters:
                    try:
                        filter_dict[key] = message_dict["sensor"][key]
                    except KeyError as ke:
                        #filter_dict=None
                        #self.logger.error(message_dict)
                        #self.logger.error(ke)
                        continue
        if (len(filter_dict.keys())==0): filter_dict=None
                
        return filter_dict
        
    def read_message(self, message_dict):
        try:
            for (k,v) in message_dict["uplink_message"]["decoded_payload"]["data"].items():
                message_dict[k]=v
        except (KeyError,ValueError) as e:
            pass

        #self.logger.info(message_dict)
        if (self.parameters):
            temp_message=message_dict.copy()
            message_dict.clear()
            try:
                message_dict = {key: temp_message[key] for key in self.parameters}
            except KeyError as ke:
                message_dict=None
                #self.logger.info(message_dict)
        return message_dict
    
