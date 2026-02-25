import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import {
    Calendar, User, CheckSquare, ArrowLeft, Plus,
    Trash2, MessageSquare, Clock, AlertCircle, CheckCircle,
    Edit, ExternalLink, Flame, Utensils, PawPrint, Car, Lock, Home
} from 'lucide-react';
import { format } from 'date-fns';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentProject: project,
        fetchProjectById,
        isCurrentProjectLoading,
        createSubProject,
        updateSubProject,
        deleteSubProject,
        addNote,
        deleteNote,
        users,
        fetchUsers,
        properties,
        fetchProperties,
        updateProjectInStore
    } = useStore();

    const [newSubProjectTitle, setNewSubProjectTitle] = useState('');
    const [subProjectAssignee, setSubProjectAssignee] = useState('');
    const [newNote, setNewNote] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchProjectById(id);
        if (users.length === 0) fetchUsers();
        if (properties.length === 0) fetchProperties();
    }, [id, fetchProjectById, fetchUsers, fetchProperties, users.length, properties.length]);

    if (isCurrentProjectLoading || !project) {
        return <div className="p-8 text-center text-slate-500">Loading project details...</div>;
    }

    const handleAddSubProject = async (e) => {
        e.preventDefault();
        if (!newSubProjectTitle.trim()) return;

        await createSubProject(project.id, {
            title: newSubProjectTitle,
            assignedToId: subProjectAssignee || undefined
        });
        setNewSubProjectTitle('');
        setSubProjectAssignee('');
    };

    const handleToggleSubProject = async (subProject) => {
        await updateSubProject(subProject.id, { isCompleted: !subProject.isCompleted });
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        await addNote(project.id, newNote);
        setNewNote('');
    };

    const handleEditProject = async (updatedData) => {
        try {
            await updateProjectInStore(project.id, updatedData);
            await fetchProjectById(project.id); // Refresh
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'border-red-600 text-red-700 bg-red-50';
            case 'MEDIUM': return 'border-yellow-600 text-yellow-700 bg-yellow-50';
            case 'LOW': return 'border-green-600 text-green-700 bg-green-50';
            default: return 'border-slate-600 text-slate-700 bg-slate-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Edit Project Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">Edit Project</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>
                        <EditProjectForm
                            project={project}
                            onSave={handleEditProject}
                            onCancel={() => setIsEditModalOpen(false)}
                            properties={properties}
                            users={users}
                        />
                    </div>
                </div>
            )}
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-1" /> Back
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                                {project.priority} Priority
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {project.dueDate ? format(new Date(project.dueDate), 'MMM d, yyyy h:mm a') : 'No Due Date'}
                            </span>
                            <span className="flex items-center gap-1">
                                <User size={14} />
                                {project.assignedTo ? project.assignedTo.name : 'Unassigned'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Edit size={16} />
                        Edit Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Project, Subprojects, Reservation) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Reservation Card */}
                    {project.reservation && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                                    <Calendar size={20} />
                                    Reservation Details
                                </h3>
                                <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                    {project.reservation.guestName}
                                </span>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Stay Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Check-in:</span>
                                            <span className="font-medium text-slate-900">
                                                {format(new Date(project.reservation.checkIn), 'MMM d, yyyy')}
                                                {project.reservation.earlyCheckIn && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1 rounded">Early</span>}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Check-out:</span>
                                            <span className="font-medium text-slate-900">
                                                {format(new Date(project.reservation.checkOut), 'MMM d, yyyy')}
                                                {project.reservation.lateCheckOut && <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-1 rounded">Late</span>}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Nights:</span>
                                            <span className="font-medium text-slate-900">
                                                {Math.round((new Date(project.reservation.checkOut) - new Date(project.reservation.checkIn)) / (1000 * 60 * 60 * 24))}
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 mt-6">Guest Count</h4>
                                    <div className="flex gap-4">
                                        <div className="text-center">
                                            <span className="block text-xl font-bold text-slate-800">{project.reservation.adults}</span>
                                            <span className="text-xs text-slate-500">Adults</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xl font-bold text-slate-800">{project.reservation.children}</span>
                                            <span className="text-xs text-slate-500">Children</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xl font-bold text-slate-800">{project.reservation.infants}</span>
                                            <span className="text-xs text-slate-500">Infants</span>
                                        </div>
                                        <div className="text-center">
                                            <span className="block text-xl font-bold text-slate-800">{project.reservation.pets}</span>
                                            <span className="text-xs text-slate-500">Pets</span>
                                        </div>
                                    </div>
                                    {project.reservation.petNote && (
                                        <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                                            Pet Note: {project.reservation.petNote}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Financials</h4>
                                    <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                                        <div className="flex justify-between font-bold text-green-700 border-b border-green-200 pb-2 mb-2">
                                            <span>Net Revenue</span>
                                            <span>${(Number(project.reservation.accommodationFare) + Number(project.reservation.cleaningFee) + Number(project.reservation.petFee)).toFixed(2)}</span>
                                        </div>

                                        <div className="space-y-1 text-slate-600">
                                            <div className="flex justify-between">
                                                <span>Accommodation</span>
                                                <span>${Number(project.reservation.accommodationFare).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Cleaning Fee</span>
                                                <span>${Number(project.reservation.cleaningFee).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Pet Fee</span>
                                                <span>${Number(project.reservation.petFee).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-200 mt-2">
                                            <h5 className="text-xs font-semibold text-slate-500 mb-1">Guest Payment Breakdown</h5>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Guest Service Fee</span>
                                                <span>${Number(project.reservation.guestServiceFee).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-600">
                                                <span>Taxes (NC + Dare)</span>
                                                <span>${(Number(project.reservation.ncTax) + Number(project.reservation.dareTax)).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-slate-800 pt-2 border-t border-slate-200 mt-1">
                                                <span>Total Guest Price</span>
                                                <span>${Number(project.reservation.totalPrice).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                        <p className="text-slate-600 whitespace-pre-wrap">
                            {project.description || 'No description provided.'}
                        </p>
                    </div>

                    {/* Subprojects */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <CheckSquare size={20} className="text-blue-600" />
                                Tasks
                            </h3>
                            <span className="text-sm text-slate-500">
                                {project.subProjects?.filter(st => st.isCompleted).length || 0} / {project.subProjects?.length || 0} completed
                            </span>
                        </div>

                        <div className="space-y-3 mb-6">
                            {project.subProjects?.map(st => (
                                <div key={st.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
                                    <button
                                        onClick={() => handleToggleSubProject(st)}
                                        className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${st.isCompleted
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-slate-300 hover:border-blue-500'
                                            }`}
                                    >
                                        {st.isCompleted && <CheckSquare size={14} />}
                                    </button>
                                    <span className={`flex-1 text-sm ${st.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {st.title}
                                    </span>
                                    {st.assignedTo && (
                                        <span className="text-xs px-2 py-1 bg-white rounded border border-slate-200 text-slate-600 flex items-center gap-1">
                                            <User size={10} /> {st.assignedTo.name}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => deleteSubProject(st.id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {(!project.subProjects || project.subProjects.length === 0) && (
                                <p className="text-sm text-slate-400 italic text-center py-2">No tasks yet.</p>
                            )}
                        </div>

                        <form onSubmit={handleAddSubProject} className="flex gap-2 items-start">
                            <input
                                type="text"
                                value={newSubProjectTitle}
                                onChange={(e) => setNewSubProjectTitle(e.target.value)}
                                placeholder="Add a task..."
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <select
                                value={subProjectAssignee}
                                onChange={(e) => setSubProjectAssignee(e.target.value)}
                                className="w-32 px-2 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">Assign...</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={!newSubProjectTitle.trim()}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Plus size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column (Property Info & Notes) */}
                <div className="space-y-8">

                    {/* Property Card */}
                    {project.property && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <Home size={20} className="text-indigo-600" />
                                Property Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-900">{project.property.name}</h4>
                                    <p className="text-sm text-slate-500">{project.property.address}</p>
                                </div>

                                {/* Listing Links */}
                                {(project.property.airbnbUrl || project.property.vrboUrl || project.property.otherUrl) && (
                                    <div className="flex gap-2">
                                        {project.property.airbnbUrl && (
                                            <a href={project.property.airbnbUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition text-xs font-medium">
                                                <ExternalLink size={12} />
                                                Airbnb
                                            </a>
                                        )}
                                        {project.property.vrboUrl && (
                                            <a href={project.property.vrboUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs font-medium">
                                                <ExternalLink size={12} />
                                                VRBO
                                            </a>
                                        )}
                                        {project.property.otherUrl && (
                                            <a href={project.property.otherUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-xs font-medium">
                                                <ExternalLink size={12} />
                                                Other
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Property Specs */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    {project.property.bedrooms && (
                                        <div className="text-center bg-slate-50 p-2 rounded">
                                            <div className="font-bold text-slate-800">{project.property.bedrooms}</div>
                                            <div className="text-slate-500">Beds</div>
                                        </div>
                                    )}
                                    {project.property.bathrooms && (
                                        <div className="text-center bg-slate-50 p-2 rounded">
                                            <div className="font-bold text-slate-800">{project.property.bathrooms}</div>
                                            <div className="text-slate-500">Baths</div>
                                        </div>
                                    )}
                                    {project.property.squareFeet && (
                                        <div className="text-center bg-slate-50 p-2 rounded">
                                            <div className="font-bold text-slate-800">{project.property.squareFeet}</div>
                                            <div className="text-slate-500">Sq Ft</div>
                                        </div>
                                    )}
                                </div>

                                {/* Amenities Icons */}
                                <div className="flex gap-3 justify-center py-3 border-y border-slate-100">
                                    <div className={`flex flex-col items-center ${project.property.hasStove ? 'text-green-600' : 'text-slate-300'}`} title="Stove">
                                        <Flame size={20} />
                                        <span className="text-[10px] mt-1">Stove</span>
                                    </div>
                                    <div className={`flex flex-col items-center ${project.property.hasDishwasher ? 'text-green-600' : 'text-slate-300'}`} title="Dishwasher">
                                        <Utensils size={20} />
                                        <span className="text-[10px] mt-1">Dishwasher</span>
                                    </div>
                                    <div className={`flex flex-col items-center ${project.property.petsAllowed ? 'text-green-600' : 'text-slate-300'}`} title={`Pets ${project.property.petsAllowed ? `(Max: ${project.property.maxPets || 0})` : 'Not Allowed'}`}>
                                        <PawPrint size={20} />
                                        <span className="text-[10px] mt-1">{project.property.petsAllowed ? `Pets (${project.property.maxPets || 0})` : 'No Pets'}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {/* Lockbox */}
                                    {project.property.lockboxCode && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                                                <Lock size={12} /> Lockbox Code
                                            </span>
                                            <div className="text-sm bg-slate-50 p-2 rounded font-mono text-slate-800">
                                                {project.property.lockboxCode}
                                            </div>
                                        </div>
                                    )}

                                    {/* Parking */}
                                    {project.property.parkingInstructions && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 flex items-center gap-1">
                                                <Car size={12} /> Parking
                                            </span>
                                            <div className="text-sm bg-slate-50 p-2 rounded text-slate-700">
                                                {project.property.parkingInstructions}
                                            </div>
                                        </div>
                                    )}

                                    {/* Wifi */}
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Wifi</span>
                                        <div className="text-sm bg-slate-50 p-2 rounded">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-slate-500">Name:</span>
                                                <span className="font-mono text-slate-800">{project.property.wifiName || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Pass:</span>
                                                <span className="font-mono text-slate-800">{project.property.wifiPassword || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <MessageSquare size={20} className="text-purple-600" />
                            Notes & Updates
                        </h3>

                        <div className="flex-1 space-y-4 mb-4 max-h-[500px] overflow-y-auto">
                            {project.notes?.map(note => (
                                <div key={note.id} className="bg-slate-50 p-3 rounded-lg relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-slate-700">{note.author.name}</span>
                                        <span className="text-xs text-slate-400">{format(new Date(note.createdAt), 'MMM d, h:mm a')}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{note.content}</p>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            {(!project.notes || project.notes.length === 0) && (
                                <p className="text-sm text-slate-400 italic text-center">No notes yet.</p>
                            )}
                        </div>

                        <form onSubmit={handleAddNote}>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Write a note..."
                                rows="3"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
                            />
                            <button
                                type="submit"
                                disabled={!newNote.trim()}
                                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm font-medium"
                            >
                                Add Note
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Edit Project Form Component
const EditProjectForm = ({ project, onSave, onCancel, properties, users }) => {
    const [formData, setFormData] = useState({
        title: project.title || '',
        description: project.description || '',
        propertyId: project.propertyId || '',
        assignedToId: project.assignedToId || '',
        priority: project.priority || 'MEDIUM',
        status: project.status || 'TODO',
        dueDate: project.dueDate ? new Date(project.dueDate).toISOString().slice(0, 16) : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
            propertyId: formData.propertyId || null,
            assignedToId: formData.assignedToId || null
        };
        onSave(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Property</label>
                    <select
                        name="propertyId"
                        value={formData.propertyId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">None</option>
                        {properties.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned To</label>
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
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                        <option value="DONE">Done</option>
                        <option value="BLOCKED">Blocked</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                    <input
                        type="datetime-local"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProjectDetails;
