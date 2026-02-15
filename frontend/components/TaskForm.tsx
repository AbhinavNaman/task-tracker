"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function TaskForm({ onSuccess }: any) {
  const [title, setTitle] = useState("");

  const handleCreate = async () => {
    await api("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });

    setTitle("");
    onSuccess();
  };

  return (
    <div className="mb-4 flex gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Task"
        className="border p-2 flex-1"
      />
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4"
      >
        Add
      </button>
    </div>
  );
}
