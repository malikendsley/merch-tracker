import { useCallback } from "react";

export const SignUp = () => {
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
      const response = await fetch("/api/register", {
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
      // Process the response data here, e.g., update the auth context or user context
    } catch (error) {
      console.error(error);
      alert("Failed to sign up");
    }
  }, []);

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
          <label>
            Username
            <input name="username" type="text" placeholder="Username" />
          </label>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </>
  );
};