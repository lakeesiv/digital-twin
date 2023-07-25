import asyncio
import logging
import threading

import uvicorn
from fastapi import FastAPI, WebSocket

from api.providers import ApiProvider, Client
from api.validators import HistoricalDataRequestBody

api_provider = ApiProvider()

app = FastAPI()


@app.post("/history/")
async def historical_data(req_body: HistoricalDataRequestBody):
    return api_provider.get_historical_data(
        req_body.acp_id,
        req_body.start_time,
        req_body.end_time,
        return_type="dict"
    )


@app.post("/latest/")
async def latest_data():
    return api_provider.get_latest_data()


@app.websocket("/ws/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    client = Client(websocket, None)
    api_provider.add_client(client)
    try:
        while True:
            _ = await websocket.receive_text()
    except BaseException:
        pass
    finally:
        # Remove the client from the list when they disconnect
        api_provider.remove_client(client)


@app.websocket("/ws/{acp_id}")
async def dynamic_websocket_endpoint(websocket: WebSocket, acp_id: str):
    await websocket.accept()

    logging.info(f"Adding new client for sensor {acp_id}")

    client = Client(websocket, acp_id)
    api_provider.add_client(client)

    try:
        while True:
            _ = await websocket.receive_text()
    except BaseException:
        pass
    finally:
        api_provider.remove_client(client)

if __name__ == "__main__":

    logging.basicConfig(level=logging.DEBUG)

    # Start the FastAPI server in a separate thread
    fastapi_thread = threading.Thread(
        target=uvicorn.run,
        args=(app,),
        kwargs={"host": "localhost", "port": 8000},
    )
    fastapi_thread.start()

    # Subscribe to all sensors MQTT topics
    api_provider.subscribe_all()

    # When the ETL's run method completes, stop the FastAPI server gracefully
    asyncio.get_event_loop().stop()
    fastapi_thread.join()
