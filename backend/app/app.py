from fastapi import FastAPI
from auth.auth import router as auth_router
from task.task import router as task_router
from escalation.escalation import router as escalation_router
from group.group import router as group_router
import os
from dotenv import load_dotenv



app = FastAPI()


app.include_router(auth_router)
app.include_router(task_router)
app.include_router(escalation_router)
app.include_router(group_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Firebase Auth API"}
