"use client"
import { count } from 'console';
import Image from 'next/image';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

// 나중에 차트 추가할 때 다시 쓸 예정
const data = [
    {
        name:'전체',
        count:100,
        fill:'#FFF'
    },
    {
        name: '오작동 서버',
        count: 20,
        fill: '#F87171',
    },
    {
        name: '작동 서버',
        count: 80,
        fill: '#FAE27C',
    }
];

const CountChart = () => {
    return (
        <div className='bg-white rounded-xl w-full h-full p-4'>
            {/* 제목 */}
            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold'>상태 체크</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20} />
            </div>
            {/* 차트 */}
            <div className='relative w-full h-[75%]'>
                <ResponsiveContainer>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                        <RadialBar
                        // label={{ position:'insideStart' , fill:'#FFF'}}
                            background
                            dataKey="count"
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image src="/maleFemale.png" alt='나중에 교체 할 예정' width={50} height={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'/>
            </div>
            {/* 아래 */}
            <div className="mt-3 flex justify-center gap-16">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 bg-red-400 rounded-full" />
                    <h1 className='font-bold'>오작동</h1>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 bg-lamaYellow rounded-full" />
                    <h1 className='font-bold'>작동</h1>
                </div>
            </div>
        </div>
    )
}

export default CountChart