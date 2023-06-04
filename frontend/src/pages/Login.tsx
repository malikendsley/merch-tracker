import { useCallback } from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Form, Button } from 'react-bootstrap';


export const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { from } = location.state || { from: { pathname: "/dashboard" } };

    const handleSubmit = useCallback(async (e: any) => {
        e.preventDefault()
        const { email, password } = e.target.elements
        const auth = getAuth()

        try {
            await signInWithEmailAndPassword(auth, email.value, password.value)
            console.log(auth);
            navigate(from)
        } catch (error) {
            alert(error)
        }
    }, [navigate, from])

    return (
        <>
          <h1 className="mt-4">Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Login
            </Button>
          </Form>
          <p className="mt-3">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </>
      );
    };
