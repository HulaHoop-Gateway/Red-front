// hooks/useAdminAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAdminAuth() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_jwt");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setIsAuth(true);
  }, []);

  return isAuth;
}
