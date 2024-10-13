import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/Routes';
import { NotesProvider } from './contexts/NotesContext';

const App: React.FC = () => {
    return (
        <UserProvider>
            <NotesProvider>
                <Router>
                    <AppRoutes />
                </Router>
            </NotesProvider>
        </UserProvider>
    );
};

export default App;
