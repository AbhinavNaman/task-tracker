"use client";

import { api } from "@/lib/api";

export default function TaskList({ tasks, refresh }: any) {
  const handleDelete = async (id: string) => {
    await api(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    refresh();
  };

  const handleToggle = async (task: any) => {
    await api(`/api/tasks/${task._id}`, {
      method: "PUT",
      body: JSON.stringify({
        status:
          task.status === "pending"
            ? "completed"
            : "pending",
      }),
    });
    refresh();
  };

  return (
    <div>
      {tasks.map((task: any) => (
        <div
          key={task._id}
          className="border p-2 flex justify-between mb-2"
        >
          <div>
            <p
              className={
                task?.status === "completed"
                  ? "line-through"
                  : ""
              }
            >
              {task.title}
            </p>
          </div>

          <div className="space-x-2">
            <button
              onClick={() => handleToggle(task)}
              className="text-green-600"
            >
              Toggle
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
