#
# Elsys sensor decoder, supporting TTN v2 and v3 messages
#
# Instantiate with:
#
#    from decoders.elsys-v3 import Decoder as Elsys
#    decoder = Elsys(settings) # default settings=None
#    where:
#       settings["decoded_property"] contains property name to contain decoded message
#       e.g. settings["decoded_property"] = "payload_cooked" (default if settings=None)
#
# Implements:
#    test(topic, message_bytes): returns true|false whether this decoder will handle message
#    decode(topic, message_bytes): returns Python dictionary of original message + decoded_property.
#

DEBUG = False

import base64
import simplejson as json
import traceback
from datetime import datetime

TYPE_TEMP         = 0x01 #temp 2 bytes -3276.8°C -->3276.7°C
TYPE_RH           = 0x02 #Humidity 1 byte  0-100%
TYPE_ACC          = 0x03 #acceleration 3 bytes X,Y,Z -128 --> 127 +/-63=1G
TYPE_LIGHT        = 0x04 #Light 2 bytes 0-->65535 Lux
TYPE_MOTION       = 0x05 #No of motion 1 byte  0-255
TYPE_CO2          = 0x06 #Co2 2 bytes 0-65535 ppm
TYPE_VDD          = 0x07 #VDD 2byte 0-65535mV
TYPE_ANALOG1      = 0x08 #VDD 2byte 0-65535mV
TYPE_GPS          = 0x09 #3bytes lat 3bytes long binary
TYPE_PULSE1       = 0x0A #2bytes relative pulse count
TYPE_PULSE1_ABS   = 0x0B #4bytes no 0->0xFFFFFFFF
TYPE_EXT_TEMP1    = 0x0C #2bytes -3276.5C-->3276.5C
TYPE_EXT_DIGITAL  = 0x0D #1bytes value 1 or 0
TYPE_EXT_DISTANCE = 0x0E     #2bytes distance in mm
TYPE_ACC_MOTION   = 0x0F     #1byte number of vibration/motion
TYPE_IR_TEMP      = 0x10     #2bytes internal temp 2bytes external temp -3276.5C-->3276.5C
TYPE_OCCUPANCY    = 0x11     #1byte data
TYPE_WATERLEAK    = 0x12     #1byte data 0-255
TYPE_GRIDEYE      = 0x13     #65byte temperature data 1byte ref+64byte external temp
TYPE_PRESSURE     = 0x14     #4byte pressure data (hPa)
TYPE_SOUND        = 0x15     #2byte sound data (peak/avg)
TYPE_PULSE2       = 0x16     #2bytes 0-->0xFFFF
TYPE_PULSE2_ABS   = 0x17     #4bytes no 0->0xFFFFFFFF
TYPE_ANALOG2      = 0x18     #2bytes voltage in mV
TYPE_EXT_TEMP2    = 0x19     #2bytes -3276.5C-->3276.5C
TYPE_EXT_DIGITAL2 = 0x1A     # 1bytes value 1 or 0
TYPE_EXT_ANALOG_UV= 0x1B     # 4 bytes signed int (uV)
TYPE_DEBUG        = 0x3D     # 4bytes debug

class Decoder(object):
    def __init__(self, settings=None, logger=logging.getLogger()):
        self.logger=logger
        self.logger.info("Elsys init()")

        self.name = "elsys"

        if settings is not None and "decoded_property" in settings:
            self.decoded_property = settings["decoded_property"]
        else:
            self.decoded_property = "payload_cooked"

        return

    def test(self, topic, message_bytes):

        if DEBUG:
            self.logger.info(f'Elsys test() {topic}')
        #regular topic format:
        #cambridge-sensor-network/devices/elsys-ems-048f2b/up

        if topic.startswith("v3/") and "/elsys-" in topic:  #check if decoder name appears in the topic
            if DEBUG:
                self.logger.info("Elsys test() success")
            return True
        #elif ("dev_id" in msg):  #dev_id for example, can be any other key
        #    msg=json.loads(message.payload)
        #    if (decoder_name in msg["dev_id"]):
        #        return True
        #    #elif...
        #    else:
        #        return False
        if DEBUG:
            self.logger.warn("Elsys test() fail")
        return False


    def decode(self, topic, message_bytes):
        # First lets set a flag for which version of TTN we're dealing with
        ttn_version = 3 if topic.startswith("v3/") else 2

        if DEBUG:
            self.logger.info(f'\nElsys decode() V{ttn_version}\n{message_bytes}')

        inc_msg=str(message_bytes,'utf-8')

        if DEBUG:
            self.logger.info("Elsys decode str {}".format(inc_msg))

        msg_dict = json.loads(inc_msg)

        # extract sensor id
        # add acp_id to original message
        if ttn_version==2:
            msg_dict["acp_id"] = msg_dict["dev_id"]
        else:
            msg_dict["acp_id"] = msg_dict["end_device_ids"]["device_id"]

        type_array = msg_dict["acp_id"].split("-")

        if len(type_array) >= 3:
            msg_dict["acp_type_id"] = type_array[0]+"-"+type_array[1]

        if ttn_version==2:
            rawb64 = msg_dict["payload_raw"]
        else:
            rawb64 = msg_dict["uplink_message"]["frm_payload"]

        if DEBUG:
            self.logger.info("Elsys decode() rawb64 {}".format(rawb64))

        try:
            decoded = self.decodePayload(msg_dict, self.b64toBytes(rawb64))
            msg_dict[self.decoded_property] = decoded
            if DEBUG:
                self.logger.info("Elsys decode() decoded {}".format(decoded))
        except Exception as e:
            # DecoderManager will add acp_ts using server time
            self.logger.info("Elsys decodePayload() {} exception {}".format(type(e), e))
            traceback.self.logger.info_exc()
            msg_dict["ERROR"] = "acp_decoder elsys decodePayload exception"
            return msg_dict

        if DEBUG:
            self.logger.info("Elsys decode() acp_id {}".format(msg_dict["acp_id"]))

        # extract timestamp
        try:
            if ttn_version==2:
                datetime_string = msg_dict["metadata"]["time"]
            else:
                datetime_string = msg_dict["uplink_message"]["received_at"]

            date_format = '%Y-%m-%dT%H:%M:%S.%fZ'
            epoch_start = datetime(1970, 1, 1)
            # trim off the nanoseconds
            acp_ts = str((datetime.strptime(datetime_string[:-4]+"Z", date_format) - epoch_start).total_seconds())
            # add acp_ts to original message
            msg_dict["acp_ts"] = acp_ts
        except Exception as e:
            # DecoderManager will add acp_ts using server time
            self.logger.info("Elsys decode() timestamp {} exception {}".format(type(e), e))

        if DEBUG:
            self.logger.info("\nElsys decode() FINITO: {} {}\n".format(msg_dict["acp_id"], msg_dict["acp_ts"]))

        return msg_dict

    def bin8dec(self, bin):
        num=bin&0xFF;
        if (0x80 & num):
            num = - (0x0100 - num);
        return num

    def bin16dec(self, bin):
        num=bin&0xFFFF;
        if (0x8000 & num):
            num = - (0x010000 - num);
        return num

    def hexToBytes(self, hex):
        bytes = []
        for c in range(0,len(hex),2):
            bytes.append(int(hex[c: c+2],16))
        return bytes

    def b64ToHex(self, b64):
        return base64.b64decode(b64).hex()

    def b64toBytes(self,b64):
        if DEBUG:
            self.logger.info("b64toBytes")
        return base64.b64decode(b64)  

    def decodePayload(self, msg_dict, data):
        obj = {}

        acp_type = ''
        if "acp_type_id" in msg_dict:
            acp_type = msg_dict["acp_type_id"]

        if DEBUG:
            self.logger.info("data ",data," len ",len(data))

        i = 0
        while(i<len(data)):
            #Temperature
            if data[i] == TYPE_TEMP:
                temp=(data[i+1]<<8)|(data[i+2])
                temp=self.bin16dec(temp)
                obj["temperature"]=temp/10
                i=i+2

            #Humidity
            elif data[i] == TYPE_RH:
                rh=(data[i+1])
                obj["humidity"]=rh
                i+=1

            #Acceleration
            elif data[i] == TYPE_ACC:
                obj["x"]=self.bin8dec(data[i+1])
                obj["y"]=self.bin8dec(data[i+2])
                obj["z"]=self.bin8dec(data[i+3])
                i+=3

            #Light
            elif data[i] == TYPE_LIGHT:
                obj["light"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #Motion sensor(PIR)
            elif data[i] == TYPE_MOTION:
                obj["motion"]=(data[i+1])
                i+=1

            #CO2
            elif data[i] == TYPE_CO2:
                obj["co2"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #Battery level
            elif data[i] == TYPE_VDD:
                obj["vdd"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #Analog input 1
            elif data[i] == TYPE_ANALOG1:
                obj["analog1"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #gps
            elif data[i] ==  TYPE_GPS:
                obj["lat"]=(data[i+1]<<16)|(data[i+2]<<8)|(data[i+3])
                obj["lng"]=(data[i+4]<<16)|(data[i+5]<<8)|(data[i+6])
                i+=6

            #Pulse input 1
            elif data[i] == TYPE_PULSE1:
                obj["pulse1"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #Pulse input 1 absolute value
            elif data[i] ==  TYPE_PULSE1_ABS:
                pulseAbs=(data[i+1]<<24)|(data[i+2]<<16)|(data[i+3]<<8)|(data[i+4])
                obj["pulseAbs"]=pulseAbs
                i+=4

            #External temp
            elif data[i] ==TYPE_EXT_TEMP1:
                temp=(data[i+1]<<8)|(data[i+2])
                temp=self.bin16dec(temp)
                obj["externalTemperature"]=temp/10
                i+=2

            #Digital input
            elif data[i] == TYPE_EXT_DIGITAL:
                obj["digital"]=(data[i+1])
                i+=1
                if acp_type == "elsys-ems" and len(data) < 5 :
                    msg_dict["acp_event"] = "openclose"
                    msg_dict["acp_event_value"] = "open" if obj["digital"] == 0 else "close"

            #Distance sensor input
            elif data[i] == TYPE_EXT_DISTANCE:
                obj["distance"]=(data[i+1]<<8)|(data[i+2])
                obj["JBJB"]="my debug here"
                i+=2

            #Acc motion
            elif data[i] == TYPE_ACC_MOTION:
                obj["accMotion"]=(data[i+1])
                i+=1

            #IR temperature
            elif data[i] == TYPE_IR_TEMP:
                iTemp=(data[i+1]<<8)|(data[i+2])
                iTemp=self.bin16dec(iTemp)
                eTemp=(data[i+3]<<8)|(data[i+4])
                eTemp=self.bin16dec(eTemp)
                obj["irInternalTemperature"]=iTemp/10
                obj["irExternalTemperature"]=eTemp/10
                i+=4

            #Body occupancy
            elif data[i] == TYPE_OCCUPANCY:
                obj["occupancy"]=(data[i+1])
                i+=1

            #Water leak
            elif data[i] == TYPE_WATERLEAK:
                obj["waterleak"]=(data[i+1])
                i+=1

            # 8x8 IR Grideye data
            elif data[i] == TYPE_GRIDEYE:
                # data[i] = the field 'type' i.e. TYPE_GRIDEYE pixel array
                # data[i+1] is the reference 'temperature base' for the pixels
                # data[i+2..i+65] = a list of the 64 IR pixels as (degrees C * 10) offset from base
                GRIDEYE_SIZE=64
                obj["grideye"]="8x8 missing"
                grideye_ref = data[i+1]                # this is the 'base' temperature
                obj["grideye_ref"] = grideye_ref
                obj["grideye"] = [None] * GRIDEYE_SIZE # initialize fixed size array
                # actual temperature of pixel is (base temp) + (pixel value)/10
                for pixel in range(0,GRIDEYE_SIZE):
                    obj["grideye"][pixel] = grideye_ref + (data[i+2+pixel]/10.0)
                i += 1 + GRIDEYE_SIZE # skip forward from type id, ref byte, pixels

            #External Pressure
            elif data[i] == TYPE_PRESSURE:
                temp=(data[i+1]<<24)|(data[i+2]<<16)|(data[i+3]<<8)|(data[i+4])
                obj["pressure"]=temp/1000
                i+=4

            #Sound
            elif data[i] == TYPE_SOUND:
                obj["soundPeak"]=data[i+1]
                obj["soundAvg"]=data[i+2]
                i+=2

            #Pulse 2
            elif data[i] == TYPE_PULSE2:
                obj["pulse2"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #Pulse input 2 absolute value
            elif data[i] == TYPE_PULSE2_ABS:
                obj["pulseAbs2"]=(data[i+1]<<24)|(data[i+2]<<16)|(data[i+3]<<8)|(data[i+4])
                i+=4

            #Analog input 2
            elif data[i] ==  TYPE_ANALOG2:
                obj["analog2"]=(data[i+1]<<8)|(data[i+2])
                i+=2

            #External temp 2
            elif data[i] == TYPE_EXT_TEMP2:
                temp=(data[i+1]<<8)|(data[i+2])
                temp=self.bin16dec(temp)
                obj["externalTemperature2"]=temp/10
                i+=2

            #Digital input 2
            elif data[i] ==  TYPE_EXT_DIGITAL2:
                obj["digital2"]=(data[i+1])
                i+=1

            #Load cell analog uV
            elif data[i] == TYPE_EXT_ANALOG_UV:
                obj["analogUv"] = (data[i + 1] << 24) | (data[i + 2] << 16) | (data[i + 3] << 8) | (data[i + 4])
                i += 4

            else:
                self.logger.info("Elsys decoder field not recognized {}".format(data[i]))
                i=len(data)

            i+=1

        return obj
