"use client";
import { useState } from "react";
import "./css/group.css";
import Image from "next/image";

export default function Groups({ groups }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="group-header">Groups</h3>
      </div>
      <div className="flex flex-col gap-1 scroll-container">
        {groups.map((group: any) => (
          <div
            key={group.groupID}
            className="flex flex-row gap-2 items-center group relative cursor-pointer"
          >
            <Image
              className="group-image"
              src={group.GroupIcon}
              alt="Notif"
              width={20}
              height={20}
              unoptimized
            />
            <div className="group-name">{group.GroupName}</div>
            <div className="group-count">{group.Messages.length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
