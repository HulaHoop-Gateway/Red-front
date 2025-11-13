"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Image from "next/image";

// 이용내역 데이터 타입을 정의합니다.
interface Transaction {
  id: string; // React key로 사용할 고유 ID
  transactionNum: string;
  memberCode: string;
  merchantCode: string;
  amountUsed: number;
  paymentDate: string;
  status: string;
  startDate: string;
  endDate: string;
}

// 사용자가 요청한 8개 컬럼을 정의합니다.
const columns = [
  {
    header: "거래번호",
    accessor: "transactionNum",
  },
  {
    header: "회원코드",
    accessor: "memberCode",
    className: "hidden md:table-cell",
  },
  {
    header: "가맹점코드",
    accessor: "merchantCode",
    className: "hidden lg:table-cell",
  },
  {
    header: "결제금액",
    accessor: "amountUsed",
    className: "hidden md:table-cell",
  },
  {
    header: "결제일자",
    accessor: "paymentDate",
    className: "hidden lg:table-cell",
  },
  {
    header: "상태",
    accessor: "status",
    className: "hidden lg:table-cell",
  },
  {
    header: "시작일",
    accessor: "startDate",
    className: "hidden lg:table-cell",
  },
  {
    header: "종료일",
    accessor: "endDate",
    className: "hidden lg:table-cell",
  },
];

const TransactionListPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: 향후 날짜 필터 파라미터를 API 요청에 추가해야 합니다.
        const res = await fetch("http://localhost:8000/api/transactions");
        if (!res.ok) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        // API 응답의 오타(transationNum)를 바로잡고 id를 할당합니다.
        const transactionsWithId = data.map((t: any) => ({
          ...t,
          id: t.transationNum,
          transactionNum: t.transationNum,
        }));
        setTransactions(transactionsWithId);
      } catch (err: any) {
        setError(err.message ?? "알 수 없는 오류 발생");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // 각 행을 렌더링하는 함수입니다.
  const renderRow = (item: Transaction) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.transactionNum}</td>
      <td className="hidden md:table-cell">{item.memberCode}</td>
      <td className="hidden lg:table-cell">{item.merchantCode}</td>
      <td className="hidden md:table-cell">{item.amountUsed.toLocaleString()}원</td>
      <td className="hidden lg:table-cell">{item.paymentDate}</td>
      <td className="hidden lg:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.status === "S"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status === "S" ? "Success" : "Refund/Cancelled"}
        </span>
      </td>
      <td className="hidden lg:table-cell">{item.startDate}</td>
      <td className="hidden lg:table-cell">{item.endDate}</td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>⏳ 이용내역 데이터를 불러오는 중...</p>
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
        <h1 className="hidden md:block text-lg font-semibold">전체 이용내역</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
            <span>~</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
            <button className="bg-lamaYellow text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-600 transition">
              검색
            </button>
          </div>
        </div>
      </div>
      {/* 목록 */}
      <Table columns={columns} renderRow={renderRow} data={transactions} />
      {/* 페이지네이션 */}
      <Pagination />
    </div>
  );
};

export default TransactionListPage;
