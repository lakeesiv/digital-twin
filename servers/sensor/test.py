import threading
import websockets
import logging
import uvicorn
from etl.etl import ETL
import lib.iolibs as io
import asyncio


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
connected_clients = []


def handle_message(msg, topic):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        # Broadcast the message to all connected clients
        for client in connected_clients:
            loop.run_until_complete(client.send(msg))
    finally:
        loop.close()


# Define a WebSocket server function


def websocket_server():
    async def _websocket_server(websocket, path):
        connected_clients.append(websocket)
        try:
            async for message in websocket:
                # You can process incoming messages from clients here if needed
                pass
        finally:
            # Remove the client from the list when they disconnect
            connected_clients.remove(websocket)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    start_server = websockets.serve(_websocket_server, "localhost", 8765)
    loop.run_until_complete(start_server)
    loop.run_forever()


if __name__ == "__main__":
    # Start the WebSocket server in a separate thread
    logging.basicConfig(level=logging.DEBUG)
    websocket_thread = threading.Thread(target=websocket_server)
    websocket_thread.start()

    # Instantiate the ETL class
    config = io.getBasicConfig()
    etl = ETL(
        config,
        config["etl_default"],
    )

    # Set the handle_message function of the ETL instance to the custom
    # handle_message
    etl.handle_message = handle_message

    query = {"sensors": []}
    for sensor_id in all_synetica_sensors:
        query["sensors"].append({"acp_id": sensor_id, "parameters": ["all"]})

    # Start the ETL (blocking operation)
    etl.subscribe(query)

    # When the ETL's run method completes, stop the WebSocket server gracefully
    asyncio.get_event_loop().stop()
    websocket_thread.join()
