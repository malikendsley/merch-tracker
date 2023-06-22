import React, { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Form, Col, Row, Modal } from "react-bootstrap";
import { authedFetch } from "../utility/AuthedFetch";
import { useGroupState } from "../contexts/GroupContext";

interface FormValues {
  name: string;
  description: string;
  image: FileList;
  requiredAttrs: { name: string; type: string; catList?: string[] }[];
}

const CreateMerchModal: React.FC = () => {
  const [selectedAttrIndex, setSelectedAttrIndex] = useState<number | null>(
    null
  );
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [attrTypes, setAttrTypes] = useState<(string | null)[]>([]);
  // state for managing the image separately
  const [image, setImage] = useState<FileList | null>(null);
  const { register, handleSubmit, control, reset, setValue, getValues } =
    useForm<FormValues>({
      defaultValues: {
        name: "",
        description: "",
        image: undefined,
        requiredAttrs: [{ name: "", type: "", catList: [] }],
      },
    });

  const closeCategoriesModal = () => {
    setSelectedAttrIndex(null);
    setShowCategoriesModal(false);
  };

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "requiredAttrs",
  });

  const {
    group: { gid },
  } = useGroupState();
  const [showModal, setShowModal] = useState(false);

  // handleChange function for the image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files ?? null);
  };
  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        console.log(data);
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);

        // in your onSubmit, append the image manually to formData
        if (image && image.length > 0) {
          formData.append("image", image[0]);
        }
        formData.append("requiredAttrs", JSON.stringify(data.requiredAttrs));

        const response = await authedFetch(`/api/merch/types/${gid}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          alert("Failed to create merch type");
        } else {
          reset();
          setShowModal(false);
        }
      } catch (error) {
        console.error(error);
      }
    },
    [gid, image, reset]
  );

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          reset();
          setShowModal(true);
        }}
      >
        Create New Merch Type
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Merchandise Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
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
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>

            {fields.map((item, index) => (
              <Row key={item.id} className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Attribute Name</Form.Label>
                    <Form.Control
                      {...register(`requiredAttrs.${index}.name` as const)}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Attribute Type</Form.Label>
                    <Form.Select
                      {...register(`requiredAttrs.${index}.type` as const)}
                      onChange={(e) => {
                        // Update the attribute type state
                        setAttrTypes((prevAttrTypes) => {
                          const newAttrTypes = [...prevAttrTypes];
                          newAttrTypes[index] = e.target.value;
                          return newAttrTypes;
                        });

                        if (e.target.value === "categorical") {
                          setSelectedAttrIndex(index);
                        } else {
                          console.log("Non categorical attribute type");
                          setSelectedAttrIndex(null);
                          setValue(`requiredAttrs.${index}.catList`, []);
                          setTempCategories([]);
                          console.log("Type is now " + attrTypes[index]);
                        }
                      }}
                    >
                      <option value="">Select attribute type...</option>
                      <option value="categorical">Categorical</option>
                      <option value="numerical">Numerical</option>
                      <option value="string">String</option>
                    </Form.Select>
                  </Form.Group>
                  {
                    // If the attribute type is categorical and there are categories, display them
                    fields[index].type === "categorical" &&
                      fields[index].catList && (
                        <ul>
                          {fields[index].catList?.map((category, index) => (
                            <li key={index}>{category}</li>
                          ))}
                        </ul>
                      )
                  }
                  {attrTypes[index] === "categorical" && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        // Set the temporary categories state
                        setTempCategories(fields[index].catList ?? []);
                        setSelectedAttrIndex(index);
                        setShowCategoriesModal(true);
                      }}
                    >
                      Add Categories
                    </Button>
                  )}
                </Col>
                <Col className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => {
                      remove(index);
                      // Also remove the corresponding entry in attrTypes
                      setAttrTypes((prevAttrTypes) =>
                        prevAttrTypes.filter(
                          (_, attrIndex) => attrIndex !== index
                        )
                      );
                      console.log("Removed attribute at index", index);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}

            <Button
              onClick={() => append({ name: "", type: "" })}
              className="mb-3"
            >
              Add Attribute
            </Button>
            <Modal
              show={showCategoriesModal}
              onHide={() => setShowCategoriesModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Enter Categories</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* temp categories are the current categories being edited */}
                {tempCategories.map((category, index) => (
                  <Form.Group className="mb-3" key={index}>
                    <Form.Label>Category {index + 1}</Form.Label>
                    <Form.Control
                      value={category}
                      onChange={(event) => {
                        const updatedCategory = event.target.value;
                        setTempCategories((oldCategories) => {
                          const newCategories = [...oldCategories];
                          newCategories[index] = updatedCategory;
                          return newCategories;
                        });
                      }}
                    />
                  </Form.Group>
                ))}
                <Button
                  onClick={() =>
                    // add a blank category to the end of the list
                    setTempCategories((oldCategories) => [...oldCategories, ""])
                  }
                >
                  Add Category
                </Button>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={closeCategoriesModal}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (selectedAttrIndex !== null) {
                      const formValues = getValues();

                      formValues.requiredAttrs[selectedAttrIndex].catList = [
                        ...tempCategories,
                      ];

                      formValues.requiredAttrs[selectedAttrIndex].type =
                        "categorical";

                      // Reset the form with the updated values but exclude image
                      reset({ ...formValues, image: undefined });

                      // Update image separately
                      setImage(image);
                    }

                    closeCategoriesModal();
                  }}
                >
                  Save Categories
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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
