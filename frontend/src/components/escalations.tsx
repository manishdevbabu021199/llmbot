"use client";
import { useEffect, useState } from "react";
import { MockData } from "./mockData";
import "./css/escalations.css";
import Image from "next/image";
export default function Escalation() {
  const [groups, setGroups]: any = useState([]);
  useEffect(() => {
    setGroups(MockData.groupData);
    console.log(groups);
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <h3 className="escalation-header">Escalations</h3>
        <Image
          src="/assets/escalation/image.png"
          alt="Notif"
          width={40}
          height={15}
          className="swing"
        />
      </div>
      <div className="flex flex-col gap-1 scroll-container">
        {groups.map((escalation: any) => (
          <div
            key={escalation.GroupID}
            className="flex flex-col escalation p-1 relative"
          >
            <div className="escalation-name">{escalation.GroupName}</div>
            <div className="escalation-content">
              <h5>Channel the playground is ..</h5>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <Image
                className="group-image"
                src="/assets/image.png"
                alt="Notif"
                width={20}
                height={20}
              />
              <div className="escalation-raised">{escalation.GroupName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
