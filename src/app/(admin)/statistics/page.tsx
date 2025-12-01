"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import axiosAdmin from "@/api/axiosAdmin";
import { FaFilm, FaBicycle } from "react-icons/fa";

/* ----------------------------------------- */
/* 데이터 타입 */
/* ----------------------------------------- */
interface Statistics {
  id: string;
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

interface Merchant {
  merchantCode: string;
  merchantName: string;
  brandCode: string;
  categoryCode: string;
}

interface ServerResponseBrand {
  brandCode: string;
  brandName: string;
  categoryCode: string;
  categoryName: string;
}

interface BrandServer {
  brand_code: string;
  brand_name: string;
  category_code: string;
  category_name: string;
}

/* ----------------------------------------- */
/* 정렬 옵션 */
/* ----------------------------------------- */
const sortOptions: any = {
  paymentDate: { asc: "date_asc", desc: "date_desc" },
  transactionCount: { asc: "transaction_asc", desc: "transaction_desc" },
  transactionRatio: { asc: "ratio_asc", desc: "ratio_desc" },
  totalAmount: { asc: "amount_asc", desc: "amount_desc" },
  refundCount: { asc: "refund_asc", desc: "refund_desc" },
  refundAmount: { asc: "refundAmount_asc", desc: "refundAmount_desc" },
  netAmount: { asc: "net_asc", desc: "net_desc" },
  ratioPercentage: { asc: "percentage_asc", desc: "percentage_desc" },
};

/* 정렬 화살표 */
const SortArrow = ({ active, order }: any) => {
  if (!active) return <span className="ml-1 text-gray-400">↕</span>;
  return (
    <span className="ml-1 text-lamaPurple font-bold">
      {order === "asc" ? "▲" : "▼"}
    </span>
  );
};

/* ----------------------------------------- */
/* 메인 페이지 */
/* ----------------------------------------- */
export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortField, setSortField] =
    useState<keyof typeof sortOptions>("paymentDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /* 필터 상태 */
  const [merchantList, setMerchantList] = useState<Merchant[]>([]);
  const [categoryList, setCategoryList] = useState<BrandServer[]>([]);
  const [brandList, setBrandList] = useState<BrandServer[]>([]);

  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  /* 일별/월별 뷰 모드 */
  const [viewMode, setViewMode] = useState<"day" | "month">("day");

  /* ----------------------------------------- */
  /* Select 옵션 로드 */
  /* ----------------------------------------- */
  useEffect(() => {
    const loadOptions = async () => {
      try {
        /* ✅ 가맹점 페이징 응답 처리 수정 */
        const merchantRes = await axiosAdmin.get("/api/merchants", {
          params: { page: 1, size: 9999 },
        });

        setMerchantList(merchantRes.data.content);

        /* 브랜드 + 카테고리 */
        const serverRes = await axiosAdmin.get("/api/servers", {
          params: { page: 1, size: 9999 },
        });
        const serverData: ServerResponseBrand[] = serverRes.data.content;

        const converted: BrandServer[] = serverData.map((item) => ({
          brand_code: item.brandCode,
          brand_name: item.brandName,
          category_code: item.categoryCode,
          category_name: item.categoryName,
        }));

        /* 카테고리 중복 제거 */
        const categoryMap = new Map<string, BrandServer>();
        converted.forEach((item) => {
          if (!categoryMap.has(item.category_code))
            categoryMap.set(item.category_code, item);
        });

        setCategoryList([...categoryMap.values()]);
        setBrandList(converted);
      } catch (err) {
        console.log("옵션 조회 실패", err);
      }
    };

    loadOptions();
  }, []);

  /* ----------------------------------------- */
  /* 통계 조회 API */
  /* ----------------------------------------- */
  const fetchStatistics = async (
    start?: string,
    end?: string,
    pageNum: number = page,
    sortF: string = sortField,
    sortO: "asc" | "desc" = sortOrder
  ) => {
    setLoading(true);

    try {
      const params: any = {
        page: pageNum,
        size,
        sort: sortOptions[sortF][sortO],
      };

      if (start) params.startDate = start;
      if (end) params.endDate = end;
      if (selectedMerchant) params.merchantCode = selectedMerchant;
      if (selectedCategory) params.categoryCode = selectedCategory;
      if (selectedBrand) params.brandCode = selectedBrand;
      params.groupBy = viewMode; // ✅ 일별/월별 그룹화

      const res = await axiosAdmin.get("/api/statistics", { params });
      const json = res.data;

      setStatistics(
        json.content.map((item: any, idx: number) => ({
          id: `${item.merchantCode}-${item.paymentDate}-${idx}`,
          ...item,
        }))
      );

      setPage(json.page);
      setTotalPages(json.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [viewMode]); // ✅ viewMode 변경 시 자동 새로고침

  /* ----------------------------------------- */
  /* 정렬 */
  /* ----------------------------------------- */
  const handleSort = (field: keyof typeof sortOptions) => {
    const nextOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(nextOrder);
    fetchStatistics(startDate, endDate, 1, field, nextOrder);
  };

  /* ----------------------------------------- */
  /* 테이블 컬럼 */
  /* ----------------------------------------- */
  const tableColumns = [
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("paymentDate")}
        >
          가맹점 정보 <SortArrow active={sortField === "paymentDate"} order={sortOrder} />
        </div>
      ),
      accessor: "info",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("transactionCount")}
        >
          거래 횟수 <SortArrow active={sortField === "transactionCount"} order={sortOrder} />
        </div>
      ),
      accessor: "transactionCount",
      className: "hidden md:table-cell",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("transactionRatio")}
        >
          거래 비중(%) <SortArrow active={sortField === "transactionRatio"} order={sortOrder} />
        </div>
      ),
      accessor: "transactionRatio",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("totalAmount")}
        >
          총 금액 <SortArrow active={sortField === "totalAmount"} order={sortOrder} />
        </div>
      ),
      accessor: "totalAmount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("refundCount")}
        >
          환불 건수 <SortArrow active={sortField === "refundCount"} order={sortOrder} />
        </div>
      ),
      accessor: "refundCount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("refundAmount")}
        >
          환불 금액 <SortArrow active={sortField === "refundAmount"} order={sortOrder} />
        </div>
      ),
      accessor: "refundAmount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("netAmount")}
        >
          순매출액 <SortArrow active={sortField === "netAmount"} order={sortOrder} />
        </div>
      ),
      accessor: "netAmount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => handleSort("ratioPercentage")}
        >
          매출 비중(%){" "}
          <SortArrow active={sortField === "ratioPercentage"} order={sortOrder} />
        </div>
      ),
      accessor: "ratioPercentage",
    },
  ];

  /* ----------------------------------------- */
  /* Row 렌더링 */
  /* ----------------------------------------- */
  const renderRow = (item: Statistics) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {item.merchantCode.startsWith("M") ? (
            <FaFilm className="text-xl text-gray-500" />
          ) : item.merchantCode.startsWith("B") ? (
            <FaBicycle className="text-xl text-gray-500" />
          ) : (
            <Image
              src="/assignment.png"
              alt={item.merchantName}
              width={20}
              height={20}
            />
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.merchantName}</h3>
          <p className="text-xs text-gray-500">{item.paymentDate}</p>
        </div>
      </td>

      <td className="hidden md:table-cell">
        {item.transactionCount.toLocaleString()}
      </td>
      <td className="hidden lg:table-cell">
        {item.transactionRatio.toFixed(2)}%
      </td>
      <td className="hidden lg:table-cell">
        {item.totalAmount.toLocaleString()} 원
      </td>
      <td className="hidden lg:table-cell">{item.refundCount}</td>
      <td className="hidden lg:table-cell">
        {item.refundAmount.toLocaleString()} 원
      </td>
      <td className="hidden lg:table-cell">
        {item.netAmount.toLocaleString()} 원
      </td>
      <td>{item.ratioPercentage.toFixed(2)}%</td>
    </tr>
  );

  /* ----------------------------------------- */
  /* 화면 렌더링 */
  /* ----------------------------------------- */
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* 🔥 일별/월별 전환 버튼 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => {
            setViewMode("day");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-md font-semibold transition ${viewMode === "day"
            ? "bg-lamaPurple text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          📅 일별 통계
        </button>
        <button
          onClick={() => {
            setViewMode("month");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-md font-semibold transition ${viewMode === "month"
            ? "bg-lamaPurple text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          📊 월별 통계
        </button>
      </div>

      {/* 🔥 필터 영역 */}
      <div className="w-full flex flex-wrap gap-3 mb-5 items-center justify-center">
        {/* 카테고리 */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedBrand("");
            setSelectedMerchant("");
          }}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">전체 카테고리</option>
          {categoryList.map((c) => (
            <option key={c.category_code} value={c.category_code}>
              {c.category_name}
            </option>
          ))}
        </select>

        {/* 브랜드 */}
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedMerchant("");
          }}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">전체 브랜드</option>
          {brandList
            .filter((b) =>
              selectedCategory ? b.category_code === selectedCategory : true
            )
            .map((b) => (
              <option key={b.brand_code} value={b.brand_code}>
                {b.brand_name}
              </option>
            ))}
        </select>

        {/* 가맹점 */}
        <select
          value={selectedMerchant}
          onChange={(e) => setSelectedMerchant(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">전체 가맹점</option>

          {merchantList
            .filter((m) => {
              if (selectedCategory && m.categoryCode !== selectedCategory)
                return false;
              if (selectedBrand && m.brandCode !== selectedBrand) return false;
              return true;
            })
            .map((m) => (
              <option key={m.merchantCode} value={m.merchantCode}>
                {m.merchantName}
              </option>
            ))}
        </select>

        {/* 날짜 */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <span>~</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />

        <button
          onClick={() => fetchStatistics(startDate, endDate, 1)}
          className="bg-lamaYellow text-white px-4 py-2 rounded-md"
        >
          검색
        </button>
      </div>

      {/* 테이블 */}
      <Table columns={tableColumns} renderRow={renderRow} data={statistics} />

      {/* 페이지네이션 */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => fetchStatistics(startDate, endDate, p)}
      />
    </div>
  );
}
