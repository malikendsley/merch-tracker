//export a simple html test page
import { useCallback } from "react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"



export const SignUp = () => {
    const handleSubmit = useCallback(async (e: any) => {
        e.preventDefault()
        const { email, password } = e.target.elements
        const auth = getAuth()

        // sign up with email and password
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value)
        }
        catch (error) {
            alert(error)
        }
    }, [])

    return (
        <>
            <div>
                <h1>Sign Up</h1>
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