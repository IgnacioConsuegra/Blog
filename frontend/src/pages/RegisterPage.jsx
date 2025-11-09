import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 201) {
      alert("Registration successful");
      navigate("/login");
    } else {
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
