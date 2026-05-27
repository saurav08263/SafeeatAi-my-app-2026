"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { initFirebase } from "@/lib/firebase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async (e: any) => {
    e.preventDefault();

    try {
      const { auth } = await initFirebase();

      if (!auth) {
        alert("Firebase not initialized");
        return;
      }

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      console.log(userCredential.user);

      alert("Signup Success");

      window.location.href = "/";

    } catch (error: any) {
      console.log(error);

      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Signup</h1>

      <form onSubmit={signup}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Signup
        </button>

      </form>
    </div>
  );
}