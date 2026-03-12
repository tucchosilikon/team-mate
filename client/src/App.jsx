import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Leads from './pages/Leads';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import { useEffect } from 'react';
import useStore from './store/useStore';
import UsersPage from './pages/Users';
import ProjectDetails from './pages/ProjectDetails';
import Projects from './pages/Projects';
import Calendar from './pages/Calendar';

import LandingPage from './pages/LandingPage';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import AdminBlogs from './pages/AdminBlogs';
import BlogEditor from './pages/BlogEditor';
import PublicProperties from './pages/PublicProperties';
import PublicPropertyDetail from './pages/PublicPropertyDetail';
import BecomeOwner from './pages/BecomeOwner';
import SearchResults from './pages/SearchResults';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                {children}
            </div>
        </div>
    );
};

function App() {
    const { isAuthenticated, checkAuth, isLoading, isAuthChecking } = useStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isAuthChecking) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/properties" element={<PublicProperties />} />
            <Route path="/properties/:id" element={<PublicPropertyDetail />} />
            <Route path="/become-an-owner" element={<BecomeOwner />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
            <Route path="/calendar" element={isAuthenticated ? <Layout><Calendar /></Layout> : <Navigate to="/login" />} />
            <Route path="/admin/properties" element={isAuthenticated ? <Layout><Properties /></Layout> : <Navigate to="/login" />} />
            <Route path="/projects" element={isAuthenticated ? <Layout><Projects /></Layout> : <Navigate to="/login" />} />
            <Route path="/projects/:id" element={isAuthenticated ? <Layout><ProjectDetails /></Layout> : <Navigate to="/login" />} />
            <Route path="/leads" element={isAuthenticated ? <Layout><Leads /></Layout> : <Navigate to="/login" />} />
            <Route path="/accounts" element={isAuthenticated ? <Layout><Accounts /></Layout> : <Navigate to="/login" />} />
            <Route path="/users" element={isAuthenticated ? <Layout><UsersPage /></Layout> : <Navigate to="/login" />} />
            <Route path="/settings" element={isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to="/login" />} />
            <Route path="/admin/blogs" element={isAuthenticated ? <Layout><AdminBlogs /></Layout> : <Navigate to="/login" />} />
            <Route path="/admin/blogs/new" element={isAuthenticated ? <BlogEditor /> : <Navigate to="/login" />} />
            <Route path="/admin/blogs/:id" element={isAuthenticated ? <BlogEditor /> : <Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
