import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { authedFetch } from '../utility/AuthedFetch';

const NewGroupModal = () => {
    const [show, setShow] = useState(false);
    const [group, setGroup] = useState({name: '', description: '', groupCode: ''});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        setGroup({...group, [event.target.name]: event.target.value});
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        
        try {
            const response = await authedFetch('/api/group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(group)
            });

            if (response.ok) {
                console.log('Group created successfully');
            } else {
                console.error('Failed to create group');
            }

            // Rerender the page
            // TODO: decide whether this is necessary
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
        
        handleClose();
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                + New Group
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter group name" name="name" onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="formGroupDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter group description" name="description" onChange={handleChange} />
                        </Form.Group>

                        <Form.Group controlId="formGroupCode">
                            <Form.Label>Group Code</Form.Label>
                            <Form.Control type="text" placeholder="Enter group code" name="groupCode" onChange={handleChange} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default NewGroupModal;