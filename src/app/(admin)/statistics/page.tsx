"use client";

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Image from "next/image";
import axiosAdmin from "@/api/axiosAdmin";
import { FaFilm, FaBicycle } from "react-icons/fa";
import "./statistics.css";

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

const SortArrow = ({ active, order }: any) => {
  if (!active) return <span className="ml-1 text-gray-400">↕</span>;
  return (
    <span className="ml-1 text-lamaPurple font-bold">
      {order === "asc" ? "▲" : "▼"}
    </span>
  );
};

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [sortField, setSortField] = useState<keyof typeof sortOptions>("paymentDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [merchantList, setMerchantList] = useState<Merchant[]>([]);
  const [categoryList, setCategoryList] = useState<BrandServer[]>([]);
  const [brandList, setBrandList] = useState<BrandServer[]>([]);

  const [selectedMerchant, setSelectedMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [viewMode, setViewMode] = useState<"day" | "month">("day");

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const merchantRes = await axiosAdmin.get("/api/merchants", {
          params: { page: 1, size: 9999 },
        });
        setMerchantList(merchantRes.data.content);

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

        const categoryMap = new Map<string, BrandServer>();
        converted.forEach((item) => {
          if (!categoryMap.has(item.category_code))
            categoryMap.set(item.category_code, item);
        });

        setCategoryList(Array.from(categoryMap.values()));
        setBrandList(converted);
      } catch (err) {
        console.log("옵션 조회 실패", err);
      }
    };

    loadOptions();
  }, []);

  const fetchStatistics = async (
    start?: string,
    end?: string,
    sortF: string = sortField,
    sortO: "asc" | "desc" = sortOrder
  ) => {
    setLoading(true);

    try {
      const params: any = {
        page: 1,
        size: 9999,
        sort: sortOptions[sortF][sortO],
      };

      if (start) params.startDate = start;
      // 종료일에 시간을 추가하여 해당 날짜의 모든 데이터 포함 (23:59:59까지)
      if (end) params.endDate = end + " 23:59:59";
      if (selectedMerchant) params.merchantCode = selectedMerchant;
      if (selectedCategory) params.categoryCode = selectedCategory;
      if (selectedBrand) params.brandCode = selectedBrand;
      params.groupBy = viewMode;

      const res = await axiosAdmin.get("/api/statistics", { params });
      const json = res.data;

      setStatistics(
        json.content.map((item: any, idx: number) => ({
          id: `${item.merchantCode}-${item.paymentDate}-${idx}`,
          ...item,
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [viewMode]);

  const handleSort = (field: keyof typeof sortOptions) => {
    const nextOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(nextOrder);
    fetchStatistics(startDate, endDate, field, nextOrder);
  };

  const calculateTotalStats = () => {
    if (statistics.length === 0) {
      return {
        totalTransactionCount: 0,
        totalAmount: 0,
        totalRefundCount: 0,
        totalRefundAmount: 0,
        totalNetAmount: 0,
      };
    }

    return {
      totalTransactionCount: statistics.reduce((sum, item) => sum + item.transactionCount, 0),
      totalAmount: statistics.reduce((sum, item) => sum + item.totalAmount, 0),
      totalRefundCount: statistics.reduce((sum, item) => sum + item.refundCount, 0),
      totalRefundAmount: statistics.reduce((sum, item) => sum + item.refundAmount, 0),
      totalNetAmount: statistics.reduce((sum, item) => sum + item.netAmount, 0),
    };
  };

  const totalStats = calculateTotalStats();

  const tableColumns = [
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("paymentDate")}>
          가맹점 정보 <SortArrow active={sortField === "paymentDate"} order={sortOrder} />
        </div>
      ),
      accessor: "info",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("transactionCount")}>
          거래 횟수 <SortArrow active={sortField === "transactionCount"} order={sortOrder} />
        </div>
      ),
      accessor: "transactionCount",
      className: "hidden md:table-cell",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("transactionRatio")}>
          거래 비중(%) <SortArrow active={sortField === "transactionRatio"} order={sortOrder} />
        </div>
      ),
      accessor: "transactionRatio",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("totalAmount")}>
          총 금액 <SortArrow active={sortField === "totalAmount"} order={sortOrder} />
        </div>
      ),
      accessor: "totalAmount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("refundCount")}>
          환불 건수 <SortArrow active={sortField === "refundCount"} order={sortOrder} />
        </div>
      ),
      accessor: "refundCount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("refundAmount")}>
          환불 금액 <SortArrow active={sortField === "refundAmount"} order={sortOrder} />
        </div>
      ),
      accessor: "refundAmount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("netAmount")}>
          순매출액 <SortArrow active={sortField === "netAmount"} order={sortOrder} />
        </div>
      ),
      accessor: "netAmount",
      className: "hidden lg:table-cell",
    },
    {
      header: (
        <div className="flex items-center cursor-pointer" onClick={() => handleSort("ratioPercentage")}>
          매출 비중(%) <SortArrow active={sortField === "ratioPercentage"} order={sortOrder} />
        </div>
      ),
      accessor: "ratioPercentage",
    },
  ];

  const renderRow = (item: Statistics) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          {item.merchantCode.startsWith("M") ? (
            <FaFilm className="text-xl text-gray-500" />
          ) : item.merchantCode.startsWith("B") ? (
            <FaBicycle className="text-xl text-gray-500" />
          ) : (
            <Image src="/assignment.png" alt={item.merchantName} width={20} height={20} />
          )}
        </div>
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

  return (
    <div className="statistics-container">
      <div className="statistics-mode-buttons">
        <button
          onClick={() => setViewMode("day")}
          className={`statistics-mode-button ${viewMode === "day" ? "active" : "inactive"}`}
        >
          📅 일별 통계
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`statistics-mode-button ${viewMode === "month" ? "active" : "inactive"}`}
        >
          📊 월별 통계
        </button>
      </div>

      <div className="statistics-filters">
        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedBrand(""); setSelectedMerchant(""); }} className="statistics-select">
          <option value="">전체 카테고리</option>
          {categoryList.map((c) => (<option key={c.category_code} value={c.category_code}>{c.category_name}</option>))}
        </select>

        <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedMerchant(""); }} className="statistics-select">
          <option value="">전체 브랜드</option>
          {brandList.filter((b) => selectedCategory ? b.category_code === selectedCategory : true).map((b) => (<option key={b.brand_code} value={b.brand_code}>{b.brand_name}</option>))}
        </select>

        <select value={selectedMerchant} onChange={(e) => setSelectedMerchant(e.target.value)} className="statistics-select">
          <option value="">전체 가맹점</option>
          {merchantList.filter((m) => { if (selectedCategory && m.categoryCode !== selectedCategory) return false; if (selectedBrand && m.brandCode !== selectedBrand) return false; return true; }).map((m) => (<option key={m.merchantCode} value={m.merchantCode}>{m.merchantName}</option>))}
        </select>

        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="statistics-date-input" />
        <span>~</span>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="statistics-date-input" />

        <button onClick={() => fetchStatistics(startDate, endDate)} className="statistics-search-button">
          검색
        </button>
      </div>

      <div className="statistics-table-container">
        <Table columns={tableColumns} renderRow={renderRow} data={statistics} />
      </div>

      <div className="statistics-summary">
        <h3 className="statistics-summary-title">📊 전체 통계 요약</h3>
        <div className="statistics-summary-grid">
          <div className="statistics-summary-card">
            <p className="statistics-summary-label">총 거래 횟수</p>
            <p className="statistics-summary-value blue">{totalStats.totalTransactionCount.toLocaleString()}</p>
          </div>
          <div className="statistics-summary-card">
            <p className="statistics-summary-label">총 금액</p>
            <p className="statistics-summary-value green">{totalStats.totalAmount.toLocaleString()} 원</p>
          </div>
          <div className="statistics-summary-card">
            <p className="statistics-summary-label">환불 건수</p>
            <p className="statistics-summary-value orange">{totalStats.totalRefundCount.toLocaleString()}</p>
          </div>
          <div className="statistics-summary-card">
            <p className="statistics-summary-label">환불 금액</p>
            <p className="statistics-summary-value red">{totalStats.totalRefundAmount.toLocaleString()} 원</p>
          </div>
          <div className="statistics-summary-card">
            <p className="statistics-summary-label">순매출액</p>
            <p className="statistics-summary-value purple">{totalStats.totalNetAmount.toLocaleString()} 원</p>
          </div>
        </div>
      </div>
    </div>
  );
}
