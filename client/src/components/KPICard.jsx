import clsx from 'clsx';

const KPICard = ({ title, value, icon: Icon, trend, color = "blue" }) => {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        red: "bg-red-50 text-red-600",
        purple: "bg-purple-50 text-purple-600",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={clsx("p-3 rounded-xl", colorStyles[color])}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={clsx("font-medium", trend >= 0 ? "text-green-600" : "text-red-600")}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </span>
                    <span className="text-slate-400 ml-2">from last month</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
