import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useStore from '../store/useStore';

const ProjectForm = ({ project, onClose }) => {
    const isEditing = !!project;
    const { addProject, updateProjectInStore, properties, fetchProperties, users, fetchUsers } = useStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        propertyId: '',
        assignedToId: '',
        priority: 'MEDIUM',
        checkInDate: '',
        checkOutDate: '',
        customerName: '',
        nightStay: '',
        status: 'TODO'
    });

    useEffect(() => {
        if (properties.length === 0) fetchProperties();
        if (users.length === 0) fetchUsers();
    }, [fetchProperties, fetchUsers, properties.length, users.length]);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title || '',
                description: project.description || '',
                propertyId: project.propertyId || '',
                assignedToId: project.assignedToId || '',
                priority: project.priority || 'MEDIUM',
                checkInDate: project.checkInDate ? new Date(project.checkInDate).toISOString().slice(0, 16) : '',
                checkOutDate: project.checkOutDate ? new Date(project.checkOutDate).toISOString().slice(0, 16) : '',
                customerName: project.customerName || '',
                nightStay: project.nightStay || '',
                status: project.status || 'TODO'
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                // Ensure dates are ISO strings if present
                checkInDate: formData.checkInDate ? new Date(formData.checkInDate).toISOString() : undefined,
                checkOutDate: formData.checkOutDate ? new Date(formData.checkOutDate).toISOString() : undefined,
                nightStay: formData.nightStay ? parseInt(formData.nightStay) : undefined,
                // Handle empty strings for optional IDs
                propertyId: formData.propertyId || undefined,
                assignedToId: formData.assignedToId || undefined
            };

            if (isEditing) {
                await updateProjectInStore(project.id, payload);
            } else {
                await addProject(payload);
            }
            onClose();
        } catch (err) {
            console.error("Project save failed", err);
            setError(err.response?.data?.message || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">
                        {isEditing ? 'Edit Project' : 'New Project'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add details..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="BLOCKED">Blocked</option>
                                <option value="DONE">Done</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Property</label>
                        <select
                            name="propertyId"
                            value={formData.propertyId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">No Property</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                        <select
                            name="assignedToId"
                            value={formData.assignedToId}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Unassigned</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Guest name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Check-in</label>
                            <input
                                type="datetime-local"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Check-out</label>
                            <input
                                type="datetime-local"
                                name="checkOutDate"
                                value={formData.checkOutDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Number of Nights</label>
                        <input
                            type="number"
                            name="nightStay"
                            value={formData.nightStay}
                            onChange={handleChange}
                            min="1"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 3"
                        />
                    </div>
                </form>

                <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Project')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectForm;
