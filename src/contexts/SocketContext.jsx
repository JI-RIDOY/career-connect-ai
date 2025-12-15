import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (user && !socket) {
            const socketInstance = io('http://localhost:5000', {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            // Register user
            socketInstance.emit('register-user', user.uid);

            setSocket(socketInstance);

            return () => {
                if (socketInstance) {
                    socketInstance.disconnect();
                }
            };
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};