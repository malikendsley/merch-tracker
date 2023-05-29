import { ReactElement } from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from "../firebase/firebase";

interface AuthenticatedRouteProps {
  element: ReactElement;
  path: string;
}



export const CreateAuthenticatedRoute = ({ element, path }: AuthenticatedRouteProps): { element: ReactElement; path: string } => {
    const location = useLocation();
    const { isAuthenticated } = useAuthState();
    return isAuthenticated ? { path, element } : { path, element: <Navigate to="/login" replace state={{ from: location }} /> };
}