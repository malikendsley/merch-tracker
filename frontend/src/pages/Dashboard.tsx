import { getAuth, signOut } from "firebase/auth";
import { useAuthState } from "../contexts/AuthContext";
import { Tab, Nav, Button } from "react-bootstrap";
import { authedFetch } from "../utility/AuthedFetch";
import MerchandiseTab from "../components/MerchandiseTab";

export const Home = () => {
  const { user } = useAuthState();

  const authenticatedGet = async () => {
    console.log("Clicked Authenticated Get");
    try {
      const response = await authedFetch("/api/test-protected");

      if (response.ok) {
        console.log(response);
      } else {
        console.error("Failed to fetch protected data");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Tab.Container id="left-tabs" defaultActiveKey="first">
      <div className="row">
        <div className="col-3">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">Events</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Merchandise</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">Tab 3</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div className="col-9">
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <h1> Welcome {user?.email} </h1>
              <Button onClick={() => signOut(getAuth())}>Sign Out</Button>
              <Button onClick={authenticatedGet}>Authenticated Get</Button>
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <MerchandiseTab />
            </Tab.Pane>
            <Tab.Pane eventKey="third">
              {/* Add the content for the third tab here */}
            </Tab.Pane>
          </Tab.Content>
        </div>
      </div>
    </Tab.Container>
  );
};
