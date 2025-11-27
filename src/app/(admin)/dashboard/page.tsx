"use client"

import { useEffect, useState } from "react";
import TopQuestions from "@/components/TopQuestions";
import CountChart from "@/components/CountChart"
import DailyTransactionChart from "@/components/DailyTransactionChart"
import MonthlyTransactionChart from "@/components/MonthlyTransactionChart"
import UserCard from "@/components/UserCard"
import UserCardLineChart from "@/components/UserCardLineChart"
import { fetchDashboardData, DashboardData } from "@/lib/api";

//ctrl+좌클릭 하시면 컴포넌트의 파일로 바로 이동합니다.참고해주세요
const AdminPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!data) {
    return <div className="p-4">Failed to load data.</div>;
  }

  // Map category names for CountChart
  const countChartData = data.categoryRatio.map(item => ({
    name: item.name === 'Movie' || item.name === '영화' ? '영화관' : (item.name === 'Bike' || item.name === '자전거' ? '자전거' : item.name),
    value: item.value
  }));

  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* 왼쪽 */}
      <div className="w-full flex flex-col gap-8">  {/*lg:w-2/3*/}
        {/* 대시보드 상단 카드 */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="회원수" count={data.totalMembers} />
          <UserCard type="가맹점수" count={data.totalMerchants} />
          <UserCard type="외부 API 요청건수" count={data.totalApiRequests} />
          <UserCard type="H/G 처리건수" count={data.totalTransactions} />
        </div>
        {/*중간 차트 */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* 일별 거래 차트 */}
          <div className="w-full lg:w-1/2 h-[400px]">
            <DailyTransactionChart data={data.dailyTransactions} />
          </div>
          {/*월별 거래 차트 */}
          <div className="w-full lg:w-1/2 h-[400px]">
            <MonthlyTransactionChart data={data.monthlyTransactions} />
          </div>
          {/* /*가맹점 비율 차트 */}
          <div className="w-full lg:w-1/2 h-[400px]">
            <CountChart data={countChartData} />
          </div>
          <div className="w-full lg:w-1/2 h-[400px]">
            <TopQuestions />
          </div>
        </div>
        {/* 선 그래프 차트 */}
        <div className="w-full h-[500px]">
          <UserCardLineChart currentCounts={{
            totalMembers: data.totalMembers,
            totalMerchants: data.totalMerchants,
            totalApiRequests: data.totalApiRequests,
            totalTransactions: data.totalTransactions
          }} />
        </div>
      </div>
      {/* 오른쪽 */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8">
      <EventCalender />
      <Announcements/>
      </div> */}
    </div>
  )
}

export default AdminPage