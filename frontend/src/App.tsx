import { Route, Link, Routes } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { CreateAuthenticatedRoute } from "./components/AuthenticatedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Col, Dropdown } from "react-bootstrap";
import { Splash } from "./pages/Splash";
import { Home } from "./pages/Dashboard";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import NewGroupModal from "./components/NewGroupModal";
import { Group, useGroupState } from "./contexts/GroupContext"; // <-- Add this line
import LinkButton from "./components/LinkButton";
import { useAuthState } from "./contexts/AuthContext";
import { FaUserCircle } from "react-icons/fa";

function App() {
  const { group, groups, isLoading, updateGroup } = useGroupState();
  const { user } = useAuthState();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // navigation after logout if necessary
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  function handleDropdownItemClick(group: Group): void {
    console.log("New group selected: " + group.name);
    updateGroup(group);
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar bg="primary" expand="lg" variant="dark" className="mb-3">
        <Col xs={3}>
          <Navbar.Brand as={Link} to="/">
            Home
          </Navbar.Brand>
        </Col>
        {user ? (
          <Col
            xs={8}
            className="d-flex justify-content-center align-items-center"
          >
            <Dropdown className="mx-2">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {group.name || "Current Group"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {isLoading ? (
                  <Dropdown.Item disabled>Loading...</Dropdown.Item>
                ) : (
                  groups.map((group, index) => (
                    <Dropdown.Item
                      key={"glist-" + index}
                      onClick={() => handleDropdownItemClick(group)}
                    >
                      {group.name}
                    </Dropdown.Item>
                  ))
                )}
              </Dropdown.Menu>
            </Dropdown>
            <NewGroupModal />
          </Col>
        ) : (
          <Col
            xs={8}
            className="d-flex justify-content-center align-items-center"
          >
            {/* Render your space-filling box or any other desired content here */}
          </Col>
        )}

        <Col xs={1} className="text-right">
          {!user ? (
            <>
              <LinkButton to="/login" variant="outline-light">
                Login
              </LinkButton>
              <LinkButton to="/signup" variant="outline-light">
                SignUp
              </LinkButton>
            </>
          ) : (
            <Dropdown>
              <Dropdown.Toggle variant="outline-light">
                <FaUserCircle />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Col>
      </Navbar>
      <Container fluid className="flex-grow-1">
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route
            {...CreateAuthenticatedRoute({
              path: "/dashboard",
              element: <Home />,
              loggedInDestination: "/dashboard",
              notLoggedInDestination: "/login",
            })}
          />
          <Route
            {...CreateAuthenticatedRoute({
              path: "/signup",
              element: <SignUp />,
              loggedInDestination: "/dashboard",
              notLoggedInDestination: "/signup",
            })}
          />
          <Route
            {...CreateAuthenticatedRoute({
              path: "/login",
              element: <Login />,
              loggedInDestination: "/dashboard",
              notLoggedInDestination: "/login",
            })}
          />
          <Route
            {...CreateAuthenticatedRoute({
              path: "/anotherprivatepage",
              element: <h1>Another Private Page</h1>,
              loggedInDestination: "/anotherprivatepage",
              notLoggedInDestination: "/login",
            })}
          />
          {/* A route for the home page. If the user is logged in, auto redirect to the dashboard. If not, show the splash page */}
          <Route path="/" element={<Splash />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
