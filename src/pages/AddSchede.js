import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Assicurati di avere il tuo firebase-config
import { successNoty, errorNoty } from "../components/Notify";
import TargaInput from "../components/TargaInput"; // Importa il nuovo componente

export function AddSchede() {
  const [targa, setTarga] = useState("");
  const [veicoloTrovato, setVeicoloTrovato] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  const [loading, setLoading] = useState(false); // Stato per il caricamento
  const [recentTarghe, setRecentTarghe] = useState([]); // Ultime targhe cercate

  useEffect(() => {
    // Recupera le ultime 10 targhe dal localStorage
    const storedTarghe = JSON.parse(localStorage.getItem("recentTarghe")) || [];
    setRecentTarghe(storedTarghe);
  }, []);

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

      // Aggiungi la targa valida alle recenti
      saveRecentTarga(targa.toUpperCase());
    }
  };

  const saveRecentTarga = (targa) => {
    const storedTarghe = JSON.parse(localStorage.getItem("recentTarghe")) || [];
    
    // Controlla se la targa è già presente
    if (!storedTarghe.includes(targa)) {
      // Aggiungi la nuova targa e mantieni solo le ultime 10
      storedTarghe.unshift(targa);
      const uniqueTarghe = [...new Set(storedTarghe)];
      const recentTarghe = uniqueTarghe.slice(0, 10);
      localStorage.setItem("recentTarghe", JSON.stringify(recentTarghe));
      setRecentTarghe(recentTarghe);
    }
  };

  const handleTargaChange = (newInputValue) => {
    setTarga(newInputValue);
    setVeicoloTrovato(false); // Nascondi il pulsante se cambia la targa
    setMessaggio(""); // Resetta il messaggio
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container-fluid">
        <h2>Aggiungi Scheda di Lavoro</h2>
        {/* Usa il sottocomponente TargaInput */}
        <TargaInput
          targa={targa}
          setTarga={setTarga}
          handleTargaChange={handleTargaChange}
          handleCercaVeicolo={handleCercaVeicolo}
          loading={loading}
          veicoloTrovato={veicoloTrovato}
          messaggio={messaggio}
          recentTarghe={recentTarghe}
        />
      </div>
    </motion.div>
  );
}
