"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: "AI 기능 업데이트 미팅",
    time: "10:30 AM - 11:30 AM",
    description: "Spring AI 서비스의 챗봇 응답 속도 개선안 및 모델 교체 일정 논의.",
  },
  {
    id: 2,
    title: "가맹점 신규 계약 미팅",
    time: "1:00 PM - 2:00 PM",
    description: "신규 가맹점(하남 미사점) 계약 조건 검토 및 시스템 연동 일정 조율.",
  },
  {
    id: 3,
    title: "대시보드 UI 리팩터링",
    time: "3:00 PM - 5:00 PM",
    description: "React 기반 관리자 페이지 컴포넌트 구조 정리 및 색상 팔레트 통일 작업.",
  },
];


const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date(2025, 11, 12)); // 12월 12일, 2025 (월은 0부터 시작)
  const [mounted, setMounted] = useState(false);

  // Hydration 오류 방지: 클라이언트에서만 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='bg-white p-4 rounded-md'>
      {mounted && (
        <Calendar
          onChange={onChange}
          value={value}
          locale="en-US"
        />
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">일정</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.map(event => (
          <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple " key={event.id}>
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventCalendar