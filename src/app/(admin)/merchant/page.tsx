"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import { FaFilm, FaBicycle } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";

interface Merchant {
  id: string;
  merchantCode: string;
  merchantName: string;
  businessId: string;
  categoryName: string;
  registrationDate: string;
  terminationDate: string;
  contractStatus: string;
}

const columns = [
  { header: "가맹점 정보", accessor: "info" },
  { header: "가맹점 코드", accessor: "merchantCode", className: "hidden md:table-cell" },
  { header: "사업자 번호", accessor: "businessId", className: "hidden md:table-cell" },
  { header: "계약 상태", accessor: "contractStatus", className: "hidden lg:table-cell" },
  { header: "계약 기간", accessor: "contractPeriod", className: "hidden lg:table-cell" },
  { header: "관리", accessor: "action" },
];

const MerchantListPage = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  // 검색 상태
  const [keyword, setKeyword] = useState("");

  // 페이징 상태
  const [page, setPage] = useState(1);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchMerchants = async (pageNum: number = page) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/merchants?page=${pageNum}&size=${size}`
      );

      if (!res.ok) throw new Error("데이터 조회 실패");

      const json = await res.json();

      const list = json.content.map((m: any) => ({
        ...m,
        id: m.merchantCode,
      }));

      setMerchants(list);
      setPage(json.page);
      setTotalPages(json.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants(1);
  }, []);

  // 검색 필터 적용
  const filteredData = useMemo(() => {
    if (!keyword) return merchants;
    return merchants.filter((m) =>
      Object.values(m).some((v) =>
        String(v).toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [keyword, merchants]);

  const renderRow = (item: Merchant) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {item.merchantCode.startsWith("M") ? (
            <FaFilm className="text-xl text-gray-500" />
          ) : item.merchantCode.startsWith("B") ? (
            <FaBicycle className="text-xl text-gray-500" />
          ) : (
            <Image
              src="/singleBranch.png"
              alt={item.merchantName}
              width={20}
              height={20}
            />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.merchantName}</h3>
          <p className="text-xs text-gray-500">{item.categoryName}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">{item.merchantCode}</td>
      <td className="hidden md:table-cell">{item.businessId}</td>

      <td className="hidden lg:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${item.contractStatus === "Y"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {item.contractStatus === "Y" ? "Active" : "Terminated"}
        </span>
      </td>

      <td className="hidden lg:table-cell">
        {`${item.registrationDate} ~ ${item.terminationDate}`}
      </td>

      <td>
        <div className="flex items-center gap-2">
          
          {role === "admin" && <FormModal table="merchant" type="update" data={item} />}

          {role === "admin" && (
            <FormModal table="merchant" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">전체 가맹점</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch value={keyword} onChange={(v: string) => setKeyword(v)} />

          <div className="flex items-center gap-4 self-end">

            {role === "admin" && <FormModal table="merchant" type="create" />}
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={filteredData} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchMerchants(p)}
      />
    </div>
  );
};

export default MerchantListPage;
