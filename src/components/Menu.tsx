import Image from "next/image";
import Link from "next/link";

//메뉴바 목록
const menuItems = [
  {
    title: "메뉴",
    items: [
      {
        icon: "/home.png",
        label: "대시보드",
        href: "/dashboard",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/parent.png",
        label: "통계",
        href: "/statistics",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/teacher.png",
        label: "이용내역",
        href: "/history",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "가맹점 정보",
        href: "/merchant",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/class.png",
        label: "회원 정보",
        href: "/user",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "서버 모니터링",
        href: "/status",
        visible: ["admin"],
      },
      {
        icon: "/lesson.png",
        label: "스케쥴",
        href: "/schedule",
        visible: ["admin", "teacher"],
      },
      // {
      //   icon: "/exam.png",
      //   label: "Exams",
      //   href: "/list/exams",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/assignment.png",
      //   label: "Assignments",
      //   href: "/list/assignments",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/result.png",
      //   label: "Results",
      //   href: "/list/results",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/attendance.png",
      //   label: "Attendance",
      //   href: "/list/attendance",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/calendar.png",
      //   label: "Events",
      //   href: "/list/events",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/message.png",
      //   label: "Messages",
      //   href: "/list/messages",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
      // {
      //   icon: "/announcement.png",
      //   label: "Announcements",
      //   href: "/list/announcements",
      //   visible: ["admin", "teacher", "student", "parent"],
      // },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "프로필",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "설정",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "로그아웃",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-lg">
      {menuItems.map(i=>(
        <div className={`flex flex-col gap-2 ${i.title === "OTHER" ? "mt-72" : ""}`} key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map(item=>(
            <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight">
            <Image src={item.icon} alt="메뉴바 이미지" width={25} height={25}/>
            <span className="hidden lg:block">{item.label}</span> 
            </Link>
          ))}
        </div>
      ))}
    </div>
  );  
};

export default Menu