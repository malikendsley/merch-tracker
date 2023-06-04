import { useCallback, useContext } from "react";
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/firebase";
import { getAuth, signInWithCustomToken } from "firebase/auth";

export const SignUp = () => {
    const navigate = useNavigate();
    const { setError } = useContext(AuthContext);

    const handleSubmit = useCallback(async (e: any) => {
        e.preventDefault();
        const { email, password, username } = e.target.elements;

        // Create the request body
        const requestBody = {
            email: email.value,
            password: password.value,
            username: username.value,
        };

        // Send the POST request to the endpoint
        try {
            const response = await fetch("/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error("Failed to sign up");
            }

            const data = await response.json();
            console.log(data);

            // sign the user in with the custom token
            await signInWithCustomToken(getAuth(), data.token);
            // Redirect to the dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            setError("Failed to sign up");
        }
    }, [navigate, setError]);

    return (
        <>
            <h1>Sign Up</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" />
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Sign Up
                </Button>
            </Form>
        </>
    );
};
