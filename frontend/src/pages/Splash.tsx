import { useNavigate } from 'react-router-dom';
import { useAuthState } from "../contexts/AuthContext";
import { useEffect } from 'react';

export const Splash = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuthState();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || isAuthenticated) {
        return null;
    }

    return (
        <div>
            <h1>Splash Page</h1>
        </div>
    )
}
