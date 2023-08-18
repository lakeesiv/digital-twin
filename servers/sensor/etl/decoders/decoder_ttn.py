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

DEBUG = False

import base64

class Decoder_TTN(Decoder_Abstract):
    def __init__(self, logger=logging.getLogger()):
        self.logger=logger
        
    def decode(self, message, topic=None):
        sensor_data = dict()
        gateway_data = dict()
        data_connector_data = dict()

        # First lets set a flag for which version of TTN we're dealing with
        ttn_version = 3 if (topic is None or topic.startswith("v3/")) else 2

        if DEBUG:
            self.logger.debug(f'\nEnlink decode() V{ttn_version}\n{message_bytes}')

        if DEBUG:
            self.logger.debug("Enlink decode str {}".format(message))


        # extract sensor id
        # add acp_id to original message
        if ttn_version==2:
            message["acp_id"] = message["dev_id"]
        else:
            message["acp_id"] = message["end_device_ids"]["device_id"]

        type_array = message["acp_id"].split("-")

        if len(type_array) >= 3:
            message["acp_type_id"] = type_array[0]+"-"+type_array[1]

        if ttn_version==2:
            rawb64 = message["payload_raw"]
        else:
            rawb64 = message["uplink_message"]["frm_payload"]

        if DEBUG:
            print("Enlink decode() rawb64 {}".format(rawb64))

        try:
            sensor_data["sensor_id"] = message["acp_id"]
            sensor_data["acp_id"] = message["acp_id"]
            sensor_data["sensor_ts"] = self.ttnts2epoch(message["uplink_message"]["received_at"])
            sensor_data["acp_ts"] = sensor_data["sensor_ts"]
            if("decoded_payload" in message["uplink_message"]):
                sensor_data["decoded_payload"] = message["uplink_message"]["decoded_payload"]

            sensor_data["encoded_payload"] = message["uplink_message"]["frm_payload"]

            sensor_data["cooked_payload"] = self.decode_enlink(self.b64toBytes(sensor_data["encoded_payload"]))
            #self.logger.info("Decoded: ", str(sensor_data["cooked_payload"]))
            

            sensor_data["sensor_singal_strength"] = float(message["uplink_message"]["rx_metadata"][0]["rssi"])
            
            gateway_data["gateway_id"] = message["uplink_message"]["rx_metadata"][0]["gateway_ids"]["gateway_id"]
            if("timestamp" in message["uplink_message"]["rx_metadata"][0]):
                gateway_data["gateway_ts"] = float(message["uplink_message"]["rx_metadata"][0]["timestamp"])
            elif("received_at" in message["uplink_message"]["rx_metadata"][0]):
                gateway_data["gateway_ts"] = self.ttnts2epoch(message["uplink_message"]["rx_metadata"][0]["received_at"])
            else:
                gateway_data["gateway_ts"] = None
                
            sensor_data["gateway_id"] = gateway_data["gateway_id"]

            data_connector_data["data_connector_id"] = message["end_device_ids"]["application_ids"]["application_id"]
            data_connector_data["data_connector_dev_eui"] = message["end_device_ids"]["dev_eui"]
            if ("timestamp" in message["uplink_message"]["settings"]):
                data_connector_data["data_connector_ts"] = float(message["uplink_message"]["settings"]["timestamp"])
            elif ("received_at" in message["uplink_message"]["settings"]):
                data_connector_data["data_connector_ts"] = self.ttnts2epoch(message["uplink_message"]["settings"]["received_at"])
            else:
                data_connector_data["data_connector_ts"] = None
            sensor_data["data_connector_id"] = data_connector_data["data_connector_id"]
            
        
        except KeyError as ke:
            self.logger.error("TTN message not well formed : " + str(ke) + "\n" + str(message))
            sensor_data = None
        
        return sensor_data, gateway_data, data_connector_data


    def ttnts2epoch (self, ttn_ts):
        try:
            epoch=datetime.fromisoformat(ttn_ts).timestamp()
        except (AttributeError, ValueError) as ae:
            #self.logger.error("Bad Attribute transformation of datetime " + str(ttn_ts))
            epoch=datetime.strptime(ttn_ts[:25], "%Y-%m-%dT%H:%M:%S.%f").timestamp()

        return epoch

    def b64toBytes(self,b64):
        if DEBUG:
            self.logger.debug("b64toBytes")
        return base64.b64decode(b64)  
    
    def decode_enlink(self, encoded_msg_bytes):
        data = encoded_msg_bytes
        warnings = []
        errors = []

        # Return gas name from gas type byte
        GAS_HCHO_CH2O = 0x17 # Formaldehyde 
        GAS_VOCs = 0x18 # vocs 
        GAS_CO = 0x19 # Carbon Monoxide 
        GAS_CL2 = 0x1A # Chlorine 
        GAS_H2 = 0x1B # Hydrogen 
        GAS_H2S = 0x1C # Hydrogen Sulphide
        GAS_HCl = 0x1D # Hydrogen Chloride
        GAS_HCN = 0x1E # Hydrogen Cyanide
        GAS_HF = 0x1F # Hydrogen Fluoride
        GAS_NH3 = 0x20 # Ammonia
        GAS_NO2 = 0x21 # Nitrogen Dioxide
        GAS_O2 = 0x22 # Oxygen
        GAS_O3 = 0x23 # Ozone
        GAS_SO2 = 0x24 # Sulfur Dioxide (IUPAC) SO2
         
        ENLINK_TEMP = 0x01
        ENLINK_RH = 0x02
        ENLINK_LUX = 0x03
        ENLINK_PRESSURE = 0x04
        ENLINK_VOC_IAQ = 0x05
        ENLINK_O2PERC = 0x06
        ENLINK_CO = 0x07
        ENLINK_CO2 = 0x08
        ENLINK_OZONE = 0x09
        ENLINK_POLLUTANTS = 0x0A
        ENLINK_PM25 = 0x0B
        ENLINK_PM10 = 0x0C
        ENLINK_H2S = 0x0D
        ENLINK_COUNTER = 0x0E
        ENLINK_MB_EXCEPTION = 0x0F
        ENLINK_MB_INTERVAL = 0x10
        ENLINK_MB_CUMULATIVE = 0x11
        ENLINK_BVOC = 0x12
        ENLINK_DETECTION_COUNT = 0x13
        ENLINK_OCC_TIME = 0x14
        ENLINK_COS_STATUS = 0x15
        ENLINK_LIQUID_LEVEL_STATUS = 0x16
        ENLINK_TEMP_PROBE1 = 0x17
        ENLINK_TEMP_PROBE2 = 0x18
        ENLINK_TEMP_PROBE3 = 0x19
        ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1 = 0x1A
        ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2 = 0x1B
        ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3 = 0x1C
        ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1 = 0x1D
        ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2 = 0x1E
        ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3 = 0x1F
        ENLINK_TEMP_PROBE_LOW_DURATION_S_1 = 0x20
        ENLINK_TEMP_PROBE_LOW_DURATION_S_2 = 0x21
        ENLINK_TEMP_PROBE_LOW_DURATION_S_3 = 0x22
        ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1 = 0x23
        ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2 = 0x24
        ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3 = 0x25
        ENLINK_TEMP_PROBE_HIGH_DURATION_S_1 = 0x26
        ENLINK_TEMP_PROBE_HIGH_DURATION_S_2 = 0x27
        ENLINK_TEMP_PROBE_HIGH_DURATION_S_3 = 0x28
        ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1 = 0x29
        ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2 = 0x2A
        ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3 = 0x2B
    
        ENLINK_DIFF_PRESSURE = 0X2C
        ENLINK_AIR_FLOW = 0x2D
        ENLINK_VOLTAGE = 0x2E
        ENLINK_CURRENT = 0x2F
        ENLINK_RESISTANCE = 0x30
        ENLINK_LEAK_DETECT_EVT = 0x31
        ENLINK_CO2E = 0x3F
        
        ENLINK_SOUND_MIN = 0x50
        ENLINK_SOUND_AVG = 0x51
        ENLINK_SOUND_MAX = 0x52
        ENLINK_NO = 0x53
        ENLINK_NO2 = 0x54
        ENLINK_NO2_20 = 0x55
        ENLINK_SO2 = 0x56
        
        ENLINK_MC_PM1_0 = 0x57
        ENLINK_MC_PM2_5 = 0x58
        ENLINK_MC_PM4_0 = 0x59
        ENLINK_MC_PM10_0 = 0x5A
        ENLINK_NC_PM0_5 = 0x5B
        ENLINK_NC_PM1_0 = 0x5C
        ENLINK_NC_PM2_5 = 0x5D
        ENLINK_NC_PM4_0 = 0x5E
        ENLINK_NC_PM10_0 = 0x5F
        ENLINK_PM_TPS = 0x60

        ENLINK_GAS_PPB = 0x61
        ENLINK_GAS_UGM3 = 0x66

        ENLINK_CRN_THK = 0x62
        ENLINK_CRN_MIN_THK = 0x63
        ENLINK_CRN_MAX_THK = 0x64
        ENLINK_CRN_PERC = 0x65
        ENLINK_FAST_AQI = 0x67
        ENLINK_EPA_AQI = 0x68

	# More Particulate Matter
        ENLINK_MC_PM0_1 = 0x69
        ENLINK_MC_PM0_3 = 0x6A
        ENLINK_MC_PM0_5 = 0x6B
        ENLINK_MC_PM5_0 = 0x6C

        ENLINK_NC_PM0_1 = 0x6D
        ENLINK_NC_PM0_3 = 0x6E
        ENLINK_NC_PM5_0 = 0x6F
	# IPS7100 Particulate Detection Events - type counts
        ENLINK_DE_EVENT = 0x70
        ENLINK_DE_SMOKE = 0x71
        ENLINK_DE_VAPE = 0x72
	# Optional KPI values that can be included in the message
        ENLINK_CPU_TEMP_DEP = 0x40
        ENLINK_BATT_STATUS = 0x41
        ENLINK_BATT_VOLT = 0x42
        ENLINK_RX_RSSI = 0x43
        ENLINK_RX_SNR = 0x44
        ENLINK_RX_COUNT = 0x45
        ENLINK_TX_TIME = 0x46
        ENLINK_TX_POWER = 0x47
        ENLINK_TX_COUNT = 0x48
        ENLINK_POWER_UP_COUNT = 0x49
        ENLINK_USB_IN_COUNT = 0x4A
        ENLINK_LOGIN_OK_COUNT = 0x4B
        ENLINK_LOGIN_FAIL_COUNT = 0x4C
        ENLINK_FAN_RUN_TIME = 0x4D
        ENLINK_CPU_TEMP = 0x4E
        
        #cpn=0
        #metal=0
        obj = {}
        i=0
        while(i<len(data)):
            # Parse Sensor Message Parts
            if data[i] == ENLINK_TEMP: # Temperature
                obj["temperature"] = ( self.S16( (data[i + 1] << 8) | (data[i + 2]) ) ) / 10
		#obj["temperature_f"] = ((obj["temperature"] * 9 / 5) + 32)
                i += 2

            elif data[i] == ENLINK_RH: # Humidity %rH
                obj["humidity"] = (data[i + 1])
                i += 1

            elif data[i] == ENLINK_LUX: # Light Level lux
                obj["lux"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_PRESSURE: # Barometric Pressure
                obj["pressure"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_VOC_IAQ: # Indoor Air Quality (0-500)
                obj["iaq"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_O2PERC: # O2 percentage
                obj["o2perc"] = (data[i + 1]) / 10
                i += 1
                
            elif data[i] == ENLINK_CO: # Carbon Monoxide
                obj["co_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 100
                i += 2
                
            elif data[i] == ENLINK_CO2: # Carbon Dioxide
                obj["co2_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2
                
            elif data[i] == ENLINK_OZONE: # Ozone ppm and ppb
                obj["ozone_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 10000
                obj["ozone_ppb"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 10
                i += 2

            elif data[i] == ENLINK_POLLUTANTS: # Pollutants kOhm
                obj["pollutants_kohm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 10
                i += 2

            elif data[i] == ENLINK_PM25: # Particulates @2.5
                obj["pm2_5"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_PM10: # Particulates @10
                obj["pm10"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_H2S: # Hydrogen Sulphide
                obj["h2s_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 100
                i += 2

            elif data[i] == ENLINK_COUNTER:
                inputN = data[i + 1]
                pulseCount = (data[i + 2] << 24) | (data[i + 3] << 16) | (data[i + 4] << 8) | (data[i + 5])
                if (inputN == 0x00): obj["pulse_ip1"] = pulseCount
                if (inputN == 0x01): obj["pulse_ip2"] = pulseCount
                if (inputN == 0x02): obj["pulse_ip3"] = pulseCount
                i += 5

            elif data[i] == ENLINK_MB_EXCEPTION: # Modbus Error Code
                if (obj["mb_ex"]):
                    obj["mb_ex"].append([data[i + 1], data[i + 2]])
                else:
                    obj["mb_ex"] = [[data[i + 1], data[i + 2]]]
                i += 2
                
            elif data[i] == ENLINK_MB_INTERVAL: # Modbus Interval Read
                if (obj["mb_int_val"]):
                    obj["mb_int_val"].append([data[i + 1], self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])])
                else:
                    obj["mb_int_val"] = [[data[i + 1], self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]]
                i += 5

            elif data[i] == ENLINK_MB_CUMULATIVE: # Modbus Cumulative Read
                if (obj["mb_cum_val"]):
                    obj["mb_cum_val"].append([data[i + 1], self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])])
                else:
                    obj["mb_cum_val"] = [[data[i + 1], self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])]]
                i += 5
                
            elif data[i] == ENLINK_BVOC:     # Breath VOC Estimate equivalent
                obj["bvoc"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_DETECTION_COUNT:
                obj["det_count"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_OCC_TIME: # Occupied time in seconds
                obj["occ_time_s"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_COS_STATUS: # Change-of-State U16
                # Byte 1 = Triggered, Byte 2 = Input state
                '''
		obj["cos_trig_byte"] = '0x' + ('0' + (data[i + 1]).toString(16).toUpperIf Data[I] ==()).slice(-2)
		if (data[i + 1] == 0):
                    # Transmission was triggered with button press or ATI timeout
		    # So it's a 'heartbeat'
		    obj["cos_hb"] = 1
		else:
		'''
                # If (data[i + 1] > 0) transmission was triggered with a Change of State
                # Transition detected for Closed to Open
                b = false
                b = (data[i + 1] & 0x01) > 0
                obj["cos_ip_1_hl"] = 1 if b else 0

                b = (data[i + 1] & 0x02) > 0
                obj["cos_ip_2_hl"] = 1 if b else 0

                b = (data[i + 1] & 0x04) > 0
                obj["cos_ip_3_hl"] = 1 if b else 0

                # Transition detected for Open to Closed
                b = (data[i + 1] & 0x10) > 0
                obj["cos_ip_1_lh"] = 1 if b else 0

                b = (data[i + 1] & 0x20) > 0
                obj["cos_ip_2_lh"] = 1 if b else 0

                b = (data[i + 1] & 0x40) > 0
                obj["cos_ip_3_lh"] = 1 if b else 0

                # Input State
                #obj["state_byte"] = '0x' + ('0' + (data[i + 2]).toString(16).toUpperIf Data[I] ==()).slice(-2)
                obj["state_ip_1"] = 1 if (data[i + 2] & 0x01) else 0
                obj["state_ip_2"] = 1 if (data[i + 2] & 0x02) else 0
                obj["state_ip_3"] = 1 if (data[i + 2] & 0x04) else 0
                i += 2

            elif data[i] == ENLINK_LIQUID_LEVEL_STATUS: # 1 byte U8, 1 or 0, liquid level status
                obj["liquid_detected"] = True if (data[i + 1]) else False
                i += 1

            elif data[i] == ENLINK_TEMP_PROBE1:
                obj["temp_probe_1"] = self.S16((data[i + 1] << 8 | data[i + 2])) / 10
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE2:
                obj["temp_probe_2"] = self.S16((data[i + 1] << 8 | data[i + 2])) / 10
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE3:
                obj["temp_probe_3"] = self.S16((data[i + 1] << 8 | data[i + 2])) / 10
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_1:
                # Cumulative detection time u32
                obj["temp_probe_in_band_duration_s_1"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_2:
                # Cumulative detection time u32
                obj["temp_probe_in_band_duration_s_2"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_IN_BAND_DURATION_S_3:
                # Cumulative detection time u32
                obj["temp_probe_in_band_duration_s_3"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_1:
                # In band alarm events u16
                obj["temp_probe_in_band_alarm_count_1"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_2:
                # In band alarm events u16
                obj["temp_probe_in_band_alarm_count_2"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_IN_BAND_ALARM_COUNT_3:
                # In band alarm events u16
                obj["temp_probe_in_band_alarm_count_3"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_LOW_DURATION_S_1:
		# Cumulative detection time u32
                obj["temp_probe_low_duration_s_1"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_LOW_DURATION_S_2:
                # Cumulative detection time u32
                obj["temp_probe_low_duration_s_2"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_LOW_DURATION_S_3:
                # Cumulative detection time u32
                obj["temp_probe_low_duration_s_3"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_1:
                # Low alarm events u16
                obj["temp_probe_low_alarm_count_1"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_2:
                # Low alarm events u16
                obj["temp_probe_low_alarm_count_2"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_LOW_ALARM_COUNT_3:
                # Low alarm events u16
                obj["temp_probe_low_alarm_count_3"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_HIGH_DURATION_S_1:
                # Cumulative detection time u32
                obj["temp_probe_high_duration_s_1"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_HIGH_DURATION_S_2:
                # Cumulative detection time u32
                obj["temp_probe_high_duration_s_2"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_HIGH_DURATION_S_3:
                # Cumulative detection time u32
                obj["temp_probe_high_duration_s_3"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4

            elif data[i] == ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_1:
                # High alarm events u16
                obj["temp_probe_high_alarm_count_1"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_2:
                # High alarm events u16
                obj["temp_probe_high_alarm_count_2"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TEMP_PROBE_HIGH_ALARM_COUNT_3:
                # High alarm events u16
                obj["temp_probe_high_alarm_count_3"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_DIFF_PRESSURE: # 4 bytes F32, +/- 5000 Pa
                obj["dp_pa"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_AIR_FLOW: # 4 bytes F32, 0 -> 100m/s
                obj["af_mps"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_VOLTAGE: # 2 bytes U16, 0 to 10.000 V
                obj["adc_v"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 1000
                i += 2

            elif data[i] == ENLINK_CURRENT: # 2 bytes U16, 0 to 20.000 mA
                obj["adc_ma"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 1000
                i += 2

            elif data[i] == ENLINK_RESISTANCE: # 2 bytes U16, 0 to 6553.5 kOhm
                obj["adc_kohm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 10
                i += 2

            elif data[i] == ENLINK_LEAK_DETECT_EVT: # 1 byte U8, Leak status changed
                obj["leak_detect_event"] = True if (data[i + 1]) else False
                i += 1

            elif data[i] == ENLINK_CO2E: # CO2e Estimate Equivalent
                obj["co2e_ppm"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_SOUND_MIN:
                obj["sound_min_dba"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_SOUND_AVG:
                obj["sound_avg_dba"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_SOUND_MAX:
                obj["sound_max_dba"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NO: # Nitric Oxide
                obj["no_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 100
                i += 2

            elif data[i] == ENLINK_NO2: # Nitrogen Dioxide scaled at 0-5ppm
                obj["no2_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 10000
                i += 2

            elif data[i] == ENLINK_NO2_20: # Nitrogen Dioxide scaled at 0-20ppm
                obj["no2_20_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 1000
                i += 2

            elif data[i] == ENLINK_SO2: # Sulphur Dioxide 0-20ppm
                obj["so2_ppm"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 1000
                i += 2

            elif data[i] == ENLINK_MC_PM0_1:
                obj["mc_pm0_1"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM0_3:
                obj["mc_pm0_3"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM0_5:
                obj["mc_pm0_5"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM1_0:
                obj["mc_pm1_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM2_5:
                obj["mc_pm2_5"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM4_0:
                obj["mc_pm4_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM5_0:
                obj["mc_pm5_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_MC_PM10_0:
                obj["mc_pm10_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM0_1:
                obj["nc_pm0_1"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM0_3:
                obj["nc_pm0_3"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM0_5:
                obj["nc_pm0_5"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM1_0:
                obj["nc_pm1_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM2_5:
                obj["nc_pm2_5"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM4_0:
                obj["nc_pm4_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM5_0:
                obj["nc_pm5_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_NC_PM10_0:
                obj["nc_pm10_0"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_PM_TPS:
                obj["pm_tps"] = self.fromF32(data[i + 1], data[i + 2], data[i + 3], data[i + 4])
                i += 4

            elif data[i] == ENLINK_DE_EVENT:
                # Particle Detection Event
                # Event raised, not yet identified
                obj["de_event"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_DE_SMOKE:
                #Smoke particles identified
                obj["de_smoke"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_DE_VAPE:
                # Vape particles identified
                obj["de_vape"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_GAS_PPB:
                if data[i+1] == GAS_HCHO_CH2O:
                    obj["HCHO_CH2O_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_VOCs:
                    obj["VOCs_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_CO:
                    obj["CO_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_CL2:
                    obj["CL2_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_H2:
                    obj["H2_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_H2S:
                    obj["H2S_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_HCl:
                    obj["HCl_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_HCN:
                    obj["HCN_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_HF:
                    obj["HF_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_NH3:
                    obj["NH3_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_NO2:
                    obj["NO2_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_O2:
                    obj["O2_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_O3:
                    obj["O3_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_SO2:
                    obj["SO2_ppb"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                i += 5

            elif data[i] == ENLINK_GAS_UGM3:
                if data[i+1] == GAS_HCHO_CH2O:
                    obj["HCHO_CH2O_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_VOCs:
                    obj["VOCs_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_CO:
                    obj["CO_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_CL2:
                    obj["CL2_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_H2:
                    obj["H2_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_H2S:
                    obj["H2S_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_HCl:
                    obj["HCl_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_HCN:
                    obj["HCN_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_HF:
                    obj["HF_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_NH3:
                    obj["NH3_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_NO2:
                    obj["NO2_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_O2:
                    obj["O2_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_O3:
                    obj["O3_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                elif data[i+1] == GAS_SO2:
                    obj["SO2_ugm3"] = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])

                i += 5

            elif data[i] == ENLINK_CRN_THK:
                # Coupon is either 1 or 2. Bit 7 set for Coupon 2
                cpn = 1 if (data[i + 1] & 0x80) == 0 else 2
                metal = self.GetCrnMetal(data[i + 1])
                # Thickness in nanometres
                thk_nm = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                # As Array
                if (obj["crn_thk_nm"]):
                    obj["crn_thk_nm"].append([cpn, metal, thk_nm])
                else:
                    obj["crn_thk_nm"] = [[cpn, metal, thk_nm]]

                i += 5

            elif data[i] == ENLINK_CRN_MIN_THK:
                cpn = 1 if (data[i + 1] & 0x80) == 0 else 2
                metal = self.GetCrnMetal(data[i + 1])
                # Minimum thickness of metal
                min_nm = self.U16((data[i + 2] << 8) | (data[i + 3]))
                # As Array
                if (obj["crn_min_nm"]):
                    obj["crn_min_nm"].append([cpn, metal, min_nm])
                else:
                    obj["crn_min_nm"] = [[cpn, metal, min_nm]]
                i += 3

            elif data[i] == ENLINK_CRN_MAX_THK:
                cpn = 1 if (data[i + 1] & 0x80) == 0 else 2
                metal = self.GetCrnMetal(data[i + 1])
                # Original thickness of metal
                max_nm = self.U16((data[i + 2] << 8) | (data[i + 3]))
                # As Array
                if (obj["crn_max_nm"]):
                    obj["crn_max_nm"].append([cpn, metal, max_nm])
                else:
                    obj["crn_max_nm"] = [[cpn, metal, max_nm]]
                i += 3

            elif data[i] == ENLINK_CRN_PERC:
                cpn = 1 if (data[i + 1] & 0x80) == 0 else 2
                metal = self.GetCrnMetal(data[i + 1])
                # Corrosion of coupon in percentage from Max(0%) to Min(100%)
                perc = self.fromF32(data[i + 2], data[i + 3], data[i + 4], data[i + 5])
                # As Array
                if (obj["crn_perc"]):
                    obj["crn_perc"].append([cpn, metal, perc])
                else:
                    obj["crn_perc"] = [[cpn, metal, perc]]
                i += 5

            elif data[i] == ENLINK_FAST_AQI:
                obj["fast_aqi"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_EPA_AQI:
                obj["epa_aqi"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

	    # < -------------------------------------------------------------------------------->
	    # Optional KPIs
            elif data[i] == ENLINK_CPU_TEMP_DEP:    # Optional from April 2020
                obj["cpu_temp_dep"] = data[i + 1] + (round(data[i + 2] * 100 / 256) / 100)
                i += 2

            elif data[i] == ENLINK_CPU_TEMP:    # New for April 2020 Ver: 4.9
                obj["cpu_temp"] = (self.S16((data[i + 1] << 8) | (data[i + 2]))) / 10
                i += 2

            elif data[i] == ENLINK_BATT_STATUS:
                obj["batt_status"] = data[i + 1]
                i += 1

            elif data[i] == ENLINK_BATT_VOLT:
                obj["batt_v"] = self.U16((data[i + 1] << 8) | (data[i + 2])) / 1000
                obj["batt_mv"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_RX_RSSI:
                obj["rx_rssi"] = self.S16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_RX_SNR:
                obj["rx_snr"] = self.S8(data[i + 1])
                i += 1

            elif data[i] == ENLINK_RX_COUNT:
                obj["rx_count"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TX_TIME:
                obj["tx_time_ms"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_TX_POWER:
                obj["tx_power_dbm"] = self.S8(data[i + 1])
                i += 1

            elif data[i] == ENLINK_TX_COUNT:
                obj["tx_count"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_POWER_UP_COUNT:
                obj["power_up_count"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i+= 2

            elif data[i] == ENLINK_USB_IN_COUNT:
                obj["usb_in_count"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_LOGIN_OK_COUNT:
                obj["login_ok_count"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_LOGIN_FAIL_COUNT:
                obj["login_fail_count"] = self.U16((data[i + 1] << 8) | (data[i + 2]))
                i += 2

            elif data[i] == ENLINK_FAN_RUN_TIME:
                obj["fan_run_time_s"] = self.U32((data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4]))
                i += 4
            else: # something is wrong with data
                obj["error"] = "Error at " + str(i) + " byte value " + str(data[i])
                i = len(data)

            i+=1

        return obj

    # Convert binary value bit to Signed 8 bit
    def S8(self, binary):
        num = binary & 0xFF
        if (0x80 & num):
            num = -(0x0100 - num)
        return num
    

    # Convert binary value bit to Signed 16 bit
    def S16(self, binary):
        num = binary & 0xFFFF
        if (0x8000 & num):
            num = -(0x010000 - num)
        return num
    
    # Useful conversion functions
    # S16 -> U16
    def U16(self, ival):
        if (self.isNaN(ival) == False):
            if (ival < 0):
                ival = ival + 65536
        return ival
    
    # S32 -> U32 convertIntToDWord
    def U32(self, ival):
        if (self.isNaN(ival) == False):
            if (ival < 0):
                ival = ival + 4294967296
        return ival
    
    # U32 -> S32 convertDWordToInt
    def S32(self, ival):
        if (self.isNaN(ival) == False):
            if (ival > 2147483647):
                ival = ival - 4294967296
        return ival
	
    # Convert 4 IEEE754 bytes
    def fromF32(self, byte0, byte1, byte2, byte3):
        bits = (byte0 << 24) | (byte1 << 16) | (byte2 << 8) | (byte3)
        #sign = 1.0 if ((bits >>> 31) == 0) else -1.0
        sign = 1.0 if (self.urshift(bits, 31) == 0) else -1.0
        #e = ((bits >>> 23) & 0xff)
        e = (self.urshift(bits, 23) & 0xff)
        m = (bits & 0x7fffff) << 1 if (e == 0) else (bits & 0x7fffff) | 0x800000
        f = sign * m * 2**(e - 150)
        return float(round(f,3))
    
    def isNaN(self, value):
        return (isinstance(value, int) or isinstance(value, long))

    def urshift(self, val, n):
        return val>>n if val >= 0 else (val+0x100000000)>>n
    
    # Corrosion: Return metal name from id byte
    def GetCrnMetal(self, id_byte):
        id = (id_byte & 0x7F)
        if id ==  0x00:
            return "Unknown"
        if id == 0x01:
            return "Copper"
        if id == 0x02:
            return "Silver"
        if id == 0x03:
            return "Chromium"
        return "Error"

