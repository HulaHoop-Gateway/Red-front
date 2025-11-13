"use client";
import "./login.css";
import { useEffect, useRef } from "react";
import { MdEmail, MdLock } from "react-icons/md";

const LoginPage = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      glow.style.transform = `translate(${clientX}px, ${clientY}px)`;
    };

    // 데스크탑 전용
    if (window.innerWidth > 768) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="
        login-page
        fixed inset-0
        flex flex-col items-center justify-center
        bg-gradient-to-br from-black via-[#140000] to-[#2b0000]
        text-white font-['Pretendard']
        overflow-hidden relative
      "
    >
      {/* 🌌 네온 백그라운드 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[480px] h-[480px] bg-red-600/25 blur-[160px] rounded-full animate-floatSoft" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[420px] h-[420px] bg-rose-600/25 blur-[140px] rounded-full animate-floatSoft delay-[2s]" />
      </div>

      {/* 💫 마우스 트래킹 네온 */}
      <div
  ref={glowRef}
  className="absolute w-[400px] h-[400px] bg-red-500/30 blur-[160px] rounded-full pointer-events-none transition-transform duration-300 ease-out"
  style={{
    transform: "translate(-50%, -50%)", // ✅ 중심 정렬
    left: "0px",
    top: "0px",
  }}
></div>

      {/* 💧 워터마크 로고 */}
      <h1 className="absolute text-[10rem] sm:text-[14rem] font-extrabold text-red-900/10 select-none pointer-events-none">
        H
      </h1>

      {/* 🔴 브랜드 로고 */}
      <h1
        className="
          text-5xl md:text-6xl font-extrabold mb-16 tracking-tight select-none
          drop-shadow-[0_0_16px_rgba(255,0,0,0.6)]
          opacity-0 animate-fadeUpSlow
        "
      >
        Hulahoop<span className="text-red-500">.Red</span>
      </h1>

      {/* 🧠 로그인 폼 */}
      <form
        className="
          flex flex-col gap-6 w-[85%] max-w-[520px]
          opacity-0 animate-fadeUpSlow delay-[0.4s]
        "
      >
        {/* 아이디 */}
        <div className="
          flex items-center border-b-2 border-white/20 pb-3 transition-all duration-300
          focus-within:border-red-500 focus-within:scale-[1.02] focus-within:shadow-[0_0_20px_rgba(255,0,0,0.25)]
          bg-transparent rounded-lg px-2
        ">
          <MdEmail className="text-red-400 text-xl mr-3 transition-colors duration-300" />
          <input
            type="text"
            placeholder="아이디"
            className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-lg md:text-xl tracking-wide"
          />
        </div>

        {/* 비밀번호 */}
        <div className="
          flex items-center border-b-2 border-white/20 pb-3 transition-all duration-300
          focus-within:border-red-500 focus-within:scale-[1.02] focus-within:shadow-[0_0_20px_rgba(255,0,0,0.25)]
          bg-transparent rounded-lg px-2
        ">
          <MdLock className="text-red-400 text-xl mr-3 transition-colors duration-300" />
          <input
            type="password"
            placeholder="비밀번호"
            className="flex-1 bg-transparent outline-none text-white placeholder-white/50 text-lg md:text-xl tracking-wide"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="
            group mt-10 py-4 rounded-full text-lg md:text-xl font-semibold tracking-wide
            bg-gradient-to-r from-red-600 via-rose-600 to-pink-500
            shadow-[0_0_30px_rgba(255,0,0,0.35)]
            hover:shadow-[0_0_55px_rgba(255,0,0,0.65)]
            hover:opacity-90 active:scale-[0.98]
            transition-all duration-300 relative overflow-hidden
          "
        >
          <span
            className="relative z-10 group-hover:text-white/90 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,120,120,0.8)]"
          >
            로그인
          </span>
          {/* 버튼 내부 빛 */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
        </button>
      </form>

      {/* 푸터 */}
      <p className="absolute bottom-6 text-xs md:text-sm text-white/50 select-none">
        © 2025 Hulahoop. All rights reserved.
      </p>
    </div>
  );
};

export default LoginPage;
