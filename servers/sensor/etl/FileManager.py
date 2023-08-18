import logging
import os
from os import path
import sys
import pathlib
from datetime import datetime
import dateutil
import pandas as pd
#sys.path.append(os.path.join(pathlib.Path(__file__).parent.absolute(), 'lib/'))
import lib.iolibs as io
from lib.jsonReader import JSONReader

class FileManager:
    def __init__(self, filedb_cfg, logger=logging.getLogger()):
        self.logger=logger
        self.filedb_cfg=filedb_cfg
        self.init_db()
        
    def init_db(self):
        self.default_start_date = datetime(2020, 1, 1, 0, 0) #default start date
        
        data_paths = self.filedb_cfg["fs_data_paths"]
        if(not isinstance(data_paths, list)):
           data_paths=[self.filedb_cfg["fs_data_paths"]]

        for dpath in data_paths:
           if(not self.check_path_in_fs(dpath)):
               data_paths.remove(dpath)

        self.filedb_cfg["fs_data_paths"]=data_paths

        self.sensor_paths, self.sensor_list=self.getSensorPaths(self.filedb_cfg["fs_data_paths"])
        
    def check_path_in_fs(self, dpath):
        return path.exists(dpath) and path.isdir(dpath)


    def store(self, message):
        #self.logger.info("Message: " + str(message))
        pass


    def read(self, query):
        if(not ("acp_id" in query and query["acp_id"] in self.sensor_list)):
            if(not "acp_id" in query):
                self.logger.warnign("FileManager.read - Sensor acp_id missing")
            else: self.logger.warn("FileManager.read - Sensor acp_id not in file system: " + str(query["acp_id"]))
            self.logger.warn("FileManager.read - Sensor list in FS: " + str(self.sensor_list))
            return
        dt_from, dt_to = self.getTimeRange(query)
        self.logger.info("Request made from " + str(dt_from) + " to " + str(dt_to))

        return self.readFromFS(self.sensor_paths[query["acp_id"]], query["acp_id"], dt_from, dt_to, query["parameters"])

    def readFromFS(self, sensor_path, acp_id, dt_from, dt_to, parameters):
        data_files, fp_data_files=io.ls(sensor_path, recursive=True, ls_type="file")
        #self.logger.info("data_files - " + str(len(data_files)) + " - " + str(len(fp_data_files)))
        #self.logger.info(data_files)
        #to do: add file data into a df only if in time range
        # check lib/jsonReader 
        df=pd.DataFrame()
        min_date=-1
        max_date=-1
        for i, f in enumerate(data_files):
            file_date=self.extract_datetime_from_filename(f)
            if(min_date==-1 or min_date>file_date): min_date=file_date
            if(max_date==-1 or max_date<file_date): max_date=file_date

            fileinrange=self.data_fileInRange(f, dt_from, dt_to)
            #self.logger.debug(f + " - in [" + str(dt_from) + ", " + str(dt_to) + "]: "  + str(fileinrange))
            if(fileinrange):
                #json_reader = JSONReader(fp_data_file[i], logger=self.logger)
                json_reader = JSONReader(fp_data_files[i], parameters, logger=self.logger)
                json_reader.read_day_file()
                f_data = json_reader.df
                #self.logger.debug(f_data)
                df=pd.concat([df,f_data])
        if(not df.empty):
            df['acp_ts']=df['acp_ts'].astype('float')
            df.sort_values(by='acp_ts', inplace = True)
            #self.logger.info(df)
        else:
            self.logger.warn("NO DATA RETRIEVED FOR " + str(acp_id) + " from " + str(dt_from) + " to " + str(dt_to) + " in " + str(sensor_path) + " with parameters " + str(parameters))
            self.logger.warn("AVAILABLE DATA between " + str(min_date) + " and " + str(max_date))

        return df


    def getSensorPaths(self, data_paths):
        sensor_paths_list=list()
        sensor_list=list()
        for dpath in data_paths:
            dpath_sensor_list, dpath_sensor_paths=io.ls(dpath, ls_type="dir")
            #sensor_paths_list+=[path.join(dpath, s) for s in dpath_sensor_list]
            sensor_paths_list+=dpath_sensor_paths
            sensor_list+=dpath_sensor_list

        sensor_paths=dict()
        for i, sensor in enumerate(sensor_list):
            sensor_paths[sensor]=sensor_paths_list[i]
        
        return sensor_paths, sensor_list

    def getTimeRange(self, query):
        datetime_from = self.default_start_date
        datetime_to=datetime.now()
        if("from" in query):
            try:
                datetime_from=dateutil.parser.parse(query["from"],dayfirst=True)
                #print(query["from"], datetime_from)
            except ValueError as ve:
                self.logger.warn(ve)
                datetime_from = self.default_start_date
    
        if("to" in query):
            if(query["to"]=="now"): datetime_to=datetime.now()
            else:
                try:
                    datetime_to=dateutil.parser.parse(query["to"],dayfirst=True)
                    #print(query["to"], datetime_to)
                except ValueError as ve:
                    self.logger.warn(ve)
                    datetime_to=datetime.now()
        return datetime_from, datetime_to       

    def extract_datetime_from_filename(self, file_name):
        #expected file_name format acp_id_YYYY-MM-DD.txt - e.g., 'enl-iaqco3-081622_2023-04-03.txt'
        file_date_str=file_name.split("_")[-1].split(".")[0] #should get the following format YYYY-MM-DD
        try:
            file_date=datetime.strptime(file_date_str, '%Y-%m-%d')
        except ValueError as ve:
            self.logger.error("Error while extracting the datetime from filename: " + file_name)
        return file_date
                    
    def data_fileInRange(self, file_name, dt_from, dt_to):
        file_date=self.extract_datetime_from_filename(file_name)
        #self.logger.info(file_name + " - file_date: " + str(file_date))
        return (file_date >= dt_from and file_date <= dt_to)
        
        
