"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";

// 회원 데이터 타입을 정의합니다.
interface User {
  memberCode: string;
  id: string; // username
  name: string;
  phoneNum: string;
  email: string;
  address: string;
  userType: string;
  notificationStatus: string;
}

// 새로운 테이블 구조에 맞게 컬럼을 정의합니다.
const columns = [
  {
    header: "회원 정보",
    accessor: "info",
  },
  {
    header: "회원번호",
    accessor: "memberCode",
    className: "hidden md:table-cell",
  },
  {
    header: "아이디",
    accessor: "id",
    className: "hidden md:table-cell",
  },
  {
    header: "전화번호",
    accessor: "phoneNum",
    className: "hidden lg:table-cell",
  },
  {
    header: "이메일",
    accessor: "email",
    className: "hidden lg:table-cell",
  },
  {
    header: "주소",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "유저 타입",
    accessor: "userType",
    className: "hidden lg:table-cell",
  },
  {
    header: "알림 상태",
    accessor: "notificationStatus",
    className: "hidden lg:table-cell",
  },
  {
    header: "관리",
    accessor: "action",
  },
];

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8000/api/members");
        if (!res.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message ?? "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 각 행을 렌더링하는 함수입니다.
  const renderRow = (item: User) => (
    <tr
      key={item.memberCode}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={"/avatar.png"} // 기본 아바타 아이콘
          alt={item.name}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.memberCode ?? "—"}</td>
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="hidden lg:table-cell">{item.phoneNum ?? "—"}</td>
      <td className="hidden lg:table-cell">{item.email}</td>
      <td className="hidden lg:table-cell truncate max-w-[220px]">{item.address ?? "—"}</td>
      <td className="hidden lg:table-cell">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.userType === "A"
              ? "bg-green-200 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {item.userType === "A" ? "Admin" : "User"}
        </span>
      </td>
      <td className="hidden lg:table-cell">
        <span
          className={`px-2 py-1 rounded-md font-semibold ${
            item.notificationStatus === "Y"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.notificationStatus === "Y" ? "ON" : "OFF"}
        </span>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/admin/user/${item.memberCode}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="user" type="delete" id={item.memberCode} />
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>⏳ 회원 정보를 불러오는 중...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>⚠️ 오류 발생: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* 상단 */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">전체 회원</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && (
              <FormModal table="user" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* 목록 */}
      <Table columns={columns} renderRow={renderRow} data={users} />
      {/* 페이지네이션 */}
      <Pagination />
    </div>
  );
};

export default UserListPage;
