import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel, Button, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Importa l'icona
import { db } from "../firebase-config";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { successNoty, errorNoty } from "../components/Notify";

const AddVeicolo = ({ open, onClose, idCustomer, fetchVehicles, username, onTargaSaved }) => {
    const [targa, setTarga] = useState("");
    const [marca, setMarca] = useState("");
    const [nomeModello, setNomeModello] = useState("");
    const [numeroTelaio, setNumeroTelaio] = useState("");
    const [annoImmatricolazione, setAnnoImmatricolazione] = useState("");
    const [tipoAlimentazione, setTipoAlimentazione] = useState("");
    const [potenza, setPotenza] = useState("");
    const [showOptionalFields, setShowOptionalFields] = useState(false); // Stato per i campi facoltativi

    const resetCampi = () => {
        setTarga("");
        setMarca("");
        setNomeModello("");
        setNumeroTelaio("");
        setAnnoImmatricolazione("");
        setTipoAlimentazione("");
        setPotenza("");
    };

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

        const upperCaseTarga = targa.toUpperCase(); // Converti la targa in maiuscolo
        const isUnique = await isTargaUnique(upperCaseTarga);
        if (!isUnique) {
            errorNoty("La targa deve essere univoca");
            return;
        }

        try {
            await addDoc(collection(db, "veicoloTab"), {
                idCustomer,
                targa: upperCaseTarga, // Salva la targa in maiuscolo
                marca,
                nomeModello,
                numeroTelaio: numeroTelaio || null,
                annoImmatricolazione: annoImmatricolazione || null,
                tipoAlimentazione: tipoAlimentazione || null,
                potenza: potenza || null,
            });
            successNoty("Veicolo aggiunto con successo");
            fetchVehicles();
            onTargaSaved(upperCaseTarga);
            onClose(); // Chiudi il dialogo dopo l'aggiunta
            resetCampi();
        } catch (error) {
            console.error("Errore durante l'aggiunta del veicolo: ", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle style={{ backgroundColor: "#1E1E1E" }}>Aggiungi Veicolo di {username}</DialogTitle>
            <DialogContent style={{ backgroundColor: "#1E1E1E" }}>
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
                                    value={targa.toUpperCase()} // Mostra sempre in maiuscolo
                                    onChange={(e) => setTarga(e.target.value.toUpperCase())} // Converti in maiuscolo
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
                            {/* Sezione Campi Facoltativi */}
                            <div className="col-lg-12 mt-4">
                                <Typography
                                    variant="h6"
                                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    Campi Facoltativi
                                    {showOptionalFields ?
                                        <ExpandMoreIcon style={{ marginLeft: '8px', transform: 'rotate(180deg)' }} /> :
                                        <ExpandMoreIcon style={{ marginLeft: '8px' }} />
                                    }
                                </Typography>
                                <Collapse in={showOptionalFields}>
                                    <div className="row">
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
                                </Collapse>
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
            <DialogActions style={{ backgroundColor: "#1E1E1E" }}>
                <Button onClick={onClose} color="error" variant="contained">
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
