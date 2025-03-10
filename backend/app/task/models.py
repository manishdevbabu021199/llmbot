
from pydantic import BaseModel


class TaskCreate(BaseModel):
    taskname: str


class TaskUpdate(BaseModel):
    completed_date: str
