#!/usr/bin/python
#author: Dr. Jorge Merino
#organisation: University of Cambridge. Institute for Manufacturing.
#date: 2020.04.29
#license: GPL-3.0 (GNU General Public License version 3): https://opensource.org/licenses/GPL-3.0

import sys
import csv
import pandas as pd
#import xlrd
import json
import traceback
import logging
import os

###############################################
############## FILE I/O #######################
###############################################

def readFile(file_path):
    with open(file_path) as file_reader:
        data = file_reader.read()
    return data


def readJSON(file_path):
    json_data=None
    try:
        with open(file_path, 'r') as json_file:
            json_data = json.load(json_file)
    except (FileNotFoundError, IOError) as ioe:
        logging.error("JSON file not found: " + file_path)
        #traceback.print_stack()
    except json.JSONDecodeError as je:
        logging.error("JSON file not well formed: " + str(file_path) + "\n" + str(je))
        #print("JSON file not well formed: " + str(file_path) + "\n" + str(je))
    return json_data

def writeJSON(file_path, json_data):
    with open(file_path, 'w') as out_file:
        json.dump(json_data, out_file)

def serialiseDict2JSON(dictionary):
    return json.dumps(dictionary)

def deserialiseJSON2Dict(json_str):
    json_data=dict()
    try:
        json_data=json.loads(json_str)
    except json.JSONDecodeError as je:
        logging.info(je)
        logging.info(json_str)
    return json_data

def getFileFormat(file_path):
    parts=file_path.split(".")
    format=parts[len(parts)-1]
    return format

def getFullPath(a_path):
    return os.path.join(os.path.dirname(__file__), os.pardir, a_path) if not a_path.startswith("/") else a_path

def ls(dpath, recursive=False, ls_type="all"):
    ls_list=list()
    full_path_ls_list=list()
    if(os.path.exists(dpath) and os.path.isdir(dpath)):
        if(ls_type=="all"): ls_list=os.listdir(dpath)
        if(ls_type=="file"): ls_list=[f for f in os.listdir(dpath) if os.path.isfile(os.path.join(dpath, f))]
        if(ls_type=="dir"): ls_list=[f for f in os.listdir(dpath) if os.path.isdir(os.path.join(dpath, f))]
    full_path_ls_list = [os.path.join(dpath, f) for f in ls_list]
    if (recursive):
        if (ls_type=="file"):
            #all the sub-folders
            sub_list= [os.path.join(dpath, f) for f in os.listdir(dpath) if os.path.isdir(os.path.join(dpath, f))]
        else: sub_list = full_path_ls_list
        
        for sub_path in sub_list:
            if(os.path.isdir(sub_path)):
                ls_sublist, fp_ls_sublist = ls(os.path.join(dpath, sub_path), recursive, ls_type)
                ls_list+= ls_sublist
                full_path_ls_list+=fp_ls_sublist

    # list.sort() sorts the list but returns None
    ls_list.sort()
    full_path_ls_list.sort()

    return ls_list, full_path_ls_list

    
################################################
############### CONFIG #########################
################################################

def read_config(config_file_path):
    return readJSON(config_file_path)
    
def read_configs(configs_dir_path):
    cfgs=[]
    _, fp_cfgs_paths=ls(configs_dir_path, ls_type="file")
    
    for cfg_path in fp_cfgs_paths:
        cfgs.append(readJSON(cfg_path))
        
    return cfgs


def getBasicConfig(basic_cfg_file_path="./cfg/basic.cfg"):
    basic_cfg_file_path=getFullPath(basic_cfg_file_path)
    basic_cfg = read_config(basic_cfg_file_path)
    if not basic_cfg:
        basic_cfg = {
	    "logging_dirpath" : "./log/",
	    "sensor_parameters_path": "etl/static/sensor_parameters.json",
	    "etl_default": {
                "rt_cfg": {
		    "rt_type" : "mqtt",
		    "mqtt_cfg" : {
			"mqtt_client_name" : "vs_mqtt",
			"mqtt_username" : "csn-node",
			"mqtt_password" : "csn-node",
		   	"mqtt_host" : "localhost",
		   	"mqtt_port" : 1883,
		   	"mqtt_topics_prefix" : {"other": ["csn/+", "acp/+"], "lora": ["v3/+/devices/+/up"]},
			"mqtt_topics_in" : [],
		   	"mqtt_topic_out" : "mqtt_vs/vs_mqtt"
		    }
		},
		"db_cfg" : {
		    "db_type" : "file", 
		    "fs_data_paths" : ["/media/acp/mqtt_csn/sensors/", "/media/acp/mqtt_ttn/sensors/", "/media/acp/mqtt_acp/sensors/"]
                }
	    }
        }

    return basic_cfg


def getMQTTConfig(mqtt_cfg_file_path = "./cfg/mqtt.cfg"):
    if (mqtt_cfg_file_path == ""): mqtt_cfg_file_path = "./cfg/mqtt.cfg"
    mqtt_cfg_file_path = getFullPath(mqtt_cfg_file_path)
    
    mqtt_cfg=read_config(mqtt_cfg_file_path)
    return mqtt_cfg

def getMailConfig(mail_cfg_file_path = "./cfg/mail.cfg"):
    if (mail_cfg_file_path == ""): mail_cfg_file_path = "./cfg/mail.cfg"
    mail_cfg_file_path = getFullPath(mail_cfg_file_path)
    
    mail_cfg=read_config(mail_cfg_file_path)
    return mail_cfg

def readLastUpdateFile(last_update_file_path="./data/last_update.json"):
    if (last_update_file_path == ""): last_update_file_path = "./data/last_update.json"
    
    last_update_file_path = getFullPath(last_update_file_path)
    return readJSON(last_update_file_path)

###############################################
############### Utils #########################
###############################################

def getrowID(dict, key, ids):
    index=-1
    for entry in dict:
        thisIsIt=True
        for id in ids:
            if(dict[entry][id] != key[id]):
                thisIsIt = False
        if thisIsIt:
            index = entry

    return index

def storerowID(dict,ids,key,index):
    rowID = {}
    for id in ids:
        rowID[id]=key[id]
    dict[index]=rowID

def isNumber(number):
    isNumber=False
    try:
        int(number)
        isNumber=True
    except Exception:
        isNumber=False
    return isNumber


################################################
########## Attributes Parsing ##################
################################################
import argparse
def parseAttributes_basic(argv):
    filename=None
    help=False
    #print(argv)
    i=0
    while i < len(argv):
        if argv[i] == "--help":
            help=True
            i=len(argv)
        else:
            #print("Here: " + argv[i])
            if(getFileFormat(argv[i]) == "json" or getFileFormat(argv[i]) == "csv"):
                filename=argv[i]
            else:
                help=True
                i=len(argv)
        i+=1

    if filename == None:
        help=True
    return filename, help

def parseAttributes(argv):
    help=False

    argParser = argparse.ArgumentParser()
    #parser = argparse.ArgumentParser(
                    #prog='ProgramName',
                    #description='What the program does',
                    #epilog='Text at the bottom of help')
    argParser.add_argument("-c", "--cfg", help="Configuration file path")
    try:
        args=argParser.parse_args(argv)
    except argparse.ArgumentError:
        print('Catching an argumentError')
        help=True
        
    
    return help, args
    
    
