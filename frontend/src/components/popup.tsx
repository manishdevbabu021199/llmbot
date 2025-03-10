import { useState } from "react";
import "./css/popup.css";
import apiClient from "./utility/api/apiClient";
import { APIConstants } from "@/app/api.constants";
const Popup = ({ isOpen, togglePopup, addTask }: any) => {
  const [task, setTask] = useState("");
  const [taskAdded, setTaskAdded] = useState(false);

  const handleChange = (e: any) => {
    setTask(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (task.trim() !== "") {
      try {
        setTaskAdded(true);
        const newTask = await apiClient.post(APIConstants.ADD_TASK, {
          taskname: task,
        });
        addTask(task);
        setTask("");
        togglePopup();
      } catch {
        console.error("Failed to add Task");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={togglePopup}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="popup-heading">Add a Task</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={task}
            onChange={handleChange}
            rows={4}
            cols={30}
            placeholder="Enter your task here..."
            className="chat-textarea"
          ></textarea>
          <div className="flex flex-row gap-2 justify-center items-center">
            <button
              type="submit"
              className="btn-submit-task"
              disabled={taskAdded}
            >
              Add Task
            </button>
            <button onClick={togglePopup} className="btn-close-popup">
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
