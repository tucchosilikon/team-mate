import { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import useStore from '../store/useStore';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const Calendar = () => {
    const { projects, fetchProjects, properties, fetchProperties } = useStore();
    const [selectedPropertyId, setSelectedPropertyId] = useState('ALL');

    useEffect(() => {
        fetchProjects();
        fetchProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const events = useMemo(() => {
        return projects
            .filter(project => {
                if (selectedPropertyId === 'ALL') return true;
                return project.propertyId === selectedPropertyId;
            })
            // Only show projects with valid dates? Yes.
            .filter(project => project.checkInDate && project.checkOutDate)
            .map(project => {
                const property = properties.find(p => p.id === project.propertyId);
                const propertyName = property ? property.name : 'Unknown Property';

                return {
                    id: project.id,
                    title: `${project.title} - ${propertyName}`, // Show title and property name
                    start: new Date(project.checkInDate),
                    end: new Date(project.checkOutDate),
                    allDay: true, // Assuming check-in/out implies full day block visually? Or time based?
                    // Usually check-in is afternoon, check-out is morning. 
                    // But for calendar view, full day blocks are easier to read usually.
                    // Or let's try to use times if available?
                    // Currently checkInDate is DateTime.
                    resource: project,
                    status: project.status
                };
            });
    }, [projects, selectedPropertyId, properties]);

    const eventStyleGetter = (event, start, end, isSelected) => {
        let backgroundColor = '#3174ad';
        if (event.status === 'COMPLETED') backgroundColor = '#10B981'; // Green
        else if (event.status === 'IN_PROGRESS') backgroundColor = '#3B82F6'; // Blue
        else if (event.status === 'TODO') backgroundColor = '#6B7280'; // Gray

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Calendar</h2>

                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-slate-600">Property:</label>
                    <select
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Properties</option>
                        {properties.map(property => (
                            <option key={property.id} value={property.id}>{property.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day', 'agenda']}
                    defaultView='month'
                    tooltipAccessor={event => `${event.title} (${event.status})`}
                />
            </div>
        </div>
    );
};

export default Calendar;
