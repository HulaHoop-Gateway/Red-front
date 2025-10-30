"use client"

import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// #region Sample data
const data = [
  { name: '1월', user: 1200, merchant: 3400, apiRequest: 5200, hgProcess: 2100 },
  { name: '2월', user: 1450, merchant: 2700, apiRequest: 6100, hgProcess: 3300 },
  { name: '3월', user: 1600, merchant: 3900, apiRequest: 7300, hgProcess: 2800 },
  { name: '4월', user: 1700, merchant: 4500, apiRequest: 4100, hgProcess: 3600 },
  { name: '5월', user: 2000, merchant: 3100, apiRequest: 8000, hgProcess: 2500 },
  { name: '6월', user: 1900, merchant: 4700, apiRequest: 6700, hgProcess: 3700 },
  { name: '7월', user: 2100, merchant: 3800, apiRequest: 5600, hgProcess: 2900 },
  { name: '8월', user: 2300, merchant: 5100, apiRequest: 7500, hgProcess: 3300 },
  { name: '9월', user: 2400, merchant: 3500, apiRequest: 6200, hgProcess: 4100 },
  { name: '10월', user: 2550, merchant: 5200, apiRequest: 7900, hgProcess: 2600 },
  { name: '11월', user: 2650, merchant: 4000, apiRequest: 5700, hgProcess: 3800 },
  { name: '12월', user: 2800, merchant: 4800, apiRequest: 8200, hgProcess: 3000 },
];




const UserCardLineChart = () => {
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
            name='외부 API 요청건수'
            dataKey="apiRequest"
            stroke="#FF7A00"
            strokeWidth={5}

          />
          <Line
            type="monotone"
            name='H/G 처리건수'
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