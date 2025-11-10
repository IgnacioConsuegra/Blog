import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"
import { BASE_URL } from "../Utils/base_Url";
export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 201) {
      toast.success("Registration successful");
      navigate("/login");
    } else {
      toast.error("Registration failed");
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
