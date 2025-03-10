from pydantic import BaseModel


class DataFilter(BaseModel):
    id: str
    filter_field: str = None


class ChatRequest(BaseModel):
    message: str
    history: list
    data: DataFilter
