import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Assicurati che il percorso sia corretto
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Importa CircularProgress
import { NavMobile } from "../components/NavMobile";
import CarRepairIcon from '@mui/icons-material/CarRepair';
import { useNavigate } from "react-router-dom";

export function UserVeicoli() {
  const [veicoli, setVeicoli] = useState([]);
  const [loading, setLoading] = useState(true); // Aggiungi stato per il caricamento
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Ottieni l'username dal Redux store
  const username = useSelector((state) => state.userAuth.userDetails?.username);

  useEffect(() => {
    const fetchVeicoli = async () => {
      try {
        if (!username) {
          throw new Error("Username non trovato!");
        }

        // 1. Query per ottenere l'ID del cliente da customersTab
        const customersRef = collection(db, "customersTab");
        const customerQuery = query(
          customersRef,
          where("username", "==", username)
        );
        const customerSnapshot = await getDocs(customerQuery);

        if (customerSnapshot.empty) {
          throw new Error("Nessun cliente trovato con questo username.");
        }

        // Assumi che lo username sia univoco, quindi prendi solo il primo documento
        const customerId = customerSnapshot.docs[0].id;

        // 2. Query per ottenere i veicoli associati a questo ID cliente da veicoloTab
        const veicoliRef = collection(db, "veicoloTab");
        const veicoliQuery = query(
          veicoliRef,
          where("idCustomer", "==", customerId)
        );
        const veicoliSnapshot = await getDocs(veicoliQuery);

        if (veicoliSnapshot.empty) {
          throw new Error("Nessun veicolo associato trovato.");
        }

        // Mappa i dati dei veicoli in un array
        const veicoliData = veicoliSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Espandi i dati del veicolo
        }));

        // Imposta i veicoli nello stato
        setVeicoli(veicoliData);
      } catch (err) {
        console.error("Errore durante il recupero dei veicoli:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Imposta il caricamento su false alla fine
      }
    };

    fetchVeicoli();
  }, [username]);

  return (
    <>
      <NavMobile />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div style={{ marginTop: "70px", marginBottom: "100px" }} className="mainMobileUser px-4 text-center">
          <h1 className="py-2 rounded rounded-2" style={{ backgroundColor: "#333" }}>I tuoi Veicoli <CarRepairIcon style={{fontSize: "40px"}}/></h1>

          {loading && (
            <div style={{ marginTop: "20px" }}>
              <CircularProgress /> {/* Mostra la progress bar durante il caricamento */}
            </div>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && veicoli.length === 0 && (
            <p>Nessun veicolo trovato per questo utente.</p>
          )}

          <div className="px-3">
          {!loading && veicoli.length > 0 && (
            <>
              {veicoli.map((veicolo) => (
                <div key={veicolo.id} className="mt-4">
                  <Button
                  onClick={() => {navigate("/userschededilavoro"); localStorage.setItem("userTarga", veicolo.targa)}}
                    className="w-100"
                    style={{ height: "100px", fontSize: "15px" }}
                    variant="contained"
                  >
                    Targa: {veicolo.targa} <br />
                    {veicolo.marca} {veicolo.nomeModello}
                  </Button>
                </div>
              ))}
            </>
          )}
           </div>
        </div>
      </motion.div>
    </>
  );
}
