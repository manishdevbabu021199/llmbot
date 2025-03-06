"use client";
import Header from "@/components/header";
import { useState } from "react";
import "./dashboard.css";
import Sidebar from "@/components/sidebar";
import Groups from "@/components/groups";
import Escalation from "@/components/escalations";
import Tasks from "@/components/tasks";
import Chats from "@/components/chats";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>
      <header className="header">
        <Header />
      </header>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="main-content">
        <div className="grid-container">
          <div className="box box1">
            <Groups></Groups>
          </div>
          <div className="box box2">
            <Tasks></Tasks>
          </div>
          <div className="box box3">
            <Escalation></Escalation>
          </div>
          <div className="box box4">
            <Chats></Chats>
          </div>
        </div>
      </main>
    </div>
  );
}
