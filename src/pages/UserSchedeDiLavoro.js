import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { NavMobile } from "../components/NavMobile";
import { Button } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function UserSchedeDiLavoro() {
  const [schede, setSchede] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Ottieni lo username dal Redux store
  const username = useSelector((state) => state.userAuth.userDetails?.username);

  useEffect(() => {
    const fetchSchede = async () => {
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
        setCustomerId(customerId);

        // 2. Query per ottenere le schede di lavoro filtrate con idCustomer
        const schedaRef = collection(db, "schedaDiLavoroTab");
        const schedaQuery = query(
          schedaRef,
          where("idCustomer", "==", customerId)
        );
        const schedeSnapshot = await getDocs(schedaQuery);

        if (schedeSnapshot.empty) {
          throw new Error("Nessuna scheda di lavoro trovata.");
        }

        // Mappa i dati delle schede di lavoro in un array
        const schedeData = schedeSnapshot.docs.map((doc) => ({
          id: doc.id, // ID del documento
          ...doc.data(),
        }));

        // Imposta i dati nello stato
        setSchede(schedeData);
      } catch (err) {
        console.error("Errore durante il recupero delle schede di lavoro:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Fine del caricamento
      }
    };

    fetchSchede();
  }, [username]);

  return (
    <>
      <NavMobile />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center px-4" style={{ marginTop: "110px", marginBottom: "100px" }}>
          <h1>Schede di lavoro</h1>

          {loading && <p>Caricamento in corso...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && schede.length === 0 && <p>Nessuna scheda di lavoro trovata.</p>}

          {!loading && schede.length > 0 && (
            <>
              {schede.map((scheda) => (
                <div key={scheda.id} className="mt-4">
                  <Button
                    variant="contained"
                    className="w-100"
                    style={{ height: "100px", fontSize: "16px" }}
                    onClick={() => {navigate("/userscheda/" +customerId +"/" + scheda.id)}} // Puoi cambiare l'azione in futuro
                  >
                    {/* Converte la data usando moment */}
                    Data: {moment(scheda.dataCreazione.toDate()).format("DD/MM/YYYY")} <br />
                    Targa: {scheda.targa} <br />
                    Veicolo: {scheda.veicolo}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
