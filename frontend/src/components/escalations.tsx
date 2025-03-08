import "./css/escalations.css";
import Image from "next/image";
export default function Escalation({ escalations }: any) {
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
          unoptimized
        />
      </div>
      <div className="flex flex-col gap-1 scroll-container">
        {escalations.map((escalation: any) => (
          <div
            key={escalation.escalationID}
            className="flex flex-col escalation p-1 relative cursor-pointer"
          >
            <div className="escalation-name">{escalation.escalationDomain}</div>
            <div className="escalation-content">
              <h5>{escalation.escalationName}</h5>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <Image
                className="escalation-image"
                src={`https://avatar.iran.liara.run/public/boy?username=${escalation.username}`}
                alt="Notif"
                width={20}
                height={20}
                unoptimized
              />
              <div className="escalation-raised">
                {escalation.username.split("@")[0]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
