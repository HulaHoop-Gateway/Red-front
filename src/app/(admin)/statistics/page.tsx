"use client";
import { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Image from "next/image";

interface Statistics {
  id: string; // Unique ID for React key
  merchantCode: string;
  merchantName: string;
  paymentDate: string;
  transactionCount: number;
  transactionRatio: number;
  totalAmount: number;
  refundCount: number;
  refundAmount: number;
  netAmount: number;
  ratioPercentage: number;
}

const columns = [
  {
    header: "가맹점 정보",
    accessor: "info",
  },
  {
    header: "거래 횟수",
    accessor: "transactionCount",
    className: "hidden md:table-cell",
  },
  {
    header: "거래 비중(%)",
    accessor: "transactionRatio",
    className: "hidden lg:table-cell",
  },
  {
    header: "총 금액",
    accessor: "totalAmount",
    className: "hidden lg:table-cell",
  },
  {
    header: "환불 건수",
    accessor: "refundCount",
    className: "hidden lg:table-cell",
  },
  {
    header: "환불 금액",
    accessor: "refundAmount",
    className: "hidden lg:table-cell",
  },
  {
    header: "순매출액",
    accessor: "netAmount",
    className: "hidden lg:table-cell",
  },
  {
    header: "매출 비중(%)",
    accessor: "ratioPercentage",
  },
];

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchStatistics = async (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);
      const res = await fetch(`http://localhost:8000/api/statistics?${params}`);
      if (!res.ok) throw new Error("데이터를 불러올 수 없습니다.");
      const data = await res.json();
      const normalized: Statistics[] = data.map((item: any, index: number) => ({
        id: `${item.merchantCode}-${item.paymentDate}-${index}`, // 고유 ID 생성
        merchantCode: item.merchantCode ?? "-",
        merchantName: item.merchantName ?? "-",
        paymentDate: item.paymentDate ?? "-",
        transactionCount: item.transactionCount ?? 0,
        transactionRatio: item.transactionRatio ?? 0,
        totalAmount: item.totalAmount ?? 0,
        refundCount: item.refundCount ?? 0,
        refundAmount: item.refundAmount ?? 0,
        netAmount: item.netAmount ?? 0,
        ratioPercentage: item.ratioPercentage ?? 0,
      }));
      setStatistics(normalized);
    } catch (err: any) {
      setError(err.message ?? "알 수 없는 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const renderRow = (item: Statistics) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={"/assignment.png"} // 통계 아이콘
          alt={item.merchantName}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.merchantName}</h3>
          <p className="text-xs text-gray-500">{item.paymentDate}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.transactionCount.toLocaleString()}</td>
      <td className="hidden lg:table-cell">{item.transactionRatio.toFixed(2)}%</td>
      <td className="hidden lg:table-cell">{item.totalAmount.toLocaleString()} 원</td>
      <td className="hidden lg:table-cell">{item.refundCount}</td>
      <td className="hidden lg:table-cell">{item.refundAmount.toLocaleString()} 원</td>
      <td className="hidden lg:table-cell">{item.netAmount.toLocaleString()} 원</td>
      <td>{item.ratioPercentage.toFixed(2)}%</td>
    </tr>
  );

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>📊 통계 데이터를 불러오는 중...</p>
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
        <h1 className="hidden md:block text-lg font-semibold">이용 통계</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
            <span>~</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
            <button onClick={() => fetchStatistics(startDate, endDate)} className="bg-lamaYellow text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-600 transition">검색</button>
          </div>
        </div>
      </div>
      {/* 목록 */}
      <Table columns={columns} renderRow={renderRow} data={statistics} />
      {/* 페이지네이션 */}
      <Pagination />
    </div>
  );
}
