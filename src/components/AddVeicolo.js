// AddVeicolo.js
import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel, Button } from "@mui/material";
import { db } from "../firebase-config";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { successNoty, errorNoty } from "../components/Notify";

const AddVeicolo = ({ open, onClose, idCustomer, fetchVehicles }) => {
    const [targa, setTarga] = useState("");
    const [marca, setMarca] = useState("");
    const [nomeModello, setNomeModello] = useState("");
    const [numeroTelaio, setNumeroTelaio] = useState("");
    const [annoImmatricolazione, setAnnoImmatricolazione] = useState("");
    const [tipoAlimentazione, setTipoAlimentazione] = useState("");
    const [potenza, setPotenza] = useState("");

    const resetCampi = () => {
        setTarga("");
        setMarca("");
        setNomeModello("");
        setNumeroTelaio("");
        setAnnoImmatricolazione("");
        setTipoAlimentazione("");
        setPotenza("");
    }

    const isTargaUnique = async (targa) => {
        const q = query(collection(db, "veicoloTab"), where("targa", "==", targa));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty; // Restituisce true se la targa è unica
    };

    const handleAddVehicle = async () => {
        if (!targa || !marca || !nomeModello) {
            errorNoty("Compila i campi obbligatori");
            return;
        }

        const isUnique = await isTargaUnique(targa);
        if (!isUnique) {
            errorNoty("La targa deve essere univoca");
            return;
        }

        try {
            await addDoc(collection(db, "veicoloTab"), {
                idCustomer,
                targa,
                marca,
                nomeModello,
                numeroTelaio: numeroTelaio || null,
                annoImmatricolazione: annoImmatricolazione || null,
                tipoAlimentazione: tipoAlimentazione || null,
                potenza: potenza || null,
            });
            successNoty("Veicolo aggiunto con successo");
            fetchVehicles();
            onClose(); // Chiudi il dialogo dopo l'aggiunta
            resetCampi();
        } catch (error) {
            console.error("Errore durante l'aggiunta del veicolo: ", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>Aggiungi Veicolo</DialogTitle>
            <DialogContent>
                <div className="container-fluid">
                    <form>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <TextField
                                    color="tertiary"
                                    className="w-100"
                                    required
                                    label="Targa"
                                    variant="outlined"
                                    value={targa}
                                    onChange={(e) => setTarga(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <TextField
                                    color="tertiary"
                                    className="w-100"
                                    required
                                    label="Marca"
                                    variant="outlined"
                                    value={marca}
                                    onChange={(e) => setMarca(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <TextField
                                    color="tertiary"
                                    className="w-100"
                                    required
                                    label="Nome Modello"
                                    variant="outlined"
                                    value={nomeModello}
                                    onChange={(e) => setNomeModello(e.target.value)}
                                />
                            </div>
                            {/* Campi facoltativi */}
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <TextField
                                    color="tertiary"
                                    className="w-100"
                                    label="Numero Telaio"
                                    variant="outlined"
                                    value={numeroTelaio}
                                    onChange={(e) => setNumeroTelaio(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <TextField
                                    color="tertiary"
                                    className="w-100"
                                    label="Anno di Immatricolazione"
                                    variant="outlined"
                                    type="number"
                                    value={annoImmatricolazione}
                                    onChange={(e) => setAnnoImmatricolazione(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <FormControl className="w-100">
                                    <InputLabel id="tipo-alimentazione-label">Tipo di Alimentazione</InputLabel>
                                    <Select
                                        labelId="tipo-alimentazione-label"
                                        value={tipoAlimentazione}
                                        label="Tipo di Alimentazione"
                                        onChange={(e) => setTipoAlimentazione(e.target.value)}
                                    >
                                        <MenuItem value="benzina">Benzina</MenuItem>
                                        <MenuItem value="diesel">Diesel</MenuItem>
                                        <MenuItem value="elettrico">Elettrico</MenuItem>
                                        <MenuItem value="ibrido">Ibrido</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mt-4">
                                <TextField
                                    color="tertiary"
                                    className="w-100"
                                    label="Potenza (kW)"
                                    variant="outlined"
                                    type="number"
                                    value={potenza}
                                    onChange={(e) => setPotenza(e.target.value)}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Annulla
                </Button>
                <Button onClick={handleAddVehicle} variant="contained" color="primary">
                    Aggiungi
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVeicolo;
