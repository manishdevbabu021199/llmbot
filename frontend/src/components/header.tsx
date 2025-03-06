import Image from "next/image";
import "./css/header.css";

export default function Header() {
  return (
    <div className="header-container flex items-center">
      <div className="profile-image">
        <Image src="/assets/image.png" alt="Profile" width={60} height={60} />
      </div>

      <div className="greeting-text">
        <h4 className="greeting-title">Good Morning, Manish</h4>
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
