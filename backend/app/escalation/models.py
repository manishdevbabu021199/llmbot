
from pydantic import BaseModel

class EscalationCreate(BaseModel):
    escalationName: str
    escalationDomain: str
