from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import firestore
from pydantic import BaseModel
import uuid
from auth.auth import verify_token
from .models import GroupCreate, MessageCreate

db = firestore.client()
router = APIRouter()

# Add a new group (Protected)


@router.post("/groups/add", dependencies=[Depends(verify_token)])
def add_group(group: GroupCreate, user_data=Depends(verify_token)):
    group_id = f"G{uuid.uuid4().hex[:6]}"  
    group_data = {
        "GroupID": group_id,
        "GroupName": group.GroupName,
        "GroupIcon": group.GroupIcon,
        "CreatedBy": user_data["email"],
        "Messages": [],
    }

    db.collection("groups").document(group_id).set(group_data)
    return {"message": "Group created successfully!", "group": group_data}

# Add a message to a group (Protected)


@router.post("/groups/{group_id}/messages", dependencies=[Depends(verify_token)])
def add_message(group_id: str, message: MessageCreate, user_data=Depends(verify_token)):
    doc_ref = db.collection("groups").document(group_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Group not found")
    message_id = f"M{uuid.uuid4().hex[:6]}"  
    new_message = {
        "MessageId": message_id,
        "MessageContent": message.MessageContent,
        "MessagePostedBy": user_data["email"],
    }

    # Add message to Firestore
    doc_ref.update({"Messages": firestore.ArrayUnion([new_message])})

    return {"message": "Message added successfully!", "messageData": new_message}

# Get details of a group (Protected)


@router.get("/groups/{group_id}", dependencies=[Depends(verify_token)])
def get_group(group_id: str):
    doc_ref = db.collection("groups").document(group_id)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Group not found")

    return doc.to_dict()

# Get details of all group (Protected)


@router.get("/groups", dependencies=[Depends(verify_token)])
def get_escalations():
    groups = db.collection("groups").stream()
    return [{"groupID": group.id, **group.to_dict()} for group in groups]


# Mark a message as read (Protected)


@router.put("/groups/{group_id}/read/{message_id}", dependencies=[Depends(verify_token)])
def mark_message_as_read(group_id: str, message_id: str, user_data=Depends(verify_token)):
    user_id = user_data["uid"]
    read_ref = db.collection("groups").document(
        group_id).collection("read_messages")
    read_ref.document(f"{user_id}_{message_id}").set(
        {"userID": user_id, "messageID": message_id})
    return {"message": f"Message {message_id} marked as read by {user_id}"}

# Get unread message count for user (Protected)


@router.get("/groups/{group_id}/unread_count", dependencies=[Depends(verify_token)])
def get_unread_count(group_id: str, user_data=Depends(verify_token)):
    user_id = user_data["uid"]
    group_doc = db.collection("groups").document(group_id).get()

    if not group_doc.exists:
        raise HTTPException(status_code=404, detail="Group not found")

    messages = group_doc.to_dict().get("Messages", [])

    read_ref = db.collection("groups").document(
        group_id).collection("read_messages")
    read_docs = read_ref.where("userID", "==", user_id).stream()
    read_messages = {doc.to_dict()["messageID"] for doc in read_docs}

    unread_count = sum(
        1 for msg in messages if msg["MessageId"] not in read_messages)

    return {"unread_count": unread_count}
