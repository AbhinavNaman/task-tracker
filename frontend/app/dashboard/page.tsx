"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { isAuthenticated } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
    const [tasks, setTasks] = useState<any[]>([]);

    const fetchTasks = async () => {
        const res = await api("/api/tasks");
        setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    if (!isAuthenticated()) {
        return (
            <div className="p-10">
                <h1 className="text-2xl mb-4">Unauthorized</h1>
                <p>Please log in to view the dashboard.</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="p-10">
                <h1 className="text-2xl mb-4">Dashboard</h1>
                <TaskForm onSuccess={fetchTasks} />
                <TaskList tasks={tasks} refresh={fetchTasks} />
            </div>
        </>
    );
}
