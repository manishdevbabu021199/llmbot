from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from auth.auth import router as auth_router
from task.task import router as task_router
from escalation.escalation import router as escalation_router
from group.group import router as group_router
from chat.chat import router as chat_router
import os
from dotenv import load_dotenv


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001"
]

app = FastAPI(
    title="LLM API",
    description="""
# Welcome to My API 🚀

This is the **official documentation** for the API.

- **Authentication**: Handles user authentication
- **Tasks**: Manages user tasks
- **Escalations**: Handles escalation workflows
- **Groups**: Manages user groups
- **Chat**: Handles messaging functionalities
""",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(task_router)
app.include_router(escalation_router)
app.include_router(group_router)
app.include_router(chat_router)


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Firebase Auth API"}
