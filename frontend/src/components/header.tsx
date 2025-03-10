import Image from "next/image";
import "./css/header.css";
import { Helper } from "@/app/_helper/helper";
import Avatar, { genConfig } from "react-nice-avatar";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return "Good Morning,";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon,";
  } else if (hour >= 18 && hour < 22) {
    return "Good Evening,";
  } else {
    return "Good Night,";
  }
}

export default function Header({ userDetails }: any) {
  if (!userDetails?.avatar_url) return null;
  const helper = new Helper();
  return (
    <div className="header-container flex items-center">
      <div className="profile-image">
        <Avatar className="w-15 h-15" {...genConfig(userDetails?.email)} />
      </div>

      <div className="greeting-text">
        <h4 className="greeting-title">
          {getGreeting()}{" "}
          {helper.toSentenceCase(userDetails?.email.split("@")[0])}
        </h4>
        <p className="greeting-message">Hope your day goes organized!</p>
      </div>

      <div className="notifications ml-auto">
        <div className="notification-icons flex">
          <div className="notif-img">
            <Image src="/assets/image.png" alt="Notif" width={25} height={25} />
          </div>
          <div className="notif-img">
            <Image src="/assets/image.png" alt="Notif" width={25} height={25} />
          </div>
          <div className="notif-img">
            <Image src="/assets/image.png" alt="Notif" width={25} height={25} />
          </div>
          <div className="notif-img">
            <Image src="/assets/image.png" alt="Notif" width={25} height={25} />
          </div>
        </div>
        <p className="notification-message">
          You have received <strong>132 messages</strong> <br />
          <span className="new-line-text">since you last logged in</span>{" "}
        </p>
      </div>
    </div>
  );
}
