"use client";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import "./dashboard.css";
import Sidebar from "@/components/sidebar";
import Groups from "@/components/groups";
import Escalation from "@/components/escalations";
import Tasks from "@/components/tasks";
import Chats from "@/components/chats";
import withAuth from "@/components/utility/hooks/protectedroute";
import { useRouter } from "next/navigation";
import { DashboardService } from "./dashboard.service";
import Shimmer from "@/components/shimmer";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser]: any = useState({});
  const [tasks, setTasks]: any = useState([]);
  const [escalation, setEscalation]: any = useState([]);
  const [group, setGroups]: any = useState([]);
  const [isIntialised, setisIntialised] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  useEffect(() => {
    const IntialisePage = async () => {
      const dashboardService = new DashboardService();
      const taskData = await dashboardService.funGetTasks();
      const escalationData = await dashboardService.funGetEscalations();
      const groupData = await dashboardService.funGetGroups();
      taskData ? setTasks(taskData.data) : "";
      escalationData ? setEscalation(escalationData.data) : "";
      groupData ? setGroups(groupData.data) : "";
      setisIntialised(true);
    };
    IntialisePage();
  }, []);

  if (!user.email) return null;

  return (
    <div className={`dashboard-container ${collapsed ? "collapsed" : ""}`}>
      <header className="header">
        <Header userDetails={user} />
      </header>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main className="main-content">
        <div className="grid-container">
          <div className="box box1">
            {isIntialised ? (
              <Groups groups={group}></Groups>
            ) : (
              <Shimmer></Shimmer>
            )}
          </div>
          <div className="box box2">
            {isIntialised ? <Tasks tasks={tasks}></Tasks> : <Shimmer></Shimmer>}
          </div>
          <div className="box box3">
            {isIntialised ? (
              <Escalation escalations={escalation}></Escalation>
            ) : (
              <Shimmer></Shimmer>
            )}
          </div>
          <div className="box box4">
            {isIntialised ? (
               <Chats userDetails={user} groups={group}></Chats>
            ) : (
              <Shimmer></Shimmer>
            )}
           
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(Dashboard);
