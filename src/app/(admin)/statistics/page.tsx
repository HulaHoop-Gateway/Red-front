"use client";
import { useEffect, useState } from "react";

interface Statistics {
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
      const normalized: Statistics[] = data.map((item: any) => ({
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

  if (loading)
    return <div className="text-center text-gray-600 mt-20 animate-pulse">📊 통계 데이터를 불러오는 중...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-20">⚠️ 오류 발생: {error}</div>;

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#f77062] to-[#fe5196] font-['Pretendard'] overflow-hidden">
      {/* 헤더 */}
      <div className="flex justify-between items-center w-full px-12 pt-8 text-white">
        <h1 className="text-3xl font-bold select-none">Hulahoop<span className="text-blue-400">.Red</span></h1>
        <div className="text-sm text-right leading-tight">
          세션남은시간 : <span className="font-semibold">30:00분</span><br />관리자님, 반갑습니다.
        </div>
        <button className="bg-white text-gray-700 px-5 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition">로그아웃</button>
      </div>

      {/* 카드 */}
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl mt-12 px-10 py-8 w-[90%] max-w-[1200px] flex flex-col items-center">
        <h2 className="text-white text-2xl font-semibold mb-6">📊 이용 통계 (가맹점별 · 일자별)</h2>

        {/* 기간 필터 */}
        <div className="flex gap-3 mb-6 text-gray-800">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
          <span className="text-white font-semibold mt-2">~</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
          <button onClick={() => fetchStatistics(startDate, endDate)} className="bg-white text-[#f77062] px-4 py-2 rounded-md font-semibold shadow hover:bg-pink-50 transition">검색</button>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-center bg-white text-sm">
            <thead className="bg-gradient-to-r from-[#f77062] to-[#fe5196] text-white">
              <tr>
                <th className="py-3">가맹점명</th>
                <th>결제일</th>
                <th>거래 횟수</th>
                <th>거래 비중(%)</th>
                <th>총 금액</th>
                <th>환불 건수</th>
                <th>환불 금액</th>
                <th>순매출액</th>
                <th>매출 비중(%)</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {statistics.length > 0 ? statistics.map((s, i) => (
                <tr key={i} className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-pink-50 transition`}>
                  <td className="py-3">{s.merchantName}</td>
                  <td>{s.paymentDate}</td>
                  <td>{s.transactionCount.toLocaleString()}</td>
                  <td>{s.transactionRatio.toFixed(2)}%</td>
                  <td>{s.totalAmount.toLocaleString()} 원</td>
                  <td className="text-red-500">{s.refundCount}</td>
                  <td className="text-red-500">{s.refundAmount.toLocaleString()} 원</td>
                  <td className="font-semibold text-blue-600">{s.netAmount.toLocaleString()} 원</td>
                  <td className="font-semibold text-purple-600">{s.ratioPercentage.toFixed(2)}%</td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="py-10 text-gray-500">📭 통계 데이터가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
