import { create } from 'zustand';
import api from '../api/axios';

const useStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    projects: [],
    properties: [],
    leads: [],
    leads: [],
    blogs: [],
    isLoading: false,
    isProjectsLoading: false,
    isPropertiesLoading: false,


    // Auth Actions
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            set({ user: data, isAuthenticated: true, isLoading: false });
            return data;
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    updateUser: async (userData) => {
        const { data } = await api.put('/auth/profile', userData);
        set({ user: data });
        return data;
    },

    changePassword: async (passwordData) => {
        await api.put('/auth/password', passwordData);
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, projects: [], properties: [] });
    },

    isAuthChecking: true,

    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthChecking: false });
            return;
        }
        try {
            const { data } = await api.get('/auth/me');
            set({ user: data, isAuthenticated: true, isAuthChecking: false });
        } catch {
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isAuthChecking: false });
        }
    },

    // User Management
    users: [],
    fetchUsers: async () => {
        try {
            const { data } = await api.get('/auth/users');
            set({ users: data });
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    },

    updateUserRole: async (id, role) => {
        const { data } = await api.put(`/auth/users/${id}/role`, { role });
        set((state) => ({
            users: state.users.map((u) => (u.id === id ? data : u))
        }));
    },

    updateUserStatus: async (id, status) => {
        const { data } = await api.patch(`/auth/users/${id}/status`, { status });
        set((state) => ({
            users: state.users.map((u) => (u.id === id ? data : u))
        }));
    },

    deleteUser: async (id) => {
        await api.delete(`/auth/users/${id}`);
        set((state) => ({
            users: state.users.filter((u) => u.id !== id)
        }));
    },

    inviteUser: async (userData) => {
        const { data } = await api.post('/auth/users/invite', userData);
        // Refresh users list to include new invited user
        await get().fetchUsers();
        return data; // Return the invite result with credentials
    },

    // Project Actions
    fetchProjects: async () => {
        set({ isProjectsLoading: true });
        try {
            const { data } = await api.get('/projects');
            set({ projects: data, isProjectsLoading: false });
        } catch (error) {
            set({ isProjectsLoading: false });
            console.error(error);
        }
    },

    addProject: async (projectData) => {
        try {
            const { data } = await api.post('/projects', projectData);
            set((state) => ({ projects: [data, ...state.projects] }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateProjectInStore: async (id, projectData) => {
        try {
            const { data } = await api.put(`/projects/${id}`, projectData);
            set((state) => ({
                projects: state.projects.map((t) => (t.id === id ? data : t))
            }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateProjectStatus: async (id, status) => {
        try {
            const { data } = await api.patch(`/projects/${id}/status`, { status });
            set((state) => ({
                projects: state.projects.map((t) => (t.id === id ? data : t))
            }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateProjectPriority: async (id, priority) => {
        try {
            const { data } = await api.patch(`/projects/${id}/priority`, { priority });
            set((state) => ({
                projects: state.projects.map((t) => (t.id === id ? data : t))
            }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteProject: async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            set((state) => ({
                projects: state.projects.filter((t) => t.id !== id)
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // Single Project / Subprojects / Notes
    currentProject: null,
    isCurrentProjectLoading: false,

    fetchProjectById: async (id) => {
        set({ isCurrentProjectLoading: true });
        try {
            const { data } = await api.get(`/projects/${id}`);
            set({ currentProject: data, isCurrentProjectLoading: false });
        } catch (error) {
            set({ isCurrentProjectLoading: false });
            console.error(error);
        }
    },

    createSubProject: async (projectId, subProjectData) => {
        const { data } = await api.post(`/projects/${projectId}/subprojects`, subProjectData);
        set((state) => ({
            currentProject: {
                ...state.currentProject,
                subProjects: [...(state.currentProject.subProjects || []), data]
            }
        }));
    },

    updateSubProject: async (subProjectId, updates) => {
        const { data } = await api.put(`/projects/subprojects/${subProjectId}`, updates);
        set((state) => ({
            currentProject: {
                ...state.currentProject,
                subProjects: state.currentProject.subProjects.map(st => st.id === subProjectId ? data : st)
            }
        }));
    },

    deleteSubProject: async (subProjectId) => {
        await api.delete(`/projects/subprojects/${subProjectId}`);
        set((state) => ({
            currentProject: {
                ...state.currentProject,
                subProjects: state.currentProject.subProjects.filter(st => st.id !== subProjectId)
            }
        }));
    },

    addNote: async (projectId, content) => {
        const { data } = await api.post(`/projects/${projectId}/notes`, { content });
        set((state) => ({
            currentProject: {
                ...state.currentProject,
                notes: [data, ...(state.currentProject.notes || [])]
            }
        }));
    },

    deleteNote: async (noteId) => {
        await api.delete(`/projects/notes/${noteId}`);
        set((state) => ({
            currentProject: {
                ...state.currentProject,
                notes: state.currentProject.notes.filter(n => n.id !== noteId)
            }
        }));
    },

    // Property Actions
    fetchProperties: async () => {
        set({ isPropertiesLoading: true });
        try {
            const { data } = await api.get('/properties');
            set({ properties: data, isPropertiesLoading: false });
        } catch (error) {
            set({ isPropertiesLoading: false });
        }
    },

    uploadPropertyImage: async (id, files) => {
        const formData = new FormData();
        // Handle both single file and array of files
        if (files.length) {
            Array.from(files).forEach(file => {
                formData.append('images', file);
            });
        } else {
            formData.append('images', files);
        }

        try {
            const { data } = await api.post(`/properties/${id}/images`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update store
            set((state) => ({
                properties: state.properties.map((p) => (p.id === id ? { ...p, images: data.images } : p))
            }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createProperty: async (propertyData) => {
        try {
            const { data } = await api.post('/properties', propertyData);
            set((state) => ({ properties: [data, ...state.properties] }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateProperty: async (id, propertyData) => {
        try {
            const { data } = await api.put(`/properties/${id}`, propertyData);
            set((state) => ({
                properties: state.properties.map((p) => (p.id === id ? data : p))
            }));
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteProperty: async (id) => {
        try {
            await api.delete(`/properties/${id}`);
            set((state) => ({
                properties: state.properties.filter((p) => p.id !== id)
            }));
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    // Lead Actions
    fetchLeads: async () => {
        const { data } = await api.get('/leads');
        set({ leads: data });
    },

    createLead: async (leadData) => {
        const { data } = await api.post('/leads', leadData);
        set((state) => ({ leads: [data, ...state.leads] }));
    },

    updateLead: async (id, leadData) => {
        const { data } = await api.put(`/leads/${id}`, leadData);
        set((state) => ({
            leads: state.leads.map((l) => (l.id === id ? data : l))
        }));
    },

    updateLeadStatus: async (id, status) => {
        const { data } = await api.patch(`/leads/${id}/status`, { status });
        set((state) => ({
            leads: state.leads.map((l) => (l.id === id ? data : l))
        }));
    },

    // Blog Actions
    blogs: [],
    fetchBlogs: async () => {
        const { data } = await api.get('/blogs');
        set({ blogs: data });
    },

    deleteBlog: async (id) => {
        await api.delete(`/blogs/${id}`);
        set((state) => ({
            blogs: state.blogs.filter((b) => b.id !== id)
        }));
    },

    updateBlogStatus: async (id, status) => {
        const { data } = await api.put(`/blogs/${id}`, { status });
        set((state) => ({
            blogs: state.blogs.map((b) => (b.id === id ? data : b))
        }));
    },

    // Transaction Actions
    transactions: [],
    fetchTransactions: async () => {
        const { data } = await api.get('/transactions');
        set({ transactions: data });
    },

    getTransactionSummary: async () => {
        const { data } = await api.get('/transactions/summary');
        return data;
    },

    createTransaction: async (txData) => {
        const { data } = await api.post('/transactions', txData);
        set((state) => ({ transactions: [data, ...state.transactions] }));
    },

    deleteTransaction: async (id) => {
        await api.delete(`/transactions/${id}`);
        set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id)
        }));
    },

    // Dashboard Actions
    dashboardStats: null,
    fetchDashboardStats: async () => {
        try {
            const { data } = await api.get('/dashboard/stats');
            set({ dashboardStats: data });
        } catch (error) {
            console.error(error);
        }
    }
}));

export default useStore;
