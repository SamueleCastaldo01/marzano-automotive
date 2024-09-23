import { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, FormControl, InputLabel, Button, Collapse, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Importa l'icona
import { db } from "../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { successNoty, errorNoty } from "../components/Notify";

const EditVeicolo = ({ open, onClose, vehicleId, fetchVehicles }) => {
    const [targa, setTarga] = useState("");
    const [marca, setMarca] = useState("");
    const [nomeModello, setNomeModello] = useState("");
    const [numeroTelaio, setNumeroTelaio] = useState("");
    const [annoImmatricolazione, setAnnoImmatricolazione] = useState("");
    const [tipoAlimentazione, setTipoAlimentazione] = useState("");
    const [potenza, setPotenza] = useState("");
    const [showOptionalFields, setShowOptionalFields] = useState(false); // Stato per i campi facoltativi

    useEffect(() => {
        const fetchVehicleData = async () => {
            const vehicleDoc = await getDoc(doc(db, "veicoloTab", vehicleId));
            if (vehicleDoc.exists()) {
                const vehicleData = vehicleDoc.data();
                setTarga(vehicleData.targa);
                setMarca(vehicleData.marca);
                setNomeModello(vehicleData.nomeModello);
                setNumeroTelaio(vehicleData.numeroTelaio || "");
                setAnnoImmatricolazione(vehicleData.annoImmatricolazione || "");
                setTipoAlimentazione(vehicleData.tipoAlimentazione || "");
                setPotenza(vehicleData.potenza || "");
            }
        };

        if (open) {
            fetchVehicleData();
        }
    }, [open, vehicleId]);

    const handleEditVehicle = async () => {
        if (!marca || !nomeModello) {
            errorNoty("Compila i campi obbligatori");
            return;
        }

        try {
            await updateDoc(doc(db, "veicoloTab", vehicleId), {
                marca,
                nomeModello,
                numeroTelaio: numeroTelaio || null,
                annoImmatricolazione: annoImmatricolazione || null,
                tipoAlimentazione: tipoAlimentazione || null,
                potenza: potenza || null,
            });
            successNoty("Veicolo modificato con successo");
            onClose(); // Chiudi il dialogo dopo la modifica
            fetchVehicles(); // Aggiorna la lista dei veicoli
        } catch (error) {
            console.error("Errore durante la modifica del veicolo: ", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle style={{backgroundColor: "#1E1E1E" }}>Modifica Veicolo</DialogTitle>
            <DialogContent style={{backgroundColor: "#1E1E1E" }}>
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
                                    InputProps={{ readOnly: true }} // Targa non modificabile
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
            <DialogActions style={{backgroundColor: "#1E1E1E" }}>
                <Button onClick={onClose} color="secondary">
                    Annulla
                </Button>
                <Button onClick={handleEditVehicle} variant="contained" color="primary">
                    Modifica
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditVeicolo;
