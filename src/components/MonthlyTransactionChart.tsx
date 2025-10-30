"use client"

import Image from 'next/image';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

// #region Sample data
const data = [
  {
    name: '7월',
    bike: 4000,
    cinema: 2400,
  },
  {
    name: '8월',
    bike: 3000,
    cinema: 1398,
  },
  {
    name: '9월',
    bike: 2000,
    cinema: 9800,
  },
  {
    name: '10월',
    bike: 2780,
    cinema: 3908,
  },
  {
    name: '11월',
    bike: 1890,
    cinema: 4800,
  }
];

const MonthlyTransactionChart = () => {
  return (
    <div className='bg-white rounded-lg p-4 h-full'>
          <div className='flex justify-between items-center'>
            <h1 className='text-lg font-semibold'>월별 거래 금액</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </div>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              width={500}
              height={300}
              data={data}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
              <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
              <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:"10px",borderColor:"lightgray"}}/>
              <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop:"10px",paddingBottom:"50px"}}/>
              <Bar dataKey="bike" name={'자전거'} fill="#FAE27C" legendType='circle' radius={[10,10,0,0]}/>
              <Bar dataKey="cinema" name={'영화관'} fill="#C3EBFA" legendType='circle'  radius={[10,10,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
  )
}

export default MonthlyTransactionChart