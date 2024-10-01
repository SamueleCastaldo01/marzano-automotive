// LoginUser.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Typography } from "@mui/material";
import { db } from "../firebase-config"; // Assicurati di avere il percorso corretto
import { collection, query, where, getDocs } from "firebase/firestore";

export function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Query per cercare l'utente nel customersTab
      const usersRef = collection(db, "customersTab");
      const q = query(
        usersRef,
        where("username", "==", username),
        where("password", "==", password)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("Credenziali non valide. Riprova.");
      } else {
        setMessage("Login effettuato con successo!");
        // Puoi anche salvare lo stato dell'utente qui se necessario
      }
    } catch (error) {
      console.error("Errore durante il login: ", error);
      setMessage("Si è verificato un errore. Riprova.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center px-5">
        <h1>Marzano Automotive</h1>
        <h2 className="mt-5">Accedi</h2>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </form>
      {message && <Typography variant="body1">{message}</Typography>}
      </div>
      </motion.div>
    </>
  );
}
