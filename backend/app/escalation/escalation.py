from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import firestore
from pydantic import BaseModel
import uuid
from auth.auth import verify_token  
from .models import EscalationCreate

db = firestore.client()
router = APIRouter()

# Add an escalation (Protected)


@router.post("/escalations/add", dependencies=[Depends(verify_token)])
def add_escalation(escalation: EscalationCreate, user_data=Depends(verify_token)):
    escalation_id = str(uuid.uuid4()) 
    escalation_data = {
        "escalationID": escalation_id,
        "escalationName": escalation.escalationName,
        "escalationDomain": escalation.escalationDomain,
        "username": user_data["email"],  
        "userid": user_data["uid"],  
    }

    db.collection("escalations").document(escalation_id).set(escalation_data)
    return {"message": "Escalation added successfully!", "escalation": escalation_data}

# Get all escalations (Protected)


@router.get("/escalations", dependencies=[Depends(verify_token)])
def get_escalations():
    escalations = db.collection("escalations").stream()
    return [{"escalationID": escalation.id, **escalation.to_dict()} for escalation in escalations]

# Get escalations for logged-in user (Protected)


@router.get("/escalations/user", dependencies=[Depends(verify_token)])
def get_escalations_by_user(user_data=Depends(verify_token)):
    userid = user_data["uid"]
    escalations = db.collection("escalations").where(
        "userid", "==", userid).stream()
    return [{"escalationID": escalation.id, **escalation.to_dict()} for escalation in escalations]

# Get a specific escalation by ID (Protected)


@router.get("/escalations/{escalationID}", dependencies=[Depends(verify_token)])
def get_escalation(escalationID: str):
    doc_ref = db.collection("escalations").document(escalationID)
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Escalation not found")
    return doc.to_dict()

# Update an escalation (Protected)


@router.put("/escalations/update/{escalationID}", dependencies=[Depends(verify_token)])
def update_escalation(escalationID: str, update_data: EscalationCreate, user_data=Depends(verify_token)):
    doc_ref = db.collection("escalations").document(escalationID)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Escalation not found")

    escalation_data = doc.to_dict()

    # Check if the user owns the escalation
    if escalation_data["userid"] != user_data["uid"]:
        raise HTTPException(status_code=403, detail="Permission denied")

    updated_escalation = {
        "escalationName": update_data.escalationName,
        "escalationDomain": update_data.escalationDomain
    }

    doc_ref.update(updated_escalation)
    return {"message": "Escalation updated successfully!", "updated_escalation": updated_escalation}

# Delete an escalation (Protected)


@router.delete("/escalations/delete/{escalationID}", dependencies=[Depends(verify_token)])
def delete_escalation(escalationID: str, user_data=Depends(verify_token)):
    doc_ref = db.collection("escalations").document(escalationID)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Escalation not found")

    escalation_data = doc.to_dict()

    # Check if the user owns the escalation
    if escalation_data["userid"] != user_data["uid"]:
        raise HTTPException(status_code=403, detail="Permission denied")

    doc_ref.delete()
    return {"message": "Escalation deleted successfully!"}
