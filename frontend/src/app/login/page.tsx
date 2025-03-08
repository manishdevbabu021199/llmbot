"use client";

import "./login.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
// import userAuthStore from "../_store/authStore";
import { APIConstants } from "../api.constants";
import { useRouter } from "next/navigation";
import { Helper } from "../_helper/helper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  //   const { setUser } = userAuthStore(); // Zustand state sette
  const router = useRouter();

  useEffect(() => {
    // const validateToken = async () => {
    //   const helper = new Helper();
    //   const data = await helper.funValidateToken();
    //   if (data) {
    //     router.push("/dashboard");
    //   }
    // };
    // validateToken();
  }, []);

  const handleLogin = async () => {
    try {
      const payload = { email: email, password: password }; // Custom payload format

      const response = await axios.post(APIConstants.LOGIN, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("response", response);
      // setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center login-page">
      <div className="flex flex-col gap-2 login-container">
        <h3 className="section-header">Login</h3>
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1">
            <label className="input-label">Email</label>
            <input
              className="input-box"
              type="email"
              placeholder="yourmail@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="input-label">Password</label>
            <input
              className="input-box"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="login-button" onClick={handleLogin}>
            <h3>Login</h3>
            <Image
              className="send-image"
              src="/assets/sidebar/Go.png"
              alt="Login"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
