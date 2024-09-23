import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { db } from "../firebase-config"; // Assicurati di avere il tuo firebase-config
import { collection, query, where, getDocs } from "firebase/firestore";
import { successNoty, errorNoty } from "../components/Notify";

export function AddSchede() {
  const [targa, setTarga] = useState("");
  const [veicoloTrovato, setVeicoloTrovato] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  const [loading, setLoading] = useState(false); // Stato per il caricamento

  const handleCercaVeicolo = async () => {
    setLoading(true); // Avvia il caricamento
    const q = query(
      collection(db, "veicoloTab"),
      where("targa", "==", targa.toUpperCase())
    );
    const querySnapshot = await getDocs(q);
    setLoading(false); // Termina il caricamento

    if (querySnapshot.empty) {
      setVeicoloTrovato(false);
      setMessaggio("Veicolo non trovato");
      errorNoty("Veicolo non trovato");
    } else {
      setVeicoloTrovato(true);
      setMessaggio("Veicolo trovato");
      successNoty("Veicolo trovato");
    }
  };

  // Effetto per gestire la cancellazione del pulsante se la targa cambia
  useEffect(() => {
    setVeicoloTrovato(false);
  }, [targa]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container-fluid">
        <h2>Aggiungi Scheda di Lavoro</h2>
        <div className="mt-4 d-flex">
          <TextField
            label="Targa"
            variant="outlined"
            value={targa.toUpperCase()} // Mostra sempre in maiuscolo
            onChange={(e) => setTarga(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button
            className="me-2"
            variant="contained"
            color="primary"
            onClick={handleCercaVeicolo}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Cerca"}
          </Button>
          {veicoloTrovato && (
            <Button
              variant="contained"
              color="success"
              style={{ backgroundColor: "#07BC0C" }}
            >
              Crea Scheda
            </Button>
          )}
        </div>
        {veicoloTrovato && (
          <Typography style={{ marginTop: "10px", color: "#07BC0C" }}>
            {messaggio}
          </Typography>
        )}
        {!veicoloTrovato && (
          <Typography color="error" style={{ marginTop: "10px" }}>
            {messaggio}
          </Typography>
        )}
      </div>
    </motion.div>
  );
}
