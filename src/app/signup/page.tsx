"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { initFirebase } from "@/lib/firebase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const { auth } = await initFirebase();

      if (!auth) {
        alert("Firebase not initialized");
        return;
      }

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Signup Success");

    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Signup</h1>

      <input
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

      <button onClick={signup}>
        Signup
      </button>
    </div>
  );
}