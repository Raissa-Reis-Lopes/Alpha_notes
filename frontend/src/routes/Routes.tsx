import { Routes, Route } from 'react-router-dom';
import Login from '../views/Login';
import Dashboard from '../views/Dashboard';
import Register from '../views/Register';
import Home from '../views/Home';
import ProtectedRoute from '../components/ProtectedRoutes';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} /> 
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
