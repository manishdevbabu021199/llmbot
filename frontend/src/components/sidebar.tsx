"use client";
import "./css/sidebar.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Sidebar({ collapsed, setCollapsed }: any) {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };
  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      style={{
        display: "grid",
        gridTemplateRows: "1fr 1fr auto",
        height: "100%",
      }}
    >
      <div className="sidebar-header">
        <div className="flex flex-row items-center justify-center pb-5">
          {!collapsed && <h3 className="menuHeading">Menu</h3>}
          <button
            className="toggle-btn float-right"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>
        <div className="menu">
          <ul>
            {[
              {
                src: "/assets/sidebar/dashboard.svg",
                label: "Dashboard",
                width: 20,
                height: 20,
              },
              {
                src: "/assets/sidebar/insights.svg",
                label: "Insights",
                width: 20,
                height: 20,
              },
              {
                src: "/assets/sidebar/tasks.svg",
                label: "Tasks",
                width: 18,
                height: 18,
              },
              {
                src: "/assets/sidebar/sales.svg",
                label: "Sales",
                width: 18,
                height: 18,
              },
            ].map((item, index) => (
              <li
                key={index}
                className={`menu-item-container ${
                  collapsed ? "collapsed-center" : "noncollapsedPad"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={item.width}
                  height={item.height}
                  unoptimized
                />
                {!collapsed && <h3 className="menu-item">{item.label}</h3>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sidebar-body flex items-center justify-center">
        {!collapsed && (
          <div className="upgrade">
            <div className="upgrade-heading-container">
              <h4 className="upgrade-heading">Upgrade Plan</h4>
              <Image
                src="/assets/sidebar/Go.png"
                alt="Go"
                width={25}
                height={15}
              />
            </div>
            <p className="upgrade-content text-left">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
          </div>
        )}
        {collapsed && (
          <div className="upgrade-collapsed">
            <Image
              src="/assets/sidebar/Go.png"
              alt="Go"
              width={25}
              height={15}
            />
          </div>
        )}
      </div>

      <div className="sidebar-footer flex flex-col pb-4">
        <div className="menu bottom-menu w-full">
          <ul className="flex flex-col w-full">
            <li className="menu-item-container">
              <h3 className={`menu-item ${collapsed ? "" : "pl-3 py-1 "}`}>
                FAQs
              </h3>
            </li>
            <li className="menu-item-container">
              <h3
                className={`menu-item logout ${collapsed ? "" : "pl-3 py-1"}`}
                onClick={logout}
              >
                Logout
              </h3>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
