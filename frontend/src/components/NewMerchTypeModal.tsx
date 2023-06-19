import React, { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Form, Col, Row, Modal } from "react-bootstrap";
import { authedFetch } from "../utility/AuthedFetch";
import { useGroupState } from "../contexts/GroupContext";

const CreateMerchModal: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      description: "",
      image: null,
      requiredAttrs: [{ attrName: "", attrType: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "requiredAttrs",
  });

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    reset();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const { group } = useGroupState();
  const gid = group.gid;

  const onSubmit = useCallback(
    async (data: {
      name: string | Blob;
      description: string | Blob;
      image: any;
      requiredAttrs: any;
    }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      const images = data.image;
      if (images && images.length > 0) {
        formData.append("image", images[0]);
      }
      //append the required attributes, but only the attrName and attrType. Fit this schema:
      //requiredAttrs: [{attrName: "size", attrType: "string"}, {attrName: "color", attrType: "string"}]
      // etc.
      for (const attr of data.requiredAttrs) {
        formData.append("requiredAttrs", JSON.stringify(attr));
      }
      console.log(data);
      try {
        // Display the key/value pairs
        const response = await authedFetch(`/api/merch/types/${gid}`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          console.log(response);
          handleCloseModal(); // close the modal after a successful submission
        } else {
          console.error("Failed to create merch type");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    },
    [gid]
  );
  return (
    <>
      <Button variant="primary" onClick={handleOpenModal}>
        Create New Merch Type
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Merchandise Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control {...register("name")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control {...register("description")} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" {...register("image")} />
            </Form.Group>

            {fields.map((item, index) => (
              <Row key={item.id} className="mb-3">
                <Col>
                  <Form.Label>Attribute Name</Form.Label>
                  <Form.Control
                    {...register(`requiredAttrs.${index}.attrName`)}
                  />
                </Col>
                <Col>
                  <Form.Label>Attribute Type</Form.Label>
                  <Form.Select {...register(`requiredAttrs.${index}.attrType`)}>
                    <option value="">Select attribute type...</option>
                    <option value="categorical">Categorical</option>
                    <option value="numerical">Numerical</option>
                    <option value="string">String</option>
                  </Form.Select>
                </Col>
                <Col className="d-flex align-items-center">
                  <Button variant="danger" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              onClick={() => append({ attrName: "", attrType: "" })}
              className="mb-3"
            >
              Add Attribute
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Create Merch Type
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateMerchModal;
