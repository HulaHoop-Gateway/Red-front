"use client";

import { useEffect, useState } from "react";

// ✅ ServerInfo 인터페이스 재정의
interface ServerInfo {
  brandCode: string;
  brandName: string;
  categoryName: string;
  baseUrl: string;
  port: number;
  healthPath: string;
}

// ✅ ServerStatus 인터페이스 (상태 및 응답 시간 추가)
interface ServerStatus extends ServerInfo {
  status: "UP" | "DOWN" | "UNKNOWN";
  responseTime?: number;
}

export default function ServerStatusMonitoringPage() {
  const [search, setSearch] = useState("");
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ 백엔드에서 서버 리스트 가져오기 및 상태 확인 (fetchServers는 변경 없음)
  const fetchServers = async () => {
    // 로딩 상태를 'true'로 설정하여 재요청 중임을 표시할 수 있습니다.
    // 첫 로딩이 아닌 재요청 시에는 loading 상태 변경을 생략하고 싶다면 조건부 로직을 추가할 수 있습니다.
    if (servers.length === 0) {
      setLoading(true);
    }
    setError(null);

    try {
      // 1. 서버 목록 API 호출
      const res = await fetch("http://localhost:8000/api/servers");
      if (!res.ok) throw new Error("서버 목록을 불러올 수 없습니다.");
      const data: ServerInfo[] = await res.json();

      // 2. 병렬로 상태 확인
      const checks = await Promise.all(
        data.map(async (srv) => {
          const url = `${srv.baseUrl}:${srv.port}${srv.healthPath}`;
          const start = performance.now();
          try {
            // NOTE: CORS 및 연결 거부 에러가 해결되지 않았다면 이 부분에서 에러가 발생하며 status는 'DOWN'으로 기록됩니다.
            const response = await fetch(url, { method: "GET" });
            const end = performance.now();
            const ms = Math.round(end - start);
            return {
              ...srv,
              status: response.ok ? "UP" : "DOWN",
              responseTime: ms,
            };
          } catch {
            return { ...srv, status: "DOWN" as const, responseTime: undefined };
          }
        })
      );

      setServers(checks);
    } catch (err: any) {
      console.error("서버 데이터 불러오기 실패:", err);
      setError("서버 모니터링 데이터를 불러오는 데 실패했습니다.");
    } finally {
      // 첫 로딩 이후에는 loading을 false로 설정
      if (loading) {
        setLoading(false);
      }
    }
  };

  // ⭐️ useEffect에 10초 주기 자동 새로고침 로직 추가
  useEffect(() => {
    // 1. 컴포넌트 마운트 시 즉시 한 번 실행
    fetchServers();

    // 2. 10초(10000ms)마다 fetchServers 함수를 실행
    const intervalId = setInterval(() => {
      // setLoading(true) 없이 데이터를 가져와야 깜빡임을 줄일 수 있습니다.
      fetchServers();
    }, 10000);

    // 3. 클린업 함수: 컴포넌트가 언마운트되거나 재실행될 때 타이머를 제거하여 메모리 누수를 방지합니다.
    return () => clearInterval(intervalId);
  }, []); // 의존성 배열이 비어있으므로, 오직 컴포넌트가 마운트/언마운트될 때만 실행됩니다.

  // ✅ 검색어 필터링 로직 (브랜드명, 코드, 베이스 URL 기준)
  const filtered = servers
    .filter((s) => s && typeof s === "object")
    .filter(
      (s) =>
        s.brandName?.includes(search) ||
        s.brandCode?.includes(search) ||
        s.baseUrl?.includes(search)
    );

  // 로딩 및 에러 처리 (가맹점 페이지 스타일 적용)
  if (loading)
    return (
      <div className="text-center text-white mt-20 animate-pulse bg-gradient-to-br from-[#f77062] to-[#fe5196] min-h-screen pt-40">
        🔍 서버 상태를 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-20 bg-gradient-to-br from-[#f77062] to-[#fe5196] min-h-screen pt-40">
        ⚠️ 오류 발생: {error}
      </div>
    );

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#f77062] to-[#fe5196] font-['Pretendard'] overflow-hidden">
      {/* 헤더 (가맹점 페이지와 동일) */}
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

      {/* 메인 카드 (가맹점 페이지와 동일) */}
      <div className="bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl mt-12 px-10 py-8 w-[90%] max-w-[1200px] flex flex-col items-center mb-12">
        <h2 className="text-white text-2xl font-semibold mb-8">
          🖥️ 서버 상태 모니터링
        </h2>

        {/* 검색창 (가맹점 페이지와 동일) */}
        <div className="flex items-center gap-3 mb-8 self-start">
          <label className="text-white text-sm font-semibold">검색 :</label>
          <input
            type="text"
            placeholder="브랜드명, 코드, 주소 검색"
            className="px-4 py-2 rounded-md border border-gray-300 w-72 text-gray-700 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 테이블 (가맹점 페이지 레이아웃 적용) */}
        <div className="w-full overflow-x-auto rounded-2xl shadow-lg">
          <table className="w-full text-center bg-white text-sm">
            <thead className="bg-gradient-to-r from-[#f77062] to-[#fe5196] text-white">
              <tr>
                <th className="py-3">카테고리</th>
                <th>브랜드 코드</th>
                <th>브랜드명</th>
                <th>Health URL</th>
                <th>응답 상태</th>
                <th>응답 시간</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filtered.length > 0 ? (
                filtered.map((s, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-pink-50 transition`}
                  >
                    <td className="py-3">{s.categoryName}</td>
                    <td>{s.brandCode}</td>
                    <td>{s.brandName}</td>
                    <td>
                      <a
                        href={`${s.baseUrl}:${s.port}${s.healthPath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {s.baseUrl}:{s.port}
                      </a>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          s.status === "UP"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.responseTime ? `${s.responseTime}ms` : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-gray-500">
                    📭 검색 결과가 없거나 데이터가 없습니다.
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