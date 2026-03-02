import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit2, Trash2, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import ProjectForm from '../components/ProjectForm';

const Projects = () => {
    const { projects, fetchProjects, deleteProject, updateProjectStatus, updateProjectPriority, isProjectsLoading } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedProperties, setExpandedProperties] = useState({});

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteProject(id);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        await updateProjectStatus(id, newStatus);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProject(null);
    };

    const toggleProperty = (propertyName) => {
        setExpandedProperties(prev => ({
            ...prev,
            [propertyName]: !prev[propertyName]
        }));
    };

    const filteredProjects = (Array.isArray(projects) ? projects : []).filter(project => {
        const matchesStatus = filterStatus === 'ALL' || project.status === filterStatus;
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.property?.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Group projects by property and sort alphabetically
    const groupedProjects = filteredProjects.reduce((groups, project) => {
        const propertyName = project.property?.name || 'Unassigned';
        if (!groups[propertyName]) {
            groups[propertyName] = [];
        }
        groups[propertyName].push(project);
        return groups;
    }, {});

    // Sort the keys
    const sortedPropertyNames = Object.keys(groupedProjects).sort();

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DONE': return <CheckCircle size={16} className="text-green-500" />;
            case 'IN_PROGRESS': return <Clock size={16} className="text-blue-500" />;
            case 'BLOCKED': return <AlertCircle size={16} className="text-red-500" />;
            default: return <div className="w-4 h-4 rounded-full border-2 border-slate-300" />;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
                    <p className="text-slate-500 mt-1">Manage and track property projects</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Add Project</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grouped Projects */}
            <div className="space-y-4">
                {isProjectsLoading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
                        Loading projects...
                    </div>
                ) : Object.keys(groupedProjects).length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center text-slate-500">
                        No projects found.
                    </div>
                ) : (
                    sortedPropertyNames.map((propertyName) => (
                        <div key={propertyName} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Property Header */}
                            <button
                                onClick={() => toggleProperty(propertyName)}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
                            >
                                <div className="flex items-center gap-3">
                                    {expandedProperties[propertyName] ? (
                                        <ChevronDown size={20} className="text-slate-600" />
                                    ) : (
                                        <ChevronRight size={20} className="text-slate-600" />
                                    )}
                                    <h3 className="text-lg font-bold text-slate-900">{propertyName}</h3>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        {groupedProjects[propertyName].length} {groupedProjects[propertyName].length === 1 ? 'project' : 'projects'}
                                    </span>
                                </div>
                            </button>

                            {/* Projects Table */}
                            {expandedProperties[propertyName] && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Check-in</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Check-out</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nights</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {groupedProjects[propertyName].map((project) => {
                                                const getDaysRemaining = () => {
                                                    // Check if already checked out
                                                    if (project.checkOutDate) {
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);
                                                        const checkOut = new Date(project.checkOutDate);
                                                        checkOut.setHours(0, 0, 0, 0);

                                                        if (checkOut < today) {
                                                            return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">Checked out</span>;
                                                        }
                                                    }

                                                    if (!project.checkInDate) return null;
                                                    const today = new Date();
                                                    today.setHours(0, 0, 0, 0);
                                                    const checkIn = new Date(project.checkInDate);
                                                    checkIn.setHours(0, 0, 0, 0);
                                                    const diffTime = checkIn - today;
                                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                    if (diffDays < 0) return <span className="text-red-600 font-medium">Checked in</span>;
                                                    if (diffDays === 0) return <span className="text-green-600 font-medium">Today</span>;
                                                    if (diffDays === 1) return <span className="text-blue-600 font-medium">Tomorrow</span>;
                                                    return <span className="text-slate-500">{diffDays} days to check-in</span>;
                                                };

                                                return (
                                                    <tr key={project.id} className="hover:bg-slate-50 transition-colors group">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center gap-2">
                                                                {getStatusIcon(project.status)}
                                                                <select
                                                                    value={project.status}
                                                                    onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                                                    className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer"
                                                                >
                                                                    <option value="TODO">To Do</option>
                                                                    <option value="IN_PROGRESS">In Progress</option>
                                                                    <option value="BLOCKED">Blocked</option>
                                                                    <option value="DONE">Done</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <Link to={`/projects/${project.id}`} className="text-sm font-medium text-slate-900 hover:text-blue-600 hover:underline">
                                                                {project.title}
                                                            </Link>
                                                            <div className="text-xs mt-1">
                                                                {getDaysRemaining()}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                            {project.checkInDate ? new Date(project.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                            {project.checkOutDate ? new Date(project.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {project.nightStay ? (
                                                                <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded">
                                                                    {project.nightStay}n
                                                                </span>
                                                            ) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            {project.assignedTo ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                                                                        {project.assignedTo.name.charAt(0)}
                                                                    </div>
                                                                    <span className="text-sm text-slate-700">{project.assignedTo.name}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-slate-400 italic">Unassigned</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <select
                                                                value={project.priority}
                                                                onChange={(e) => updateProjectPriority(project.id, e.target.value)}
                                                                className={`px-2 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${getPriorityColor(project.priority)}`}
                                                            >
                                                                <option value="LOW">LOW</option>
                                                                <option value="MEDIUM">MEDIUM</option>
                                                                <option value="HIGH">HIGH</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleEdit(project)}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(project.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Project Form Modal */}
            {isFormOpen && (
                <ProjectForm
                    project={editingProject}
                    onClose={handleCloseForm}
                />
            )}
        </div>
    );
};

export default Projects;
