import { Route, Link, Routes } from 'react-router-dom';
import { CreateAuthenticatedRoute } from './components/AuthenticatedRoute';

import { Splash } from './pages/Splash';
import { Home } from './pages/Dashboard';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';

function Nav() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/splash">Splash(Public)</Link>
                </li>
                <li>
                    <Link to="/dashboard">Dashboard(Private)</Link>
                </li>
                <li>
                    <Link to="/login">Login(Public)</Link>
                </li>
                <li>
                    <Link to="/signup">Sign Up(Public)</Link>
                </li>
                <li>
                    <Link to="/anotherprivatepage">Another Private Page(Private)</Link>
                </li>
            </ul>
        </nav>
    );
}

export default function App() {

    return (
        <>
            <Nav />

            <Routes>
                <Route path="/splash" element={<Splash />} />
                <Route {...CreateAuthenticatedRoute({ path: "/dashboard", element: <Home />, loggedInDestination: "/dashboard", notLoggedInDestination: "/login" })} />
                <Route {...CreateAuthenticatedRoute({ path: "/signup", element: <SignUp />, loggedInDestination: "/dashboard", notLoggedInDestination: "/signup" })} />
                <Route {...CreateAuthenticatedRoute({ path: "/login", element: <Login />, loggedInDestination: "/dashboard", notLoggedInDestination: "/login" })} />
                <Route {...CreateAuthenticatedRoute({ path: "/anotherprivatepage", element: <h1>Another Private Page</h1>, loggedInDestination: "/anotherprivatepage", notLoggedInDestination: "/login" })} />
            </Routes>
        </>
    )
}