"use client";

import { MdEmail, MdLock } from "react-icons/md";

const LoginPage = () => {
  return (
    <div
      className="
        flex flex-col justify-center items-center 
        w-full h-[134dvh]     /* 화면 꽉 채우기 + 0.75 보정 */
        bg-gradient-to-br from-[#f77062] to-[#fe5196] 
        font-['Pretendard']
        overflow-hidden          /* 스크롤 차단 */
        fixed top-0 left-0       /* 전체 화면 고정 */
      "
      style={{ zoom: "1" }}      // 로그인만 zoom 1 유지
    >
      <h1 className="text-4xl font-bold mb-12 select-none">
        <span className="text-white">Hulahoop</span>
        <span className="text-blue-400 ml-1">.Red</span>
      </h1>

      <div
        className="
          bg-white/25 backdrop-blur-md 
          rounded-[2.5rem] shadow-2xl 
          px-20 py-16 
          text-center flex flex-col items-center
          w-[620px] min-h-[460px]   /* 박스 폭/높이 확대 */
          max-w-[90%]
        "
      >
        <h2 className="text-white text-3xl font-semibold mb-10">관리자 로그인</h2>

        <form className="flex flex-col gap-6 w-full">
          {/* 아이디 입력 */}
          <div className="flex items-center bg-white rounded-2xl px-5 py-4">
            <MdEmail className="text-gray-500 text-2xl mr-3" />
            <input
              type="text"
              placeholder="아이디"
              className="flex-1 border-none outline-none text-gray-700 text-lg bg-transparent"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="flex items-center bg-white rounded-2xl px-5 py-4">
            <MdLock className="text-gray-500 text-2xl mr-3" />
            <input
              type="password"
              placeholder="비밀번호"
              className="flex-1 border-none outline-none text-gray-700 text-lg bg-transparent"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="
              bg-gradient-to-r from-pink-400 to-pink-300 
              text-white font-semibold rounded-2xl py-4 mt-5 
              text-lg tracking-wide
              hover:opacity-90 transition
              w-full
            "
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
