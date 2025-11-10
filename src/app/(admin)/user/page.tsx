"use client";

import { useEffect, useState } from "react";

const MemberListPage = () => {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/members");
        if (!res.ok) throw new Error("데이터 요청 실패");
        const data = await res.json();
        console.log("백엔드 응답:", data); // ✅ 확인용 로그
        setMembers(data);
      } catch (err) {
        console.error("회원 목록 불러오기 실패:", err);
      }
    };
    fetchMembers();
  }, []);

  // ✅ 검색 필터 (camelCase에 맞춤)
  const filtered = members.filter(
    (m) =>
      m.name?.includes(search) ||
      m.id?.includes(search) ||
      m.phoneNum?.includes(search)
  );

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#f77062] to-[#fe5196] font-['Pretendard'] overflow-hidden">
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
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl mt-12 px-10 py-8 w-[90%] max-w-[1200px] flex flex-col items-center">
        <h2 className="text-white text-2xl font-semibold mb-8">👤 회원조회</h2>

        {/* 검색창 */}
        <div className="flex items-center gap-3 mb-8 self-start">
          <label className="text-white text-sm font-semibold">검색 :</label>
          <input
            type="text"
            placeholder="아이디, 이름, 전화번호 검색"
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
                <th className="py-3">회원번호</th>
                <th>아이디</th>
                <th>이름</th>
                <th>전화번호</th>
                <th>이메일</th>
                <th>주소</th>
                <th>유저타입</th>
                <th>알림상태</th>
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
                    <td className="py-3">{m.memberCode ?? "—"}</td>
                    <td>{m.id}</td>
                    <td>{m.name}</td>
                    <td>{m.phoneNum ?? "—"}</td>
                    <td>{m.email}</td>
                    <td className="truncate max-w-[220px]">
                      {m.address ?? "—"}
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          m.userType === "A"
                            ? "bg-green-200 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {m.userType === "A" ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-md font-semibold ${
                          m.notificationStatus === "Y"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {m.notificationStatus === "Y" ? "ON" : "OFF"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-10 text-gray-500">
                    📭 회원 데이터가 없습니다.
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

export default MemberListPage;
