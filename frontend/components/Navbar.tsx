"use client";

import { useEffect, useState } from "react";
import { logout } from "@/lib/auth";
import Link from "next/link";

export default function Navbar() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link href="/" className="font-bold">
        Task Tracker
      </Link>

      <div className="space-x-4">
        {!isAuth && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
          </>
        )}

        {isAuth && (
          <button
            onClick={logout}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
