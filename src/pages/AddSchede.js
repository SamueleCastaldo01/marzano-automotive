import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { successNoty, errorNoty } from "../components/Notify";
import TargaInput from "../components/TargaInput";
import AggiungiScheda from "../components/AggiungiScheda";

export function AddSchede() {
  const [targa, setTarga] = useState("");
  const [veicoloTrovato, setVeicoloTrovato] = useState(false);
  const [messaggio, setMessaggio] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentTarghe, setRecentTarghe] = useState([]);
  const [showAggiungiScheda, setShowAggiungiScheda] = useState(false);
  
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [veicolo, setVeicolo] = useState("");

  useEffect(() => {
    const storedTarghe = JSON.parse(localStorage.getItem("recentTarghe")) || [];
    setRecentTarghe(storedTarghe);
  }, []);

  //--------------------------------------------------------------------------------------
  const handleCercaVeicolo = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "veicoloTab"),
        where("targa", "==", targa.toUpperCase())
      );
      const querySnapshot = await getDocs(q);
      setLoading(false);
  
      if (querySnapshot.empty) {
        setVeicoloTrovato(false);
        setMessaggio("Veicolo non trovato");
        errorNoty("Veicolo non trovato");
      } else {
        // Recupera i dati del veicolo
        const veicoloData = querySnapshot.docs[0].data();
        const { idCustomer, marca, nomeModello } = veicoloData;
        setVeicolo(`${marca} ${nomeModello}`);
  
        // Ora recupera i dati del cliente usando idCustomer come ID del documento
        const customerDocRef = doc(db, "customersTab", idCustomer);
        const customerDoc = await getDoc(customerDocRef);
  
        if (customerDoc.exists()) {
          const customerData = customerDoc.data();
          setCliente(customerData.username);
          setTelefono(customerData.telefono);
        } else {
          setCliente("Cliente non trovato");
          setTelefono("");
        }
  
        setVeicoloTrovato(true);
        setMessaggio("Veicolo trovato");
        successNoty("Veicolo trovato");
        saveRecentTarga(targa.toUpperCase());
      }
    } catch (error) {
      setLoading(false);
      errorNoty("Errore durante la ricerca.");
    }
  };
  

  const saveRecentTarga = (targa) => {
    const storedTarghe = JSON.parse(localStorage.getItem("recentTarghe")) || [];
    if (!storedTarghe.includes(targa)) {
      storedTarghe.unshift(targa);
      const uniqueTarghe = [...new Set(storedTarghe)];
      const recentTarghe = uniqueTarghe.slice(0, 10);
      localStorage.setItem("recentTarghe", JSON.stringify(recentTarghe));
      setRecentTarghe(recentTarghe);
    }
  };

  const handleTargaChange = (newInputValue) => {
    setTarga(newInputValue);
    setVeicoloTrovato(false);
    setMessaggio("");
  };

  const handleCreaSchedaClick = () => {
    setShowAggiungiScheda(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
      <div className="container-fluid">
        <h2>Aggiungi Scheda di Lavoro</h2>
        {!showAggiungiScheda ? (
          <TargaInput
            targa={targa}
            setTarga={setTarga}
            handleTargaChange={handleTargaChange}
            handleCercaVeicolo={handleCercaVeicolo}
            loading={loading}
            veicoloTrovato={veicoloTrovato}
            messaggio={messaggio}
            recentTarghe={recentTarghe}
            onCreaScheda={handleCreaSchedaClick}
          />
        ) : (
          <AggiungiScheda targa={targa} cliente={cliente} telefono={telefono} veicolo={veicolo} />
        )}
      </div>
    </motion.div>
  );
}
