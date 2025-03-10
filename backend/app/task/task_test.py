import pytest
from fastapi.testclient import TestClient
from unittest.mock import MagicMock
from ..app import app
from firebase_admin import firestore
from auth.auth import verify_token

mock_firestore = MagicMock()
mock_task_ref = MagicMock()

firestore.client = MagicMock(return_value=mock_firestore)
mock_firestore.collection.return_value.document.return_value = mock_task_ref


@pytest.fixture
def mock_verify_token(monkeypatch):
    monkeypatch.setattr(verify_token, 'verify_token', lambda: {
                        "email": "testuser@example.com", "uid": "1234"})

@pytest.fixture
def client(mock_verify_token):
    return TestClient(app)


def test_add_task(client, mock_verify_token):
    task_data = {
        "taskname": "Test Task"
    }

    mock_task_ref.set.return_value = None

    response = client.post("/tasks/add", json=task_data)

    assert response.status_code == 200
    assert response.json() == {
        "message": "Task added successfully!",
        "task": {
            "taskid": "mock_task_id",
            "taskname": "Test Task",
            "added_date": "2025-03-10",
            "completed_date": None,
            "username": "testuser@example.com",
            "userid": "1234"
        }
    }


def test_complete_task(client, mock_verify_token):
    task_update = {
        "completed_date": "2025-03-10"
    }
    task_id = "mock_task_id"

    mock_task_ref.get.return_value.exists = True
    mock_task_ref.update.return_value = None

    response = client.put(f"/tasks/complete/{task_id}", json=task_update)

    assert response.status_code == 200
    assert response.json() == {"message": "Task marked as completed"}


def test_get_tasks(client, mock_verify_token):
    mock_firestore.collection.return_value.stream.return_value = [
        MagicMock(id="task1", to_dict=MagicMock(return_value={
                  "taskid": "task1", "taskname": "Test Task 1"})),
        MagicMock(id="task2", to_dict=MagicMock(return_value={
                  "taskid": "task2", "taskname": "Test Task 2"})),
    ]

    response = client.get("/tasks")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json() == [
        {"taskid": "task1", "taskname": "Test Task 1"},
        {"taskid": "task2", "taskname": "Test Task 2"},
    ]


def test_get_tasks_by_user(client, mock_verify_token):
    mock_firestore.collection.return_value.where.return_value.stream.return_value = [
        MagicMock(id="task1", to_dict=MagicMock(return_value={
                  "taskid": "task1", "taskname": "Test Task 1", "userid": "1234"})),
        MagicMock(id="task2", to_dict=MagicMock(return_value={
                  "taskid": "task2", "taskname": "Test Task 2", "userid": "1234"})),
    ]

    response = client.get("/tasks/user")

    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json() == [
        {"taskid": "task1", "taskname": "Test Task 1", "userid": "1234"},
        {"taskid": "task2", "taskname": "Test Task 2", "userid": "1234"},
    ]


def test_complete_task_not_found(client, mock_verify_token):
    task_update = {
        "completed_date": "2025-03-10"
    }
    task_id = "non_existent_task_id"

    mock_task_ref.get.return_value.exists = False

    response = client.put(f"/tasks/complete/{task_id}", json=task_update)

    assert response.status_code == 404
    assert response.json() == {"detail": "Task not found"}
