import React from "react";
import { Row, Col, Card, Stack } from "react-bootstrap";
import CreateMerchModal from "./NewMerchTypeModal";
import AllMerchGrid from "./AllMerchGrid";

const MerchandiseTab: React.FC = () => {
  //click handler for MerchGrid items
  const handleClick = (id: string) => {
    console.log("Clicked merch item with id: " + id);
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs={12} md={8}>
        <Stack gap={3}>
          <Card className="mb-4">
            <Card.Header>Create Merchandise Type</Card.Header>
            <Card.Body>
              <CreateMerchModal />
            </Card.Body>
          </Card>
          <AllMerchGrid handleClick={handleClick} />
        </Stack>
      </Col>
    </Row>
  );
};

export default MerchandiseTab;
