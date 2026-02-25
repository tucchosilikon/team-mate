import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { Plus, Search, Edit, Trash, Phone, Mail, User } from 'lucide-react';
import { format } from 'date-fns';

const Leads = () => {
    const { leads, fetchLeads, createLead, updateLeadStatus, updateLead, deleteLead, isLeadsLoading } = useStore();
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const type = params.get('type');
        if (type) {
            setActiveTab(type);
        }
    }, [location.search]);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const tabs = [
        { id: 'ALL', label: 'All' },
        { id: 'OWNER', label: 'Owners' },
        { id: 'CUSTOMER', label: 'Customers' },
        { id: 'VENDOR', label: 'Vendors' },
        { id: 'CLEANER', label: 'Cleaners' },
        { id: 'PLUMBER', label: 'Plumbers' },
        { id: 'EMPLOYEE', label: 'Employees' },
    ];

    const filteredLeads = leads.filter(lead => {
        const matchesTab = activeTab === 'ALL' || lead.type === activeTab;
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.contactInfo?.email && lead.contactInfo.email.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const handleEdit = (lead) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this lead?')) {
            // await deleteLead(id); // Implement delete if needed, or just archive
            await updateLeadStatus(id, 'ARCHIVED');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Leads & Contacts</h1>
                <button
                    onClick={() => { setEditingLead(null); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus size={20} />
                    Add Contact
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Leads List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map(lead => (
                    <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lead.type === 'OWNER' ? 'bg-purple-100 text-purple-600' :
                                    lead.type === 'CUSTOMER' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{lead.name}</h3>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{lead.type}</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(lead)} className="p-1 text-gray-400 hover:text-indigo-600">
                                    <Edit size={16} />
                                </button>
                                {/* <button onClick={() => handleDelete(lead.id)} className="p-1 text-gray-400 hover:text-red-600">
                    <Trash size={16} />
                </button> */}
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            {lead.contactInfo?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-400" />
                                    <a href={`mailto:${lead.contactInfo.email}`} className="hover:underline">{lead.contactInfo.email}</a>
                                </div>
                            )}
                            {lead.contactInfo?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-400" />
                                    <a href={`tel:${lead.contactInfo.phone}`} className="hover:underline">{lead.contactInfo.phone}</a>
                                </div>
                            )}
                        </div>

                        <div className="mt-3 pt-3 border-t text-xs text-gray-400 flex justify-between">
                            <span>Status: {lead.status}</span>
                            <span>Added: {format(new Date(lead.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                ))}

                {filteredLeads.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No leads found matching your criteria.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <LeadFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    lead={editingLead}
                    createLead={createLead}
                    updateLead={updateLead}
                />
            )}

        </div>
    );
};

const LeadFormModal = ({ isOpen, onClose, lead, createLead, updateLead }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'CUSTOMER',
        email: '',
        phone: '',
        status: 'NEW'
    });

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name,
                type: lead.type,
                email: lead.contactInfo?.email || '',
                phone: lead.contactInfo?.phone || '',
                status: lead.status
            });
        }
    }, [lead]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            type: formData.type,
            status: formData.status,
            contactInfo: {
                email: formData.email,
                phone: formData.phone
            }
        };

        if (lead) {
            await updateLead(lead.id, payload);
        } else {
            await createLead(payload);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{lead ? 'Edit Contact' : 'Add New Contact'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="OWNER">Owner</option>
                            <option value="CUSTOMER">Customer</option>
                            <option value="VENDOR">Vendor</option>
                            <option value="CLEANER">Cleaner</option>
                            <option value="PLUMBER">Plumber</option>
                            <option value="EMPLOYEE">Employee</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Leads;
