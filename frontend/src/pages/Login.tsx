import { useCallback } from "react"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useLocation, useNavigate } from "react-router-dom"

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
            navigate(from)
        } catch (error) {
            alert(error)
        }
    }, [navigate, from])

    return (
        <>
            <div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input name="email" type="email" placeholder="Email" />
                    </label>
                    <label>
                        Password
                        <input name="password" type="password" placeholder="Password" />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    )
}
