import { 
  MdDashboard, 
  MdAnalytics, 
  MdHistory, 
  MdStore, 
  MdPeople, 
  MdMonitor, 
  MdCalendarMonth, 
  MdLogout 
} from 'react-icons/md';

export const menuItems = [
  {
    title: "메뉴",
    items: [
      {
        icon: MdDashboard, 
        label: "대시보드",
        href: "/dashboard",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: MdAnalytics, 
        label: "통계",
        href: "/statistics",
        visible: ["admin", "teacher"],
      },
      {
        icon: MdHistory, 
        label: "이용내역",
        href: "/history",
        visible: ["admin", "teacher"],
      },
      {
        icon: MdStore, 
        label: "가맹점 정보",
        href: "/merchant",
        visible: ["admin", "teacher"],
      },
      {
        icon: MdPeople, 
        label: "회원 정보",
        href: "/user",
        visible: ["admin", "teacher"],
      },
      {
        icon: MdMonitor, 
        label: "서버 모니터링",
        href: "/status",
        visible: ["admin"],
      },
      {
        icon: MdCalendarMonth, 
        label: "스케쥴",
        href: "/schedule",
        visible: ["admin", "teacher"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: MdLogout, 
        label: "로그아웃",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];
