"use client";

import { useEffect, useState } from "react";

interface Merchant {
  merchantCode: string;
  merchantName: string;
  businessId: string;
  categoryName: string;
  registrationDate: string;
  terminationDate: string;
  contractStatus: string;
  categoryCode: string;
}

export default function MerchantListPage() {
  const [search, setSearch] = useState("");
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/merchants");
        if (!res.ok) throw new Error("데이터 요청 실패");
        const data = await res.json();
        setMerchants(data);
      } catch (err) {
        console.error("가맹점 데이터 불러오기 실패:", err);
      }
    };
    fetchMerchants();
  }, []);

  const filtered = merchants
    .filter((m) => m && typeof m === "object")
    .filter(
      (m) =>
        m.merchantName?.includes(search) ||
        m.merchantCode?.includes(search) ||
        m.businessId?.includes(search)
    );

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#f77062] to-[#fe5196] font-['Pretendard'] overflow-hidden">
      {/* 헤더 */}
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
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl mt-12 px-10 py-8 w-[90%] max-w-[1200px] flex flex-col items-center">
        <h2 className="text-white text-2xl font-semibold mb-8">
          🏪 가맹점 운영 정보
        </h2>

        {/* 검색창 */}
        <div className="flex items-center gap-3 mb-8 self-start">
          <label className="text-white text-sm font-semibold">검색 :</label>
          <input
            type="text"
            placeholder="가맹점명, 코드, 사업자번호 검색"
            className="px-4 py-2 rounded-md border border-gray-300 w-72 text-gray-700 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 테이블 */}
        <div className="w-full overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-center bg-white text-sm">
            <thead className="bg-gradient-to-r from-[#f77062] to-[#fe5196] text-white">
              <tr>
                <th className="py-3">카테고리</th>
                <th>가맹점코드</th>
                <th>가맹점명</th>
                <th>계약상태</th>
                <th>계약기간</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.length > 0 ? (
                filtered.map((m, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-pink-50 transition`}
                  >
                    <td className="py-3">{m.categoryName}</td>
                    <td>{m.merchantCode}</td>
                    <td>{m.merchantName}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          m.contractStatus === "Y"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {m.contractStatus === "Y" ? "Active" : "Terminated"}
                      </span>
                    </td>
                    <td>{`${m.registrationDate} ~ ${m.terminationDate}`}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-gray-500">
                    📭 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
