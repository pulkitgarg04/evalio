"use client";
import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        testsCount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const currentUserStr = localStorage.getItem('user');
                if (!currentUserStr) return;
                const currentUser = JSON.parse(currentUserStr);
                const headers = { 'userId': currentUser._id || currentUser.user_id };

                const [usersRes, testsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/users`, { headers }),
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/tests`)
                ]);

                const usersData = usersRes.ok ? await usersRes.json() : [];
                const testsData = testsRes.ok ? await testsRes.json() : [];

                setStats({
                    usersCount: Array.isArray(usersData) ? usersData.length : 0,
                    testsCount: Array.isArray(testsData) ? testsData.length : 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0a3a30]">System Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-[#0a3a30]">{stats.usersCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Tests</p>
                        <p className="text-2xl font-bold text-[#0a3a30]">{stats.testsCount}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tests Taken</p>
                        <p className="text-2xl font-bold text-[#0a3a30]">0</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Now</p>
                        <p className="text-2xl font-bold text-[#0a3a30]">0</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[300px] flex flex-col justify-center items-center text-gray-400">
                    <p>Activity Chart Placeholder</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[300px] flex flex-col justify-center items-center text-gray-400">
                    <p>Recent Actions Placeholder</p>
                </div>
            </div>
        </div>
    );
}
