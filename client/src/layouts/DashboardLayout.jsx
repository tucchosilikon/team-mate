import { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import useStore from '../store/useStore';
import { connectSocket, disconnectSocket } from '../socket/socket';

const DashboardLayout = () => {
    const { isAuthenticated, checkAuth, isLoading } = useStore();

    console.log('🏠 DashboardLayout render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

    useEffect(() => {
        console.log('🏠 DashboardLayout useEffect - calling checkAuth');
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated && !localStorage.getItem('token')) {
        return <Navigate to="/login" />;
    }

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-slate-50">Loading...</div>;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar />
            <div className="flex-1 ml-64 p-8 overflow-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                        <p className="text-slate-500">Welcome back, Team</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            TM
                        </div>
                    </div>
                </header>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
