import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import KPICard from '../components/KPICard';
import { Home, CheckSquare, DollarSign, Users } from 'lucide-react';

const Dashboard = () => {
    const { fetchDashboardStats, dashboardStats, user } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (!dashboardStats) return <div className="p-6">Loading dashboard...</div>;

    const { activeProperties, revenue, activeLeads, pendingProjects: pendingProjectsCount, highPriorityPending, urgentProjects, upcomingInProgressProjects } = dashboardStats;
    const occupancy = 0; // Placeholder until implemented

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            {user?.role === 'ADMIN' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard
                        title="Active Properties"
                        value={activeProperties}
                        icon={Home}
                        color="blue"
                    />
                    <KPICard
                        title="Total Revenue"
                        value={`$${revenue.toLocaleString()}`}
                        icon={DollarSign}
                        color="green"
                    />
                    <KPICard
                        title="Pending Projects"
                        value={pendingProjectsCount}
                        icon={CheckSquare}
                        color="purple"
                    />
                    <KPICard
                        title="Active Leads"
                        value={activeLeads}
                        icon={Users}
                        color="red"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Urgent Attention</h3>

                    {urgentProjects && urgentProjects.length > 0 ? (
                        <div className="space-y-3">
                            {urgentProjects.map(project => (
                                <div key={project.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(project.priority)}`}>
                                            {project.priority}
                                        </span>
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="font-medium text-slate-700 hover:text-blue-600 hover:underline"
                                        >
                                            {project.title}
                                        </Link>
                                    </div>
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="text-sm text-red-600 font-medium hover:text-red-800 underline"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">No high priority projects pending.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-600">Occupancy (Est.)</span>
                            <span className="font-medium">{occupancy}%</span>
                        </div>
                    </div>

                    <h4 className="text-md font-semibold text-slate-800 mt-6 mb-3">Upcoming In-Progress</h4>
                    {upcomingInProgressProjects && upcomingInProgressProjects.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingInProgressProjects.map(project => (
                                <div key={project.id} className="flex flex-col p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="flex justify-between items-start">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="font-medium text-slate-700 hover:text-blue-600 hover:underline truncate pr-2"
                                        >
                                            {project.title}
                                        </Link>
                                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                            {new Date(project.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {project.property?.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm italic">No upcoming in-progress projects.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
