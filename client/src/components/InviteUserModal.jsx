import React, { useState } from 'react';
import { X, Copy, Check, Mail, User, Shield } from 'lucide-react';

const InviteUserModal = ({ onClose, onInvite }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'TEAM',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteResult, setInviteResult] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await onInvite(formData);
            setInviteResult(result);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to invite user');
            setIsSubmitting(false);
        }
    };

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleClose = () => {
        setInviteResult(null);
        setFormData({ name: '', email: '', role: 'TEAM' });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {inviteResult ? 'User Invited!' : 'Invite New User'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!inviteResult ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Role
                                </label>
                                <div className="relative">
                                    <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                                    >
                                        <option value="TEAM">Team Member</option>
                                        <option value="ADMIN">Administrator</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Inviting...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {/* Success Message */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 font-medium">
                                    User has been successfully invited!
                                </p>
                                <p className="text-green-600 text-sm mt-1">
                                    Share the credentials below with {inviteResult.user.name}
                                </p>
                            </div>

                            {/* Credentials Display */}
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                                <h3 className="font-semibold text-slate-900 mb-3">Login Credentials</h3>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inviteResult.credentials.email}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(inviteResult.credentials.email, 'email')}
                                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Copy email"
                                        >
                                            {copiedField === 'email' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Temporary Password */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Temporary Password</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={inviteResult.credentials.tempPassword}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(inviteResult.credentials.tempPassword, 'password')}
                                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Copy password"
                                        >
                                            {copiedField === 'password' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Login URL */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Login URL</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={window.location.origin + '/login'}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono"
                                        />
                                        <button
                                            onClick={() => copyToClipboard(window.location.origin + '/login', 'url')}
                                            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Copy URL"
                                        >
                                            {copiedField === 'url' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-amber-800 text-sm">
                                    <strong>Note:</strong> The user will be prompted to change their password on first login.
                                </p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InviteUserModal;
