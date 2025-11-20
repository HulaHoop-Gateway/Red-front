import Image from "next/image";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const TableSearch = ({ value, onChange }: Props) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 py-1 bg-white">
      <Image src="/search.png" alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder="검색........."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
