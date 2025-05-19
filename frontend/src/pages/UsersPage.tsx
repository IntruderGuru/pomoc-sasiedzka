// pages/UsersPage.tsx
import { useEffect, useState } from "react";
import { deactivateUser, fetchUsers, updateRole } from "../services/AdminService";
import { Toast } from "../components/Toast.tsx";
import { Spinner } from "../components/Spinner.tsx";
import { ConfirmModal } from "../components/ConfirmModal.tsx";


export const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadUsers = async () => {
        const _users = await fetchUsers();
        setUsers(_users.data);
        setLoading(false);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDeactivate = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const confirmDeactivate = async () => {
        await deactivateUser(selectedUser.id);
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        Toast.success("User deactivated");
        setShowModal(false);
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Users</h1>
            <table className="w-full bg-white shadow rounded">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-t">
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        updateRole(user.id, { role: e.target.value })
                                            .then(() => Toast.success("Role updated"))
                                    }
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeactivate(user)} className="text-red-600 hover:underline">
                                    Deactivate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <ConfirmModal
                    title="Confirm Deactivation"
                    onConfirm={confirmDeactivate}
                    onCancel={() => setShowModal(false)}
                >
                    Are you sure you want to deactivate {selectedUser.email}?
                </ConfirmModal>
            )}
        </div>
    );
};
