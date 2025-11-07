"use client";

import { useEffect, useState } from "react";

const TransactionListPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/transactions");
        if (!res.ok) throw new Error("데이터 요청 실패");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("이용내역 불러오기 실패:", err);
      }
    };
    fetchTransactions();
  }, []);

  // 검색 필터 (회원코드, 가맹점코드, 금액, 날짜)
  const filtered = transactions.filter(
    (t) =>
      t.member_code?.includes(search) ||
      t.merchant_code?.includes(search) ||
      t.amount_used?.toString().includes(search) ||
      t.payment_date?.includes(search)
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

      {/* 가운데 카드 */}
      <div
        className="
          bg-white/20 backdrop-blur-md
          rounded-3xl shadow-2xl
          mt-12 px-10 py-8
          w-[90%] max-w-[1200px]
          flex flex-col items-center
        "
      >
        <h2 className="text-white text-2xl font-semibold mb-8">이용내역 조회</h2>

        {/* 검색 영역 */}
        <div className="flex items-center gap-3 mb-8 self-start">
          <label className="text-white text-sm font-semibold">검색 :</label>
          <input
            type="text"
            placeholder="회원코드, 가맹점코드, 금액, 날짜 검색"
            className="px-4 py-2 rounded-md border border-gray-300 w-72 text-gray-700 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-white text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition text-sm">
            검색
          </button>
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-hidden rounded-2xl shadow-lg">
          <table className="w-full text-center bg-white">
            <thead className="bg-gradient-to-r from-[#f77062] to-[#fe5196] text-white text-sm">
              <tr>
                <th className="py-3">거래번호</th>
                <th>회원코드</th>
                <th>가맹점코드</th>
                <th>결제금액</th>
                <th>결제일자</th>
                <th>상태</th>
                <th>시작일</th>
                <th>종료일</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {filtered.length > 0 ? (
                filtered.map((t, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-pink-50 transition`}
                  >
                    <td className="py-3">{t.transation_num}</td>
                    <td>{t.member_code}</td>
                    <td>{t.merchant_code}</td>
                    <td>{t.amount_used.toLocaleString()}원</td>
                    <td>{t.payment_date}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          t.status === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.status === 1 ? "Success" : "Failed"}
                      </span>
                    </td>
                    <td>{t.start_date}</td>
                    <td>{t.end_date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-gray-500">
                    이용내역 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
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
};

export default TransactionListPage;
