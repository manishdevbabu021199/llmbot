from pydantic import BaseModel

class GroupCreate(BaseModel):
    GroupName: str
    GroupIcon: str


class MessageCreate(BaseModel):
    MessageContent: str
