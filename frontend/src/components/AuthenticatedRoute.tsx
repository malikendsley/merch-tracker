import { ReactElement } from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from "../contexts/AuthContext";

interface AuthenticatedRouteProps {
    element: ReactElement;
    path: string;
    loggedInDestination: string;
    notLoggedInDestination: string;
}

export const CreateAuthenticatedRoute = ({
    element,
    path,
    loggedInDestination,
    notLoggedInDestination,
}: AuthenticatedRouteProps) => {
    const location = useLocation();
    const { isAuthenticated, loading } = useAuthState();

    if (loading) {
        return { path, element: <h1>Loading...</h1> };
    }

    if (isAuthenticated && location.pathname !== loggedInDestination) {
        return { path, element: <Navigate to={loggedInDestination} replace state={{ from: location }} /> };
    }

    if (!isAuthenticated && location.pathname !== notLoggedInDestination) {
        return { path, element: <Navigate to={notLoggedInDestination} replace state={{ from: location }} /> };
    }

    return { path, element };
};
