"use client";
import { useEffect, useState } from "react";
import { MockData } from "./mockData";
import "./css/tasks.css";
import Image from "next/image";
export default function Tasks() {
  const [groups, setGroups]: any = useState([]);
  useEffect(() => {
    setGroups(MockData.groupData);
    console.log(groups);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <h3 className="task-header">Tasks</h3>
      </div>
      <div className="flex flex-col gap-1 scroll-container">
        {groups.map((task: any) => (
          <div key={task.GroupID} className="flex flex-col task p-1 relative">
            <div>
              <h5 className="task-content">Channel the playground is ..</h5>
              <div className="task-name">view conversation</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
