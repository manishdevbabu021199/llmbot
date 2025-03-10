from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import firestore
from pydantic import BaseModel
from datetime import datetime
import uuid
from auth.auth import verify_token
from .models import TaskCreate, TaskUpdate

db = firestore.client()
router = APIRouter()


# Create a task


@router.post("/tasks/add", dependencies=[Depends(verify_token)])
def add_task(task: TaskCreate, user_data=Depends(verify_token)):
    task_id = str(uuid.uuid4())
    task_data = {
        "taskid": task_id,
        "taskname": task.taskname,
        "added_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "completed_date": None,
        "username": user_data["email"],
        "userid": user_data["uid"],
    }

    db.collection("tasks").document(task_id).set(task_data)
    return {"message": "Task added successfully!", "task": task_data}

# Mark task as completed


@router.put("/tasks/complete/{taskid}", dependencies=[Depends(verify_token)])
def complete_task(taskid: str, task_update: TaskUpdate):
    task_ref = db.collection("tasks").document(taskid)
    task = task_ref.get()

    if not task.exists:
        raise HTTPException(status_code=404, detail="Task not found")

    task_ref.update({"completed_date": task_update.completed_date})
    return {"message": "Task marked as completed"}

# Get all tasks


@router.get("/tasks", dependencies=[Depends(verify_token)])
def get_tasks():
    tasks = db.collection("tasks").stream()
    return [{"taskid": task.id, **task.to_dict()} for task in tasks]

# Get tasks by user ID


@router.get("/tasks/user", dependencies=[Depends(verify_token)])
def get_tasks_by_user(user_data=Depends(verify_token)):
    userid = user_data["uid"]
    tasks = db.collection("tasks").where("userid", "==", userid).stream()
    return [{"taskid": task.id, **task.to_dict()} for task in tasks]
