"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
    });

    saveToken(data.token);
    router.push("/dashboard");
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-black text-white p-2 w-full">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>Don't have an account? <a href="/signup" className="text-blue-500">Signup</a></p>
      </div>
    </div>
  );
}
