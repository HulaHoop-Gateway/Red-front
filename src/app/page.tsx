"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import axiosAdmin from "@/api/axiosAdmin"; //

const LoginPage = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState({ username: "", password: "" });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("login-body-zoom-reset");
    return () => document.body.classList.remove("login-body-zoom-reset");
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ⭐ 관리자 로그인 처리
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { username, password } = inputValues;
    const ADMIN_LOGIN_API_ENDPOINT = "/api/admin/login";

    try {
      const response = await axiosAdmin.post(ADMIN_LOGIN_API_ENDPOINT, {
        id: username,
        password: password,
      });

      const { token, adminName } = response.data;

      if (token) {
        localStorage.setItem("admin_jwt", token);
        localStorage.setItem("admin_name", adminName || "관리자");

        console.log("관리자 로그인 성공! 토큰 저장됨:", token);

        router.push("/dashboard");
      } else {
        throw new Error("유효한 토큰을 받지 못했습니다.");
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else if (err.response.status === 403) {
          setError("접근 권한이 없습니다. 관리자 계정을 확인해주세요.");
        } else {
          setError(err.response.data.message || "로그인 중 오류가 발생했습니다.");
        }
      } else {
        setError("서버 연결 실패 또는 네트워크 오류");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white font-['Pretendard'] flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 transition-transform duration-700 ease-out"
      >
        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-24 items-center">
          <div className="space-y-8">
            <div className="animate-fadeUpSlow [animation-delay:100ms] opacity-0 [animation-fill-mode:forwards]">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-[120px] leading-none font-black text-red-600">
                  H
                </span>
                <span className="text-5xl leading-none font-light text-gray-400 pb-6">
                  ulahoop.
                </span>
                <span className="text-5xl leading-none font-ligh text-red-600">
                  RED
                </span>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-red-600 to-transparent mt-4" />
            </div>
          </div>

          <div className="animate-fadeUpSlow [animation-delay:200ms] opacity-0 [animation-fill-mode:forwards]">
            <form onSubmit={handleLogin} className="space-y-12">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  관리자 로그인
                </h3>
                <div className="w-12 h-0.5 bg-red-600" />
              </div>

              <div className="space-y-8">
                <div className="relative group">
                  <input
                    id="username"
                    type="text"
                    value={inputValues.username}
                    onChange={(e) =>
                      setInputValues({ ...inputValues, username: e.target.value })
                    }
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full px-0 py-4 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 text-lg font-medium outline-none transition-all duration-300 focus:border-red-600 placeholder-transparent"
                    placeholder="관리자 아이디"
                    autoComplete="username"
                    disabled={isLoading}
                  />

                  <label
                    htmlFor="username"
                    className={`absolute left-0 transition-all duration-300 pointer-events-none
                      ${inputValues.username || focusedField === "username"
                        ? "-top-6 text-sm font-bold text-red-600"
                        : "top-4 text-lg text-gray-400"
                      }`}
                  >
                    아이디
                  </label>

                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${focusedField === "username" ? "w-full" : "w-0"
                      }`}
                  />
                </div>

                <div className="relative group">
                  <input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={inputValues.password}
                    onChange={(e) =>
                      setInputValues({ ...inputValues, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full px-0 py-4 pr-10 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 text-lg font-medium outline-none transition-all duration-300 focus:border-red-600 placeholder-transparent"
                    placeholder="비밀번호"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />

                  <label
                    htmlFor="password"
                    className={`absolute left-0 transition-all duration-300 pointer-events-none
                      ${inputValues.password || focusedField === "password"
                        ? "-top-6 text-sm font-bold text-red-600"
                        : "top-4 text-lg text-gray-400"
                      }`}
                  >
                    비밀번호
                  </label>

                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300 ${focusedField === "password" ? "w-full" : "w-0"
                      }`}
                  />

                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-0 top-4 text-gray-400 hover:text-red-600 transition-colors"
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm font-medium text-red-500 mt-4">{error}</p>}

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  className="relative w-full group overflow-hidden"
                  disabled={isLoading}
                >
                  <div
                    className={`absolute inset-0 bg-red-600 transition-transform duration-300 ${isLoading ? "opacity-70" : "group-hover:scale-105"
                      }`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${isLoading ? "hidden" : "group-hover:translate-x-full"
                      } transition-transform duration-700`}
                  />
                  <div className="relative px-8 py-5 flex items-center justify-between text-white">
                    <span className="text-lg font-bold">
                      {isLoading ? "로그인 중..." : "로그인"}
                    </span>
                    {!isLoading && (
                      <svg
                        className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between text-xs text-gray-400 animate-fadeUpSlow [animation-delay:700ms] opacity-0 [animation-fill-mode:forwards]">
          <span>© 2025 Hulahoop</span>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-red-600 opacity-20" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-red-600 opacity-20" />
    </div>
  );
};

export default LoginPage;
