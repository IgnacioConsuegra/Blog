import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("https://deploy-umyx.onrender.com/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if(response.status === 201){
      alert("Registration successful");
    }else{
      alert("Registration failed");
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        className="input"
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        className="input"
        onChange={ev => setPassword(ev.target.value)}
      />
      <button className="btn">Register</button>
    </form>
  );
}
