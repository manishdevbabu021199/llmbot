import { useState } from "react";
import Image from "next/image";

const Dropdown = ({ options, onSelect }: any) => {
  const [selected, setSelected] = useState(options[0] || "");

  const handleChange = (event: any) => {
    setSelected(event.target.value);
    onSelect(event.target.value);
  };

  return (
    <div className="flex items-start flex-row relative">
      <select
        className="selectBox border border-black rounded-none appearance-none bg-white cursor-pointer"
        value={selected}
        onChange={handleChange}
      >
        {options.map((option: any, index: any) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
        <Image
          className="dropdown-arrow"
          src="/assets/chat/arrow.png"
          alt="Notif"
          width={10}
          height={10}
        />
      </div>
    </div>
  );
};

export default Dropdown;
