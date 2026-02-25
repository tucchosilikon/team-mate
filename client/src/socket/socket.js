import io from 'socket.io-client';
import useStore from '../store/useStore';

const socketUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001';

export const socket = io(socketUrl, {
    autoConnect: false,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();

        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('project:created', (project) => {
            useStore.getState().addProject(project);
        });

        socket.on('project:updated', (project) => {
            useStore.getState().updateProjectInStore(project);
        });

        socket.on('project:statusChanged', (project) => {
            useStore.getState().updateProjectInStore(project);
        });
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
