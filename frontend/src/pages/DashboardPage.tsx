import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/AdminService";
import { Spinner } from "../components/Spinner";

export const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadDashboard = async () => {
        const _stats = await fetchDashboard();
        setStats(_stats.data);
        setLoading(false);
    }


    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard label="Users" value={stats.users} />
                <DashboardCard label="Categories" value={stats.categories} />
                <DashboardCard label="Announcements" value={stats.announcements} />
                <DashboardCard label="Comments" value={stats.comments} />
            </div>
        </div>
    );
};

const DashboardCard = ({ label, value }: { label: string; value: number }) => (
    <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-sm text-gray-500">{label}</h2>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);
