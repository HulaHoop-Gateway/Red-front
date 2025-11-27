"use client"

import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CurrentCounts {
  totalMembers: number;
  totalMerchants: number;
  totalApiRequests: number;
  totalTransactions: number;
}

interface UserCardLineChartProps {
  currentCounts: CurrentCounts;
}

const UserCardLineChart = ({ currentCounts }: UserCardLineChartProps) => {
  // 1~11월은 하드코딩된 데이터 (12월 실제 값에 맞춰 스케일 조정)
  // API 요청건수와 H/G 처리건수는 1/10 스케일로 표시
  // 12월로 자연스럽게 이어지도록 점진적 증가 + 약간의 변동성
  const hardcodedData = [
    { name: '1월', user: 3, merchant: 2, apiRequest: 4.5, hgProcess: 2.5 },
    { name: '2월', user: 4, merchant: 3, apiRequest: 5.2, hgProcess: 3.1 },
    { name: '3월', user: 4, merchant: 3, apiRequest: 5.8, hgProcess: 3.5 },
    { name: '4월', user: 5, merchant: 4, apiRequest: 6.5, hgProcess: 4.2 },
    { name: '5월', user: 5, merchant: 4, apiRequest: 7.1, hgProcess: 4.8 },
    { name: '6월', user: 6, merchant: 5, apiRequest: 7.8, hgProcess: 5.3 },
    { name: '7월', user: 6, merchant: 5, apiRequest: 8.3, hgProcess: 5.7 },
    { name: '8월', user: 6, merchant: 5, apiRequest: 8.8, hgProcess: 6.1 },
    { name: '9월', user: 7, merchant: 6, apiRequest: 9.2, hgProcess: 6.4 },
    { name: '10월', user: 7, merchant: 6, apiRequest: 9.6, hgProcess: 6.7 },
    { name: '11월', user: 7, merchant: 6, apiRequest: 9.9, hgProcess: 6.9 },
  ];

  // 12월 데이터는 실제 DB 값 사용 (API, 거래는 1/10)
  const decemberData = {
    name: '12월',
    user: currentCounts.totalMembers,
    merchant: currentCounts.totalMerchants,
    apiRequest: currentCounts.totalApiRequests / 10,
    hgProcess: currentCounts.totalTransactions / 10,
  };

  // 전체 데이터 (1~12월)
  const data = [...hardcodedData, decemberData];

  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      {/* 제목 */}
      <div className="flex justify-between items-center">
        <h1 className='text-lg font-semibold'>상세 그래프</h1>
        <Image src="/moreDark.png" alt='' width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke='#ddd' />
          <XAxis dataKey="name" axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={16}
          />
          <YAxis axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false} />
          <Tooltip />
          <Legend
            align='center'
            verticalAlign='top'
            wrapperStyle={{ padding: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            name='회원수'
            dataKey="user"
            stroke="#7B61FF"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            name='가맹점수'
            dataKey="merchant"
            stroke="#00C6AE"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            name='외부 API 요청건수 (십)'
            dataKey="apiRequest"
            stroke="#FF7A00"
            strokeWidth={5}

          />
          <Line
            type="monotone"
            name='H/G 처리건수 (십)'
            dataKey="hgProcess"
            stroke="#FF4D8D"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default UserCardLineChart