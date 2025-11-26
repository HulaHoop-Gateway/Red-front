"use client";

import { useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import { role } from "@/lib/data";
import axiosAdmin from "@/api/axiosAdmin";

interface User {
  memberCode: string;
  id: string;
  name: string;
  phoneNum: string;
  email: string;
  address: string;
  userType: string;
  notificationStatus: string;
}

const columns = [
  { header: "회원 정보", accessor: "info" },
  { header: "회원번호", accessor: "memberCode", className: "hidden md:table-cell" },
  { header: "아이디", accessor: "id", className: "hidden md:table-cell" },
  { header: "전화번호", accessor: "phoneNum", className: "hidden lg:table-cell" },
  { header: "이메일", accessor: "email", className: "hidden lg:table-cell" },
  { header: "주소", accessor: "address", className: "hidden lg:table-cell" },
  { header: "유저 타입", accessor: "userType", className: "hidden lg:table-cell" },
  { header: "알림 상태", accessor: "notificationStatus", className: "hidden lg:table-cell" },
  { header: "관리", accessor: "action" }
];

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");

  const fetchUsers = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosAdmin.get("/api/members", {
        params: {
          page: pageNum,
          size
        }
      });

      const json = res.data;

      setUsers(json.content);
      setPage(json.page);
      setTotalPages(json.totalPages);

    } catch (err: any) {
      setError(err.message ?? "데이터 요청 오류");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const filteredData = useMemo(() => {
    if (!keyword) return users;

    return users.filter((u) =>
      Object.values(u).some((v) =>
        String(v).toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [keyword, users]);

  const renderRow = (item: User) => (
    <tr
      key={item.memberCode}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src="/avatar.png"
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
      <td className="hidden md:table-cell">{item.memberCode ?? "-"}</td>
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="hidden lg:table-cell">{item.phoneNum ?? "-"}</td>
      <td className="hidden lg:table-cell">{item.email}</td>
      <td className="hidden lg:table-cell truncate max-w-[220px]">{item.address ?? "-"}</td>
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
          {role === "admin" && (
            <FormModal table="user" type="delete" id={item.memberCode} />
          )}
        </div>
      </td>
    </tr>
  );

  if (loading)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        회원 정보를 불러오는 중입니다...
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        오류: {error}
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">전체 회원</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch
            value={keyword}
            onChange={(v: string) => {
              setKeyword(v);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={filteredData} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => {
          setPage(p);
          fetchUsers(p);
        }}
      />
    </div>
  );
};

export default UserListPage;
