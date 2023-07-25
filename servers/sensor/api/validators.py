from pydantic import BaseModel, validator
from .config import ALL_SENSORS


class HistoricalDataRequestBody(BaseModel):
    acp_id: str
    start_time: str
    end_time: str

    # validate acp_id in ALL_SENSORS
    @validator('acp_id')
    def acp_id_must_be_in_all_sensors(cls, v):
        if v not in ALL_SENSORS:
            raise ValueError(f"acp_id must be in {ALL_SENSORS}")
        return v
