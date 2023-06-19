import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import CreateMerchModal from "./NewMerchTypeModal";

const MyComponent: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <Card className="mb-4">
            <Card.Header>Create Merchandise Type</Card.Header>
            <Card.Body>
              <CreateMerchModal />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyComponent;
