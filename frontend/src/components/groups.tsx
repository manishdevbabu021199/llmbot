"use client";
import { useEffect, useState } from "react";
import { MockData } from "./mockData";
import "./css/group.css";
import Image from "next/image";

export default function Groups() {
  const [groups, setGroups]: any = useState([]);
  useEffect(() => {
    setGroups(MockData.groupData);
    console.log(groups);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="group-header">Groups</h3>
      </div>
      <div className="flex flex-col gap-1 scroll-container">
        {groups.map((group: any) => (
          <div
            key={group.GroupID}
            className="flex flex-row gap-2 items-center group relative"
          >
            <Image
              className="group-image"
              src="/assets/image.png"
              alt="Notif"
              width={10}
              height={10}
            />
            <div className="group-name">{group.GroupName}</div>
            <div className="group-count">{group.GroupMessages.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
