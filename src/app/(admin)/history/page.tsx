"use client";

import { useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import axiosAdmin from "@/api/axiosAdmin";

interface Transaction {
  id: string;
  transactionNum: string;
  memberCode: string;
  merchantCode: string;
  amountUsed: number;
  paymentDate: string;
  status: string;
  startDate: string;
  endDate: string;
}

const columns = [
  { header: "거래번호", accessor: "transactionNum" },
  { header: "회원코드", accessor: "memberCode", className: "hidden md:table-cell" },
  { header: "가맹점코드", accessor: "merchantCode", className: "hidden lg:table-cell" },
  { header: "결제금액", accessor: "amountUsed", className: "hidden md:table-cell" },
  { header: "결제일자", accessor: "paymentDate", className: "hidden lg:table-cell" },
  { header: "상태", accessor: "status", className: "hidden lg:table-cell" },
  { header: "시작일", accessor: "startDate", className: "hidden lg:table-cell" },
  { header: "종료일", accessor: "endDate", className: "hidden lg:table-cell" },
];

export default function TransactionListPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [keyword, setKeyword] = useState("");

  const fetchTransactions = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page: pageNum,
        size,
      };

      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axiosAdmin.get("/api/transactions", { params });
      const json = res.data;

      setTransactions(
        json.content.map((t: any, idx: number) => ({
          ...t,
          id: `${t.transactionNum}-${idx}`,
        }))
      );

      setPage(json.page);
      setTotalPages(json.totalPages);
    } catch (err: any) {
      setError(err.message ?? "오류 발생");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const filteredData = useMemo(() => {
    if (!keyword) return transactions;

    return transactions.filter((t) =>
      Object.values(t).some((v) =>
        String(v).toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [keyword, transactions]);

  const renderRow = (item: Transaction) => (
    <tr
      key={item.id}
      className="h-[78px] border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="px-4">{item.transactionNum}</td>
      <td className="hidden md:table-cell px-4">{item.memberCode}</td>
      <td className="hidden lg:table-cell px-4">{item.merchantCode}</td>
      <td className="hidden md:table-cell px-4">
        {item.amountUsed.toLocaleString()}원
      </td>
      <td className="hidden lg:table-cell px-4">{item.paymentDate}</td>
      <td className="hidden lg:table-cell px-4">
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
      <td className="hidden lg:table-cell px-4">{item.startDate}</td>
      <td className="hidden lg:table-cell px-4">{item.endDate}</td>
    </tr>
  );

  if (loading)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        이용내역 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        오류: {error}
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 min-h-[750px]">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">전체 이용내역</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch
            value={keyword}
            onChange={(v: string) => {
              setKeyword(v);
              setPage(1);
            }}
          />

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm"
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm"
            />

            <button
              onClick={() => {
                setPage(1);
                fetchTransactions(1);
              }}
              className="bg-lamaYellow text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-600 transition"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={filteredData} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchTransactions(p)}
      />
    </div>
  );
}
