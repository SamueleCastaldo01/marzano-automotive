import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config"; // Assicurati che il percorso sia corretto
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Button from '@mui/material/Button';
import { NavMobile } from "../components/NavMobile";

export function UserVeicoli() {
  const [veicoli, setVeicoli] = useState([]);
  const [error, setError] = useState(null);

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
    
      <div style={{marginTop: "110px", marginBottom: "100px"}} className="px-4 text-center">
        <h1>I tuoi Veicoli</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!error && veicoli.length === 0 && (
          <p>Nessun veicolo trovato per questo utente.</p>
        )}
        {veicoli.length > 0 && (
          <ul>
            {veicoli.map((veicolo) => (
                <>
                <div key={veicoli.id} className="mt-5">
                    <Button className="w-100" style={{height: "150px", fontSize: "20px"}} variant="contained">
                        Targa: {veicolo.targa} <br></br>{veicolo.marca} {veicolo.nomeModello}</Button>
                </div>
              </>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
    </>
  );
}
