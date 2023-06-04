import { Route, Link, Routes } from 'react-router-dom';
import { CreateAuthenticatedRoute } from './components/AuthenticatedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Col, Dropdown, Button } from 'react-bootstrap';
import { Splash } from './pages/Splash';
import { Home } from './pages/Dashboard';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
import NewGroupModal from './components/NewGroupModal';
import { Group, useGroupState } from './contexts/GroupContext'; // <-- Add this line

function App() {
    // You can use the group state here
    const { group, groups, isLoading, updateGroup } = useGroupState();
    function handleDropdownItemClick(group: Group): void {
        console.log("New group selected: " + group.name);
        updateGroup(group);
    }

    return (
        <div className="d-flex flex-column vh-100">
            <Navbar bg="primary" expand="lg" variant="dark" className="mb-3">
                <Col xs={3}>
                    <Navbar.Brand as={Link} to="/dashboard">Home</Navbar.Brand>
                </Col>
                <Col xs={8} className="d-flex justify-content-center align-items-center">
                    <Dropdown className="mx-2">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {group.name || 'Current Group'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {isLoading ? (
                                <Dropdown.Item disabled>Loading...</Dropdown.Item>
                            ) : (
                                groups.map((group, index) => (
                                    <Dropdown.Item key={"glist-" + index} onClick={() => handleDropdownItemClick(group)}>{group.name}</Dropdown.Item>
                                ))
                            )}
                        </Dropdown.Menu>

                    </Dropdown>
                    <NewGroupModal />
                </Col>

                <Col xs={1} className="text-right">
                    <Button variant="outline-light">Profile</Button>
                </Col>
            </Navbar>
            <Container fluid className="flex-grow-1">
                <Routes>
                    <Route path="/splash" element={<Splash />} />
                    <Route {...CreateAuthenticatedRoute({ path: "/dashboard", element: <Home />, loggedInDestination: "/dashboard", notLoggedInDestination: "/login" })} />
                    <Route {...CreateAuthenticatedRoute({ path: "/signup", element: <SignUp />, loggedInDestination: "/dashboard", notLoggedInDestination: "/signup" })} />
                    <Route {...CreateAuthenticatedRoute({ path: "/login", element: <Login />, loggedInDestination: "/dashboard", notLoggedInDestination: "/login" })} />
                    <Route {...CreateAuthenticatedRoute({ path: "/anotherprivatepage", element: <h1>Another Private Page</h1>, loggedInDestination: "/anotherprivatepage", notLoggedInDestination: "/login" })} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
