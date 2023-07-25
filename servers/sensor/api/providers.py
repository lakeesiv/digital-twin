from typing import Literal

from fastapi import WebSocket, WebSocketDisconnect
import lib.iolibs as io
import pandas as pd
from etl.etl import ETL
import numpy as np
from .config import ALL_SENSORS
import logging
from etl.decoders.decoder import Decoder
import asyncio


class ApiProvider():
    def __init__(self):
        basic_config = io.getBasicConfig()
        self.all_sensors = ALL_SENSORS
        self.connected_clients = set[WebSocket]()

        self.http_etl = ETL(basic_config, basic_config["etl_default"],
                            owner=self)
        self.ws_etl = ETL(basic_config, basic_config["etl_default"],
                          owner=self)

        self.ws_etl.handle_message = lambda msg, topic: self._on_mqtt_message(
            self.connected_clients, msg, topic)

    def add_client(self, client: WebSocket):
        logging.info("Adding new client", client)
        self.connected_clients.add(client)
        number = len(self.connected_clients)
        logging.info(f"Number of connected clients: {number}")

    def remove_client(self, client: WebSocket):
        self.connected_clients.remove(client)

    def get_historical_data(self, acp_id: str, start_time: str, end_time: str,
                            return_type: Literal["dict", "df"] = "dict"):
        query = {
            "acp_id": acp_id,
            "from": start_time,
            "to": end_time,
            "parameters": ["all"]
        }

        data = self.http_etl.read(query)

        if data is None:
            return None

        data["acp_ts"] = pd.to_datetime(data["acp_ts"], unit='s').astype(
            np.int64) // 10 ** 9

        if return_type == "df":
            return data
        else:
            return data.to_dict(orient='records')

    def get_latest_data(self, acp_id: str):
        pass  # TODO

    def _on_mqtt_message(self, clients: set[WebSocket], msg, topic=None):
        msg = self._transform_mqtt_msg(msg, topic)
        logging.info("Handling new message : " + str(msg))

        if msg is None:
            return

        print(clients)

        for client in clients:
            try:
                # check if it has the attribute acp_id
                if hasattr(client, "acp_id"):
                    # send only to the client with the same acp_id

                    if client.acp_id == msg.get("acp_id"):
                        asyncio.create_task(client.send_text(msg))
                    pass
                else:
                    # await client.send_text(msg)
                    # run client.send_text(msg) w.o await in a separate thread
                    asyncio.create_task(client.send_text(msg))

            except WebSocketDisconnect:
                self.connected_clients.remove(client)

    def _transform_mqtt_msg(self, msg, topic=None):
        transformed_msg = Decoder.transform(msg, topic)
        if (transformed_msg):
            filtered_msg = self.ws_etl.rt_manager.filterParametersFromSensorMessage(
                transformed_msg)
            return filtered_msg
        return None
