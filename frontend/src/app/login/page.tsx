"use client";

import "./login.css";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { APIConstants } from "../api.constants";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const encryptCBCFixedIV = (message) => {
    const key = CryptoJS.enc.Utf8.parse("AAAAAAAAAAAAAAAA");
    const iv = CryptoJS.enc.Utf8.parse("BBBBBBBBBBBBBBBB");
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      iv,
      mode: CryptoJS.mode.CBC,
    });
    return encrypted.toString();
  };

  const handleLogin = async () => {
    try {
      console.log(encryptCBCFixedIV(password));
      const payload = { email: email, password: encryptCBCFixedIV(password) };

      const response = await axios.post(APIConstants.LOGIN, payload, {
        headers: { "Content-Type": "application/json" },
      });

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
