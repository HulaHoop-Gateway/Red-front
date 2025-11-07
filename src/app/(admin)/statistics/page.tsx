"use client";

import { useEffect, useState } from "react";

interface Statistics {
  merchantCode: string;
  merchantName: string;
  paymentDate: string;
  transactionCount: number;
  totalAmount: number;
}

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/statistics");
        if (!res.ok) throw new Error("데이터를 불러올 수 없습니다.");

        const data = await res.json();
        if (!data || !Array.isArray(data)) {
          throw new Error("서버에서 잘못된 응답을 받았습니다.");
        }

        const normalized: Statistics[] = data
          .filter((item: any) => item)
          .map((item: any) => ({
            merchantCode: item.merchantCode ?? item.merchant_code ?? "N/A",
            merchantName:
              item.merchantName ?? item.merchant_name ?? "알 수 없음",
            paymentDate: item.paymentDate ?? item.payment_date ?? "-",
            transactionCount:
              item.transactionCount ?? item.transaction_count ?? 0,
            totalAmount: item.totalAmount ?? item.total_amount ?? 0,
          }));

        setStatistics(normalized);
      } catch (err: any) {
        console.error("통계 요청 실패:", err);
        setError(err.message ?? "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-600 mt-10">
        📊 통계 데이터를 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        ⚠️ 오류 발생: {error}
      </div>
    );

  return (
    <div
      className="
        w-screen h-[134dvh]
        flex flex-col items-center
        bg-gradient-to-br from-[#f77062] to-[#fe5196]
        font-['Pretendard']
        overflow-hidden
      "
    >
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center w-full px-12 pt-8 text-white">
        <h1 className="text-3xl font-bold select-none">
          Hulahoop<span className="text-blue-400">.Red</span>
        </h1>

        <div className="text-sm text-right leading-tight">
          세션남은시간 : <span className="font-semibold">30:00분</span>
          <br />
          관리자님, 반갑습니다.
        </div>

        <button className="bg-white text-gray-700 px-5 py-2 rounded-full font-semibold shadow hover:bg-gray-100 transition">
          로그아웃
        </button>
      </div>

      {/* 메인 카드 */}
      <div
        className="
          bg-white/20 backdrop-blur-md
          rounded-3xl shadow-2xl
          mt-12 px-10 py-8
          w-[90%] max-w-[1200px]
          flex flex-col items-center
        "
      >
        <h2 className="text-white text-2xl font-semibold mb-8">
          📈 이용 통계 (일자별 · 가맹점별)
        </h2>

        {/* 테이블 */}
        <div className="w-full overflow-hidden rounded-2xl shadow-lg">
          <table className="w-full text-center bg-white">
            <thead className="bg-gradient-to-r from-[#f77062] to-[#fe5196] text-white text-sm">
              <tr>
                <th className="py-3">가맹점 코드</th>
                <th>가맹점명</th>
                <th>결제일</th>
                <th>거래 횟수</th>
                <th>총 금액</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {statistics.length > 0 ? (
                statistics.map((s, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-pink-50 transition`}
                  >
                    <td className="py-3">{s.merchantCode}</td>
                    <td>{s.merchantName}</td>
                    <td>{s.paymentDate}</td>
                    <td>{s.transactionCount.toLocaleString()} 건</td>
                    <td>{s.totalAmount.toLocaleString()} 원</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-gray-500">
                    📭 통계 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 총합 영역 */}
        {statistics.length > 0 && <SummaryFooter stats={statistics} />}

        {/* 페이지네이션 (디자인 통일) */}
        <div className="flex justify-center items-center mt-8 gap-2">
          <button className="px-3 py-1 text-sm bg-white/30 rounded-md hover:bg-white/40 text-white">
            이전
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className="px-3 py-1 text-sm bg-white/20 rounded-md hover:bg-white/30 text-white"
            >
              {n}
            </button>
          ))}
          <button className="px-3 py-1 text-sm bg-white/30 rounded-md hover:bg-white/40 text-white">
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ 누적 요약 하단 박스 */
function SummaryFooter({ stats }: { stats: Statistics[] }) {
  const totalTx = stats.reduce(
    (acc, cur) => acc + (cur.transactionCount || 0),
    0
  );
  const totalAmt = stats.reduce(
    (acc, cur) => acc + (cur.totalAmount || 0),
    0
  );

  return (
    <div className="mt-8 max-w-xl mx-auto bg-white rounded-xl shadow p-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        📊 누적 요약 (오늘 제외)
      </h2>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>총 거래 횟수</span>
        <span className="font-bold text-gray-900">
          {totalTx.toLocaleString()} 건
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>총 결제 금액</span>
        <span className="font-bold text-gray-900">
          {totalAmt.toLocaleString()} 원
        </span>
      </div>
    </div>
  );
}
