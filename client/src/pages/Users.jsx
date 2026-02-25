import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { User, Trash2, Shield, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import InviteUserModal from '../components/InviteUserModal';

const UsersPage = () => {
    const { users, fetchUsers, updateUserRole, updateUserStatus, deleteUser, inviteUser, user: currentUser } = useStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            await updateUserRole(userId, newRole);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            await deleteUser(userId);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            await updateUserStatus(userId, newStatus);
        }
    };

    const handleInvite = async (userData) => {
        return await inviteUser(userData);
    };

    if (currentUser?.role !== 'ADMIN') {
        return (
            <div className="p-6 text-center">
                <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-600">You must be an administrator to view this page.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500">Manage team members and their roles</p>
                </div>
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    onClick={() => setShowInviteModal(true)}
                >
                    <User size={18} />
                    Invite User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">User</th>
                            <th className="p-4 font-semibold text-slate-600">Role</th>
                            <th className="p-4 font-semibold text-slate-600">Status</th>
                            <th className="p-4 font-semibold text-slate-600">Joined</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                            {u.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{u.name}</p>
                                            <p className="text-sm text-slate-500">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        disabled={u.id === currentUser.id}
                                    >
                                        <option value="TEAM">Team</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {u.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleStatusToggle(u.id, u.status)}
                                            disabled={u.id === currentUser.id}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 ${u.status === 'ACTIVE'
                                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            title={u.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                                        >
                                            {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            disabled={u.id === currentUser.id}
                                            className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <InviteUserModal
                    onClose={() => setShowInviteModal(false)}
                    onInvite={handleInvite}
                />
            )}
        </div>
    );
};

export default UsersPage;
