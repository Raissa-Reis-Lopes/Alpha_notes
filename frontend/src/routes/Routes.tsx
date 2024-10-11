import { Routes, Route } from 'react-router-dom';
import Login from '../views/Login';
import Home from '../views/Home';
import Register from '../views/Register';
import ProtectedRoute from '../components/ProtectedRoutes';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
                path="/home" 
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } 
            />
        </Routes>
    );
};

export default AppRoutes;
