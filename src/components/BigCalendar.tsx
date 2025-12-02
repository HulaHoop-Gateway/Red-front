"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [date, setDate] = useState(new Date(2025, 11, 12)); // 12월 12일, 2025 (월은 0부터 시작)

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      startAccessor="start"
      endAccessor="end"
      views={["work_week", "day"]}
      view={view}
      style={{ height: "98%" }}
      onView={handleOnChangeView}
      date={date}
      onNavigate={(newDate) => setDate(newDate)}
      min={new Date(2025, 11, 12, 8, 0, 0)}
      max={new Date(2025, 11, 12, 17, 0, 0)}
    />
  );
};

export default BigCalendar;
