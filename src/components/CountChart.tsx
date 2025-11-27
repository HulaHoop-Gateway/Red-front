"use client"
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// red-700, gray-300
const COLORS = ['#CFCEFF', '#FAE27C'];

interface CountChartProps {
    data: { name: string; value: number }[];
}

const CountChart = ({ data }: CountChartProps) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div className='bg-white rounded-xl w-full h-full p-4 flex flex-col'>
            <h1 className='text-lg font-semibold'>주요 이용 현황</h1>

            <div className='relative w-full flex-grow mt-4'>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={90}
                            outerRadius={120}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            cornerRadius={8}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
                    <p className='text-gray-500 text-sm'>총 이용</p>
                    <p className='font-bold text-2xl'>{total}</p>
                </div>
            </div>

            <div className="mt-auto flex justify-center gap-8">
                {data.map((entry, index) => (
                    <div className="flex items-center gap-3" key={`legend-${index}`}>
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <div>
                            <p className='font-semibold text-gray-700'>{entry.name}</p>
                            <p className='text-sm text-gray-500'>{`${entry.value}회 (${total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0}%)`}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CountChart;
