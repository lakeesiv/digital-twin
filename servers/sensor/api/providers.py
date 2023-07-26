from typing import Literal

from fastapi import WebSocket
import lib.iolibs as io
import pandas as pd
from etl.etl import ETL
import numpy as np
from .config import ALL_SENSORS
import logging
from etl.decoders.decoder import Decoder
import asyncio
from typing import Union


class Client:
    def __init__(self, websocket: WebSocket, acp_config: Union[str, None]):
        self.websocket = websocket
        self.acp_list = self._parse_acp_config(acp_config)

    def _parse_acp_config(self, acp_config: Union[str, None]):
        """Converts a csv string of acp_ids into a list of acp_ids.

        Args:
            acp_config (str): csv string of acp_ids or single acp_id
        """
        if acp_config is None:
            return None

        return acp_config.split(",")

    async def send(self, msg: dict):
        acp_id = msg.get("acp_id", None)
        if acp_id is None:
            return
        if self.acp_list is None:
            await self.websocket.send_json(msg)
        else:
            if acp_id in self.acp_list:
                await self.websocket.send_json(msg)
        return


class ApiProvider():
    def __init__(self):
        basic_config = io.getBasicConfig()
        self.all_sensors = ALL_SENSORS
        self.connected_clients = set[Client]()

        self.http_etl = ETL(basic_config, basic_config["etl_default"],
                            owner=self)
        self.ws_etl = ETL(basic_config, basic_config["etl_default"],
                          owner=self)

        self.ws_etl.handle_message = lambda msg, topic: self.handle_message(
            msg, topic)

    def add_client(self, client: Client):
        logging.info("Adding new client")
        self.connected_clients.add(client)
        number = len(self.connected_clients)
        logging.info(f"Number of connected clients: {number}")

    def remove_client(self, client: Client):
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
        if data.get("acp_ts") is None:
            return None

        data["acp_ts"] = pd.to_datetime(data["acp_ts"], unit='s').astype(
            np.int64) // 10 ** 9

        if return_type == "df":
            return data
        else:
            return data.to_dict(orient='records')

    def get_latest_data(self):
        # current time YYYY-MM-DD HH:MM:SS
        today = pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
        yesterday = (
            pd.Timestamp.now() - pd.Timedelta(
                days=2)).strftime("%Y-%m-%d %H:%M:%S")
        result = []

        for acp_id in self.all_sensors:
            historical_data = self.get_historical_data(
                acp_id, yesterday, today, return_type="df")

            if historical_data is None:
                continue

            # remove any rows with NaN values
            historical_data = historical_data.dropna()
            if historical_data.empty:
                continue

            latest_data = historical_data.iloc[[-1]
                                               ].to_dict(orient='records')[0]
            result.append(latest_data)

        return result

    def handle_message(self, msg, topic):
        transformed_message = Decoder.transform(msg, topic)
        if (transformed_message):
            filtered_message = self.ws_etl.rt_manager.filterParametersFromSensorMessage(
                transformed_message)
        if filtered_message is None:
            return

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            # Broadcast the message to all connected clients
            for client in self.connected_clients:
                loop.run_until_complete(client.send(filtered_message))
        finally:
            loop.close()

    def subscribe_all(self):
        query = {"sensors": []}
        for sensor_id in self.all_sensors:
            query["sensors"].append(
                {"acp_id": sensor_id, "parameters": ["all"]})

        self.ws_etl.subscribe(query)
