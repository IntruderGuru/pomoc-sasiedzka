import { Outlet, NavLink } from "react-router-dom";

export const AdminLayout = () => {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
                <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                    <NavLink to="/admin" end className="block hover:underline">Dashboard</NavLink>
                    <NavLink to="/admin/users" className="block hover:underline">Users</NavLink>
                    <NavLink to="/admin/categories" className="block hover:underline">Categories</NavLink>
                    <NavLink to="/admin/announcements" className="block hover:underline">Announcements</NavLink>
                    <NavLink to="/admin/comments" className="block hover:underline">Comments</NavLink>
                </nav>
            </aside>
            <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};
