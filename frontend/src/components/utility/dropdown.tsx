import { useEffect, useState } from "react";
import Image from "next/image";

const Dropdown = ({ options, onSelect }: any) => {
  const [selected, setSelected] = useState(options[0] || { id: "", value: "" });

  useEffect(() => {
    const savedDataset = sessionStorage.getItem("selectedOption");
    if (savedDataset) {
      setSelected(JSON.parse(savedDataset));
      onSelect(JSON.parse(savedDataset));
    }
  }, []);

  const handleChange = (event: any) => {
    const selectedOption = options.find(
      (option: any) => option.id === event.target.value
    );
    if (selectedOption) {
      setSelected(selectedOption);
      onSelect(selectedOption);
    }
  };

  return (
    <div className="flex items-start flex-row relative">
      <select
        className="selectBox border border-black rounded-none appearance-none bg-white cursor-pointer"
        value={selected.id}
        onChange={handleChange}
      >
        {options.map((option: any) => (
          <option key={option.id} value={option.id}>
            {option.value}
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
