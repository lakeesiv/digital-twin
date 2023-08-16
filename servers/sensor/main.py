import asyncio
import logging
import threading

import uvicorn
from fastapi import FastAPI, WebSocket

from api.providers import ApiProvider, Client
from api.validators import HistoricalDataRequestBody
from fastapi.middleware.cors import CORSMiddleware
import os

api_provider = ApiProvider()

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")  # GET /
async def root():
    return {"message": "Hello World"}


@app.post("/history/")  # POST /history/ with HistoricalDataRequestBody
async def historical_data(req_body: HistoricalDataRequestBody):
    return api_provider.get_historical_data(
        req_body.acp_id,
        req_body.start_time,
        req_body.end_time,
        return_type="dict"
    )


@app.get("/latest/")  # GET /latest/
async def latest_data():
    return api_provider.get_latest_data()


@app.websocket("/ws/")  # WebSocket /ws/
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


# WebSocket /ws/{acp_str} | acp_str is a string of acp_ids separated by commas
@app.websocket("/ws/{acp_str}")
async def dynamic_websocket_endpoint(websocket: WebSocket, acp_str: str):
    await websocket.accept()

    logging.info(f"Adding new client for sensor {acp_str}")

    client = Client(websocket, acp_str)
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
        target=uvicorn.run, args=(
            app,), kwargs={
            "host": "localhost", "port": int(
                os.environ.get(
                    'PORT', 8000))}, )
    fastapi_thread.start()

    # Subscribe to all sensors MQTT topics
    api_provider.subscribe_all()

    # When the ETL's run method completes, stop the FastAPI server gracefully
    asyncio.get_event_loop().stop()
    fastapi_thread.join()
