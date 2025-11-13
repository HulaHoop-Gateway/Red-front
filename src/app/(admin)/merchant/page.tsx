"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data"; // 역할(role) 데이터는 예시로 유지합니다.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// 기존 가맹점 데이터 타입을 유지합니다.
interface Merchant {
  id: string; // React key로 사용하기 위한 고유 ID
  merchantCode: string;
  merchantName: string;
  businessId: string;
  categoryName:string;
  registrationDate: string;
  terminationDate: string;
  contractStatus: string;
}

// 새로운 테이블 구조에 맞게 컬럼을 정의합니다.
const columns = [
  {
    header: "가맹점 정보",
    accessor: "info",
  },
  {
    header: "가맹점 코드",
    accessor: "merchantCode",
    className: "hidden md:table-cell",
  },
  {
    header: "사업자 번호",
    accessor: "businessId",
    className: "hidden md:table-cell",
  },
  {
    header: "계약 상태",
    accessor: "contractStatus",
    className: "hidden lg:table-cell",
  },
  {
    header: "계약 기간",
    accessor: "contractPeriod",
    className: "hidden lg:table-cell",
  },
  {
    header: "관리",
    accessor: "action",
  },
];

const MerchantListPage = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/merchants");
        if (!res.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        // API 응답에 id가 없을 경우 merchantCode를 id로 사용합니다.
        const merchantsWithId = data.map((m: any) => ({ ...m, id: m.merchantCode }));
        setMerchants(merchantsWithId);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  // 각 행을 렌더링하는 함수입니다.
  const renderRow = (item: Merchant) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={"/singleBranch.png"} // 가맹점 기본 아이콘
          alt={item.merchantName}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.merchantName}</h3>
          <p className="text-xs text-gray-500">{item.categoryName}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.merchantCode}</td>
      <td className="hidden md:table-cell">{item.businessId}</td>
      <td className="hidden md:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.contractStatus === "Y"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.contractStatus === "Y" ? "Active" : "Terminated"}
        </span>
      </td>
      <td className="hidden lg:table-cell">{`${item.registrationDate} ~ ${item.terminationDate}`}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/admin/merchant/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
          </Link>
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
      {/* 상단 */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">전체 가맹점</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/plus.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal table="merchant" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* 목록 */}
      <Table columns={columns} renderRow={renderRow} data={merchants} />
      {/* 페이지네이션 */}
      <Pagination />
    </div>
  );
};

export default MerchantListPage;
