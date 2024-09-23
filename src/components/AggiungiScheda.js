import React, { useEffect, useState } from "react";
import { db } from "../firebase-config"; // Assicurati di avere il tuo firebase-config
import { collection, query, where, getDocs } from "firebase/firestore";
import { Button, Typography } from "@mui/material";

const AggiungiScheda = ({ targa, nomeModello, idCustomer, onBack }) => {
  const [telefono, setTelefono] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchCustomerData = async () => {
      const q = query(collection(db, "customers"), where("id", "==", idCustomer));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const customerData = querySnapshot.docs[0].data();
        setTelefono(customerData.telefono || "");
        setUsername(customerData.username || "");
      }
    };

    fetchCustomerData();
  }, [idCustomer]);

  const handleSaveScheda = () => {
    // Logica per salvare la scheda
    console.log("Scheda salvata", { targa, nomeModello, telefono, username });
    // Implementa la logica per salvare i dati nel database
  };

  return (
    <div>
      <Typography variant="h4">Aggiungi Scheda</Typography>
      <Typography>Targa: {targa}</Typography>
      <Typography>Nome Modello: {nomeModello}</Typography>
      <Typography>Telefono: {telefono}</Typography>
      <Typography>Username: {username}</Typography>
      <Button variant="contained" onClick={handleSaveScheda}>
        Salva Scheda
      </Button>
      <Button variant="outlined" onClick={onBack}>
        Torna indietro
      </Button>
    </div>
  );
};

export default AggiungiScheda;
