import { Route, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useUser();

    return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
