import { getAuth, signOut } from "firebase/auth"
import { useAuthState } from "../firebase/firebase"

export const Home = () => {
    const { user } = useAuthState()

    const authenticatedGet = async () => {
        console.log("Clicked Authenticated Get")
        try {
            const token = await user.getIdToken();

            const response = await fetch('/api/test-protected', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log(response);
            } else {
                console.error('Failed to fetch protected data');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }

    return (
        <>
            <h1> Welcome {user?.email} </h1>
            <button onClick={() => signOut(getAuth())}>Sign Out</button>
            <button onClick={authenticatedGet}>Authenticated Get</button>
        </>
    )
}