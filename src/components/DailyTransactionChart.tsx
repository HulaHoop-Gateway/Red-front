"use client";

import Image from 'next/image';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 나중에는 오늘 날짜 기준으로 가져올 예정
const data = [
  {
    name: '10-01',
    bike: 40,
    cinema: 24,
  },
  {
    name: '10-02',
    bike: 30,
    cinema: 13,
  },
  {
    name: '10-03',
    bike: 20,
    cinema: 98,
  },
  {
    name: '10-04',
    bike: 27,
    cinema: 39,
  },
  {
    name: '10-05',
    bike: 18,
    cinema: 48,
  }
];

//일별 거래 차트
const DailyTransactionChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>일별 거래 금액</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis dataKey="name" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
          <Legend align='left' verticalAlign='top' wrapperStyle={{ paddingTop: "10px", paddingBottom: "50px" }} />
          <Bar dataKey="bike" name={'자전거'} fill="#FAE27C" legendType='circle' radius={[10, 10, 0, 0]} />
          <Bar dataKey="cinema" name={'영화관'} fill="#C3EBFA" legendType='circle' radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DailyTransactionChart