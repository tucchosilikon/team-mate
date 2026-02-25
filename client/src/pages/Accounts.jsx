import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Plus, ArrowUpRight, ArrowDownLeft, DollarSign, Filter } from 'lucide-react';
import { format } from 'date-fns';

const Accounts = () => {
    const { transactions, fetchTransactions, createTransaction, getTransactionSummary, deleteTransaction, properties, fetchProperties } = useStore();
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
        fetchProperties();
        loadSummary();
    }, [fetchTransactions, fetchProperties]);

    const loadSummary = async () => {
        const data = await getTransactionSummary();
        if (data) setSummary(data);
    };

    const handleCreate = async (data) => {
        await createTransaction(data);
        setIsModalOpen(false);
        loadSummary();
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this transaction?')) {
            await deleteTransaction(id);
            loadSummary();
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Accounts & Transactions</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <ArrowUpRight size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Income</p>
                            <p className="text-2xl font-bold text-gray-800">${Number(summary.totalIncome).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <ArrowDownLeft size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Expenses</p>
                            <p className="text-2xl font-bold text-gray-800">${Number(summary.totalExpense).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Net Balance</p>
                            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${Number(summary.balance).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
                    {/* Filter placeholder */}
                    <button className="text-gray-400 hover:text-gray-600">
                        <Filter size={20} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Property</th>
                                <th className="p-4">Payer/Payee</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-gray-50">
                                    <td className="p-4">{format(new Date(tx.date), 'MMM d, yyyy')}</td>
                                    <td className="p-4 font-medium text-gray-800">{tx.description}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                                            {tx.category || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{tx.property?.name || '-'}</td>
                                    <td className="p-4 text-gray-500">{tx.lead?.name || '-'}</td>
                                    <td className={`p-4 text-right font-medium ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(tx.id)} className="text-gray-400 hover:text-red-500">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">No transactions recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <TransactionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreate}
                    properties={properties}
                />
            )}
        </div>
    );
};

const TransactionModal = ({ isOpen, onClose, onSubmit, properties }) => {
    const [formData, setFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        amount: '',
        type: 'EXPENSE',
        category: '',
        propertyId: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount),
            date: new Date(formData.date).toISOString()
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <select
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                className="w-full mt-1 p-2 border rounded-lg"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            required
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input
                                type="number"
                                required
                                min="0.01"
                                step="0.01"
                                className="w-full mt-1 pl-8 p-2 border rounded-lg"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            list="categories"
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <datalist id="categories">
                            <option value="Rent" />
                            <option value="Maintenance" />
                            <option value="Supplies" />
                            <option value="Utilities" />
                            <option value="Cleaning" />
                            <option value="Management Fee" />
                        </datalist>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Property (Optional)</label>
                        <select
                            className="w-full mt-1 p-2 border rounded-lg"
                            value={formData.propertyId}
                            onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                        >
                            <option value="">-- None --</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
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

export default Accounts;
