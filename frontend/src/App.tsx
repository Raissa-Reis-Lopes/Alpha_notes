import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/Routes';
import { NotesProvider } from './contexts/NotesContext';
import { WebSocketProvider } from './contexts/WebSocketContext';

const App: React.FC = () => {
    return (
        <WebSocketProvider>
            <UserProvider>
                <NotesProvider>
                    <Router>
                        <AppRoutes />
                    </Router>
                </NotesProvider>
            </UserProvider>
        </WebSocketProvider>
    );
};

export default App;
