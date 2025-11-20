"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";

interface ServerInfo {
  brandCode: string;
  brandName: string;
  categoryName: string;
  baseUrl: string;
  port: number;
  healthPath: string;
}

interface ServerStatus extends ServerInfo {
  status: "UP" | "DOWN" | "UNKNOWN";
  responseTime?: number;
}

const columns = [
  { header: "카테고리", accessor: "categoryName" },
  { header: "브랜드명", accessor: "brandName" },
  {
    header: "Health URL",
    accessor: "healthUrl",
    className: "hidden md:table-cell",
  },
  { header: "응답 상태", accessor: "status" },
  {
    header: "응답 시간",
    accessor: "responseTime",
    className: "hidden md:table-cell",
  },
];

const StatusPage = () => {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🧩 서버 목록 1회만 불러오기
  const fetchServerList = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/servers");
      if (!res.ok) throw new Error("서버 목록을 불러올 수 없습니다.");
      const data: ServerInfo[] = await res.json();

      // 초기 상태는 UNKNOWN으로 설정
      const initialStatuses: ServerStatus[] = data.map((srv) => ({
        ...srv,
        status: "UNKNOWN",
        responseTime: undefined,
      }));

      setServers(initialStatuses);
    } catch (err: any) {
      console.error("서버 데이터 불러오기 실패:", err);
      setError("서버 모니터링 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 상태만 업데이트
  const updateServerStatuses = async () => {
    if (servers.length === 0) return;

    const updated = await Promise.all(
      servers.map(async (srv) => {
        const url = `${srv.baseUrl}:${srv.port}${srv.healthPath}`;
        const start = performance.now();
        try {
          const res = await fetch(url, { method: "GET" });
          const end = performance.now();
          const ms = Math.round(end - start);
          return {
            ...srv,
            status: res.ok ? "UP" : "DOWN",
            responseTime: ms,
          };
        } catch {
          return { ...srv, status: "DOWN" as const, responseTime: undefined };
        }
      })
    );

    setServers(updated);
  };

  // 첫 로드 시: 서버 목록 불러오고 상태 체크 1회
  useEffect(() => {
    (async () => {
      await fetchServerList();
    })();
  }, []);

  // 서버 목록 불러온 후: 10초마다 상태만 갱신
  useEffect(() => {
    if (servers.length > 0) {
      updateServerStatuses(); // 초기 1회 실행
      const intervalId = setInterval(updateServerStatuses, 1000);
      return () => clearInterval(intervalId);
    }
  }, [servers.length]);

  const renderRow = (item: ServerStatus) => (
    <tr
      key={item.brandCode}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">{item.categoryName}</td>
      <td>{item.brandName}</td>
      <td className="hidden md:table-cell">
        <a
          href={`${item.baseUrl}:${item.port}${item.healthPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {item.baseUrl}:{item.port}
        </a>
      </td>
      <td>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            item.status === "UP"
              ? "bg-green-100 text-green-700"
              : item.status === "DOWN"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.status}
        </span>
      </td>
      <td className="hidden md:table-cell">
        {item.responseTime ? `${item.responseTime}ms` : "N/A"}
      </td>
    </tr>
  );

  if (loading)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>🔍 서버 상태를 불러오는 중...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        <p>⚠️ 오류 발생: {error}</p>
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* 상단 */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          서버 상태 모니터링
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <button
            onClick={updateServerStatuses}
            className="flex items-center gap-2 bg-lamaYellow text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-600 transition"
          >
            <Image src="/plus.png" alt="Refresh" width={14} height={14} />
            <span>상태 새로고침</span>
          </button>
        </div>
      </div>

      {/* 목록 */}
      <Table columns={columns} renderRow={renderRow} data={servers} />
    </div>
  );
};

export default StatusPage;
