import asyncio
import logging
import threading
from typing import List, Union

import uvicorn
import websockets
from fastapi import FastAPI, WebSocket

import lib.iolibs as io
from etl.etl import ETL
from etl.decoders.decoder import Decoder


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


all_synetica_sensors = [
    "enl-iaqco3-083b3f",
    "enl-iaqco3-0837d7",
    "enl-iaqco3-08185c",
    "enl-iaqc-08833e",
    "enl-iaqc-08734d",
    "enl-iaqc-0838aa",
    "enl-iaqc-0839c5",
    "enl-iaqc-082f4d",
    "enl-iaqc-081bd7",
    "enl-iaqco3-084e85",
    "enl-iaqc-0857ab",
    "enl-iaqc-085a26",
    "enl-iaqc-0812d9",
    "enl-iaqc-081a75",
    "enl-iaqc-087019",
    "enl-iaqc-0824ea",
    "enl-iaqc-084596",
    "enl-iaqco3-084a98",
    "enl-iaqc-088b66",
    "enl-iaqco3-0865dc",
    "enl-iaqco3-081622",
    "enl-iaqco3-086d3d",
    "enl-iaqc-085e9a",
    "enl-iaqc-0880a2",
    "enl-iaqc-0862a3"]

# Define a list to keep track of connected clients
connected_clients: List[WebSocket] = []


def handle_message(etl, msg, topic):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        # Broadcast the message to all connected clients
        for client in connected_clients:
            msg = Decoder.transform(msg, topic)
            if (msg):
                msg = etl.rt_manager.filterParametersFromSensorMessage(
                    msg)
                loop.run_until_complete(client.send_json(msg))
    finally:
        loop.close()


# Create a FastAPI app
app = FastAPI()

# Define WebSocket route


@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            # You can process incoming messages from clients here if needed
            _ = await websocket.receive_text()
    except BaseException:
        pass
    finally:
        # Remove the client from the list when they disconnect
        connected_clients.remove(websocket)


@app.websocket("/ws/{acp_id}")
async def dynamic_websocket_endpoint(websocket: WebSocket, acp_id: str):
    await websocket.accept()
    logging.info(f"Adding new client for sensor {acp_id}")
    connected_clients.append(websocket)
    try:
        while True:
            # You can process incoming messages from clients here if needed
            _ = await websocket.receive_text()
    except BaseException:
        pass
    finally:
        # Remove the client from the list when they disconnect
        connected_clients.remove(websocket)

if __name__ == "__main__":
    # Start the FastAPI server in a separate thread
    logging.basicConfig(level=logging.DEBUG)
    fastapi_thread = threading.Thread(
        target=uvicorn.run,
        args=(app,),
        kwargs={"host": "localhost", "port": 8000},
    )
    fastapi_thread.start()

    # Instantiate the ETL class
    config = io.getBasicConfig()
    etl = ETL(
        config,
        config["etl_default"],
    )

    # Set the handle_message function of the ETL instance to the custom
    # handle_message
    etl.handle_message = lambda msg, topic: handle_message(etl, msg, topic)

    query = {"sensors": []}
    for sensor_id in all_synetica_sensors:
        query["sensors"].append({"acp_id": sensor_id, "parameters": ["all"]})

    # Start the ETL (blocking operation)
    etl.subscribe(query)

    # When the ETL's run method completes, stop the FastAPI server gracefully
    asyncio.get_event_loop().stop()
    fastapi_thread.join()
