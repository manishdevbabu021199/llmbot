"use client";
import { useState } from "react";
import "./css/tasks.css";
import Image from "next/image";
import Popup from "./popup"; 

export default function Tasks({ tasks }: any) {
  const [isOpen, setIsOpen] = useState(false); 
  const [taskList, setTaskList] = useState(tasks); 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const addTask = (task: string) => {
    const newTask = { taskid: Date.now(), taskname: task }; 
    setTaskList((prevTasks: any) => [...prevTasks, newTask]); 
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <div className="flex flex-row gap-2 items-center">
        <h3 className="task-header">Tasks</h3>
        <Image
          onClick={togglePopup}
          className="add-item"
          src="assets/plus.png"
          alt="Add Task"
          width={20}
          height={20}
          unoptimized
        />
        <Popup isOpen={isOpen} togglePopup={togglePopup} addTask={addTask} />
      </div>

      <div className="flex flex-col gap-1 scroll-container w-full h-full">
        {taskList.length > 0 ? (
          taskList.map((task: any) => (
            <div
              key={task.taskid}
              className="flex flex-col task p-1 relative cursor-pointer"
            >
              <div>
                <h5 className="task-content">{task.taskname}</h5>
                <div className="task-name">view conversation</div>
              </div>
            </div>
          ))
        ) : (
          <h5 className="no-task pt-10">No Tasks</h5>
        )}
      </div>
    </div>
  );
}
