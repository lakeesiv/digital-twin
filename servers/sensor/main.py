import multiprocessing
import logging
import uvicorn
from api.validators import HistoricalDataRequestBody
from api.providers import ApiProvider
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

app = FastAPI()
api_provider = ApiProvider()

"""
HTTP Handling
"""


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


"""
MQTT -> WebSocket Handling
"""

connections = []


async def broadcast_message(message: str):
    for websocket in connections:
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error broadcasting message to client: {e}")


# Example on how to use the etl library and forward messages to the
# WebSocket clients.
def etl_on_message_handler(msg, topic=None):
    # Process the message with the etl library as needed.
    # Then forward the message to connected WebSocket clients.
    loop = asyncio.get_event_loop()
    # asyncio.create_task(broadcast_message(msg))
    loop.run_until_complete(broadcast_message(msg))


@app.websocket("/ws/")
async def ws(websocket: WebSocket):
    await websocket.accept()
    api_provider.add_client(websocket)
    connections.append(websocket)

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
    query = {"sensors": []}
    for sensor_id in all_synetica_sensors:
        query["sensors"].append({"acp_id": sensor_id, "parameters": ["all"]})

    api_provider.ws_etl.handle_message = etl_on_message_handler

    # api_provider.ws_etl.subscribe(query)

    p = multiprocessing.Process(
        target=api_provider.ws_etl.subscribe, args=(query,))
    p.daemon = True
    p.start()

    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received WebSocket message: {data}")
    except WebSocketDisconnect:
        api_provider.remove_client(websocket)


@app.websocket("/ws/{acp_id}")
async def live(websocket: WebSocket, acp_id: str):
    await websocket.accept()
    acp_id: str = websocket.path_params["acp_id"]

    # add the id as metadata to the websocket
    websocket.acp_id = acp_id
    api_provider.connected_clients.add(websocket)
    # api_provider.ws_etl.subscribe(query)

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
    query = {"sensors": []}
    for sensor_id in all_synetica_sensors:
        query["sensors"].append({"acp_id": sensor_id, "parameters": ["all"]})

    p = multiprocessing.Process(
        target=api_provider.ws_etl.subscribe, args=(query,))
    p.daemon = True
    p.start()

    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received WebSocket message: {data}")
    except WebSocketDisconnect:
        api_provider.connected_clients.remove(websocket)

if __name__ == "__main__":
    # set logging level to debug
    logging.basicConfig(level=logging.DEBUG)

    # sensor_provider.ws_etl.subscribe(query)
    uvicorn.run(app, host="0.0.0.0", port=8005)

    # p = multiprocessing.Process(
    #     target=uvicorn.run, args=(
    #         app,), kwargs={
    #         "host": "0.0.0.0", "port": 8000})
    # p.daemon = True
    # p.start()
