// LoginUser.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Typography } from "@mui/material";
import { db } from "../firebase-config"; // Assicurati di avere il percorso corretto
import { collection, query, where, getDocs } from "firebase/firestore";
import { loginUser } from "../redux/reducers/userAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutU } from "../redux/reducers/authSlice";


export function LoginUser() {
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();


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
        const userData = querySnapshot.docs[0].data(); // Ottieni i dati dell'utente
        setMessage("Login effettuato con successo!");
        
        // Dispatch per impostare l'utente come autenticato
        dispatch(loginUser({ username: userData.username, ...userData })); // Puoi aggiungere altri dettagli se necessario
        dispatch(logoutU()); //in caso in cui sono loggato come supervisore, mi disconetto
        navigate("/userhome");
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
