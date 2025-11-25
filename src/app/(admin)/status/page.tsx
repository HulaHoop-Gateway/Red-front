"use client";

import { useEffect, useState, useMemo } from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import axiosAdmin from "@/api/axiosAdmin";

interface ServerInfo {
  brandCode: string;
  brandName: string;
  categoryName: string;
  baseUrl?: string;
  port?: number;
  healthPath?: string;
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

export default function StatusPage() {
  const [servers, setServers] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  const fetchServerList = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axiosAdmin.get("/api/servers");

      const data: ServerInfo[] = res.data.content ?? [];

      const initial: ServerStatus[] = data.map((srv) => ({
        ...srv,
        status: "UNKNOWN",
        responseTime: undefined,
      }));

      setServers(initial);
    } catch (err) {
      console.error("GET /api/servers 에러:", err);
      setError("서버 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const updateServerStatuses = async () => {
    if (servers.length === 0) return;

    const updated = await Promise.all(
      servers.map(async (srv) => {
        if (!srv.baseUrl || !srv.port || !srv.healthPath) {
          return { ...srv, status: "UNKNOWN", responseTime: undefined };
        }

        const healthUrl = `${srv.baseUrl}:${srv.port}${srv.healthPath}`;
        const start = performance.now();

        try {
          const res = await fetch(healthUrl);
          const ms = Math.round(performance.now() - start);

          return {
            ...srv,
            status: res.ok ? "UP" : "DOWN",
            responseTime: ms,
          };
        } catch {
          return { ...srv, status: "DOWN", responseTime: undefined };
        }
      })
    );

    setServers(updated);
  };

  useEffect(() => {
    fetchServerList();
  }, []);

  useEffect(() => {
    if (servers.length === 0) return;

    updateServerStatuses();

    const intervalId = setInterval(updateServerStatuses, 10000);
    return () => clearInterval(intervalId);
  }, [servers.length]);

  const filteredData = useMemo(() => {
    if (!keyword) return servers;

    return servers.filter((s) =>
      Object.values(s).some((v) =>
        String(v).toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [keyword, servers]);

  const totalPages = Math.ceil(filteredData.length / size) || 1;

  const pagedData = useMemo(() => {
    const start = (page - 1) * size;
    return filteredData.slice(start, start + size);
  }, [filteredData, page, size]);

  const renderRow = (item: ServerStatus) => {
    const hasURL = item.baseUrl && item.port && item.healthPath;
    const healthUrl = hasURL
      ? `${item.baseUrl}:${item.port}${item.healthPath}`
      : null;

    return (
      <tr
        key={item.brandCode}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="p-4">{item.categoryName}</td>
        <td>{item.brandName}</td>

        <td className="hidden md:table-cell">
          {hasURL ? (
            <a
              href={healthUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {healthUrl}
            </a>
          ) : (
            "N/A"
          )}
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
  };

  if (loading)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        서버 상태 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex justify-center items-center">
        {error}
      </div>
    );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          서버 상태 모니터링
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch
            value={keyword}
            onChange={(v: string) => {
              setKeyword(v);
              setPage(1);
            }}
          />

          <button
            onClick={updateServerStatuses}
            className="flex items-center gap-2 bg-lamaYellow text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-600 transition"
          >
            상태 새로고침
          </button>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={pagedData} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
