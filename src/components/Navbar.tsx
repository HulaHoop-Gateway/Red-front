"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [adminName, setAdminName] = useState("관리자");

  useEffect(() => {
    const name = localStorage.getItem("admin_name");
    if (name) {
      setAdminName(name);
    }
  }, []);

  return (
    <div className='flex items-center justify-between p-4'>
      {/* 검색바 */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src="/search.png" alt="" width={14} height={14} />
        <input type="text" placeholder="검색.." className="w-[200px] p-2 bg-transparent outline-none" />
      </div>
      {/* 아이콘과 유저 */}
      <div className='flex items-center gap-6 justify-end w-full'>

        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{adminName}</span>
          <span className="text-[10px] text-gray-500 text-right">관리자</span>
        </div>
        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
      </div>
    </div>
  )
}

export default Navbar;