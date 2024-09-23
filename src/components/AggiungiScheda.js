// AggiungiScheda.js
import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

const AggiungiScheda = ({ targa, cliente, telefono, veicolo }) => {
  const [dataCorrente, setDataCorrente] = useState("");

  useEffect(() => {
    // Ottieni la data attuale e formatta come GG/MM/AA
    const oggi = new Date();
    const giorno = String(oggi.getDate()).padStart(2, "0");
    const mese = String(oggi.getMonth() + 1).padStart(2, "0"); // I mesi partono da 0
    const anno = String(oggi.getFullYear()).slice(2); // Prendi le ultime due cifre dell'anno
    setDataCorrente(`${giorno}/${mese}/${anno}`);
  }, []);

  return (
    <div className="mt-4">
      <div className="row">
        <div className="col-6 d-flex flex-column justify-content-between">
          <TextField
            className="w-100"
            multiline
            rows={3}
            required
            label="Cliente"
            value={cliente} // Inserisci il nome del cliente
            disabled
            variant="outlined"
            color="tertiary"
          />
          <TextField
            className="w-100 mt-5"
            required
            label="Veicolo"
            value={veicolo} // Inserisci il veicolo (marca + nomeModello)
            disabled
            variant="outlined"
            color="tertiary"
          />
        </div>
        <div className="col-6 d-flex flex-column justify-content-between">
          <TextField
            className="w-50"
            required
            label="Data"
            value={dataCorrente} // Mostra la data attuale
            disabled
            variant="outlined"
            color="tertiary"
          />
          <TextField
            className="w-50 mt-3"
            required
            label="Telefono"
            value={telefono} // Inserisci il telefono del cliente
            disabled
            variant="outlined"
            color="tertiary"
          />
          <TextField
            className="w-50 mt-3"
            required
            label="Targa"
            value={targa}
            disabled
            variant="outlined"
            color="tertiary"
          />
        </div>
      </div>

      <div className="row mt-5">
        <div className="descrizione pe-0 col-5 text-center">
        <h5 className="mb-0">Descrizione</h5>
        <TextField
            className="w-100 mt-2"
            variant="outlined"
            color="tertiary"
          />
        </div>
        <div className="qt px-0 col-1 text-center">
        <h5 className="mb-0">QtA'</h5>
        <TextField
            className="w-100 mt-2"
            variant="outlined"
            color="tertiary"
          />
        </div>
        <div className="prezzo px-0 col-2 text-center">
        <h5 className="mb-0">Prezzo</h5>
        <TextField
            className="w-100 mt-2"
            variant="outlined"
            color="tertiary"
          />
        </div>
        <div className="sconto % px-0 col-2 text-center">
        <h5 className="mb-0">Sconto</h5>
        <TextField
            className="w-100 mt-2"
            variant="outlined"
            color="tertiary"
          />
        </div>
        <div className="totale col-2 text-center px-0">
        <h5 className="mb-0">Totale</h5>
        <TextField
            className="w-100 mt-2"
            variant="outlined"
            color="tertiary"
          />
        </div>
      </div>
    </div>
  );
};

export default AggiungiScheda;
