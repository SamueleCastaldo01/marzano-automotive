import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import Button from '@mui/material/Button';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Assicurati che il percorso del db sia corretto
import { useNavigate } from "react-router-dom";

export function UserHome() {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ottieni l'username dal Redux store
  const username = useSelector((state) => state.userAuth.userDetails?.username);

  useEffect(() => {
    const fetchNomeCognome = async () => {
      try {
        if (!username) {
          throw new Error("Username non trovato!");
        }

        // Query per ottenere il nome e cognome dalla tabella customersTab
        const customersRef = collection(db, "customersTab");
        const customerQuery = query(customersRef, where("username", "==", username));
        const customerSnapshot = await getDocs(customerQuery);

        if (customerSnapshot.empty) {
          throw new Error("Nessun cliente trovato con questo username.");
        }

        // Prendi il primo documento (perché lo username è univoco)
        const customerData = customerSnapshot.docs[0].data();
        setNome(customerData.nome || "");
        setCognome(customerData.cognome || "");

      } catch (err) {
        console.error("Errore durante il recupero del nome e cognome:", err);
        setError(err.message);
      }
    };

    fetchNomeCognome();
  }, [username]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <div style={{backgroundColor: "#224072"}} className=" position-absolute top-0 w-100 p-3 text-start">
            <h2 className="mb-0">Marzano Automotive</h2>
        </div>
        
        <div style={{marginTop: "110px"}}>
        <h2>Benvenuto {nome} {cognome}</h2>

        <div className="mt-5 d-flex flex-column gap-5 px-5 align-content-center">
        <Button style={{height: "150px"}} variant="contained" onClick={() => {navigate("/userveicoli")}}>I Tuoi Veicoli</Button>
        <Button style={{height: "150px"}} variant="contained" onClick={() => {navigate("/userschededilavoro")}}>Le tue schede di lavoro</Button>
        <Button style={{height: "150px"}} variant="contained" onClick={() => {navigate("/userhome")}}>Il tuo profilo</Button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

      </motion.div>
    </>
  );
}
