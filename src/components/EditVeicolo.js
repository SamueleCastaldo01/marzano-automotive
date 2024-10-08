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
    const [showScadenzarioFields, setShowScadenzarioFields] = useState(false); // Stato per i campi scadenzario

    // Stati per lo scadenzario
    const [revisione, setRevisione] = useState({ dataEffettuata: "", dataScadenza: "" });
    const [tassaCircolazione, setTassaCircolazione] = useState({ dataEffettuata: "", dataScadenza: "" });
    const [tagliando, setTagliando] = useState({ dataEffettuata: "", dataScadenza: "" });
    const [gpl, setGpl] = useState({ dataEffettuata: "", dataScadenza: "" });
    const [metano, setMetano] = useState({ dataEffettuata: "", dataScadenza: "" });
    const [assicurazione, setAssicurazione] = useState({ dataEffettuata: "", dataScadenza: "" });

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

                // Popolare gli stati dello scadenzario se i dati esistono
                setRevisione(vehicleData.scadenzario?.revisione || { dataEffettuata: "", dataScadenza: "" });
                setTassaCircolazione(vehicleData.scadenzario?.tassaCircolazione || { dataEffettuata: "", dataScadenza: "" });
                setTagliando(vehicleData.scadenzario?.tagliando || { dataEffettuata: "", dataScadenza: "" });
                setGpl(vehicleData.scadenzario?.gpl || { dataEffettuata: "", dataScadenza: "" });
                setMetano(vehicleData.scadenzario?.metano || { dataEffettuata: "", dataScadenza: "" });
                setAssicurazione(vehicleData.scadenzario?.assicurazione || { dataEffettuata: "", dataScadenza: "" });
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
                scadenzario: {
                    revisione,
                    tassaCircolazione,
                    tagliando,
                    gpl,
                    metano,
                    assicurazione,
                },
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
            <DialogTitle style={{ backgroundColor: "#1E1E1E" }}>Modifica Veicolo</DialogTitle>
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

                            {/* Sezione Scadenzario */}
                            <div className="col-lg-12 mt-4">
                                <Typography
                                    variant="h6"
                                    onClick={() => setShowScadenzarioFields(!showScadenzarioFields)}
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                >
                                    Scadenzario
                                    {showScadenzarioFields ? 
                                        <ExpandMoreIcon style={{ marginLeft: '8px', transform: 'rotate(180deg)' }} /> : 
                                        <ExpandMoreIcon style={{ marginLeft: '8px' }} />
                                    }
                                </Typography>
                                <Collapse in={showScadenzarioFields}>
                                    <div className="row">
                                        <h6 style={{backgroundColor: "#224072"}} className="mt-4 py-1">Revisione</h6>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Revisione - Data Effettuata"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={revisione.dataEffettuata}
                                                onChange={(e) => setRevisione({ ...revisione, dataEffettuata: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Revisione - Data Scadenza"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={revisione.dataScadenza}
                                                onChange={(e) => setRevisione({ ...revisione, dataScadenza: e.target.value })}
                                            />
                                        </div>
                                        <h6 style={{backgroundColor: "#224072"}} className="mt-4 py-1">Tassa Circolazione</h6>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Tassa Circolazione - Data Effettuata"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={tassaCircolazione.dataEffettuata}
                                                onChange={(e) => setTassaCircolazione({ ...tassaCircolazione, dataEffettuata: e.target.value })}
                                            />
                                         </div>
                                         <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Tassa Circolazione - Data Scadenza"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={tassaCircolazione.dataScadenza}
                                                onChange={(e) => setTassaCircolazione({ ...tassaCircolazione, dataScadenza: e.target.value })}
                                            />
                                       </div>
                                       <h6 style={{backgroundColor: "#224072"}} className="mt-4 py-1">Tagliando</h6>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Tagliando - Data Effettuata"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={tagliando.dataEffettuata}
                                                onChange={(e) => setTagliando({ ...tagliando, dataEffettuata: e.target.value })}
                                            />
                                         </div>
                                         <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Tagliando - Data Scadenza"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={tagliando.dataScadenza}
                                                onChange={(e) => setTagliando({ ...tagliando, dataScadenza: e.target.value })}
                                            />
                                            </div>
                                        <h6 style={{backgroundColor: "#224072"}} className="mt-4 py-1">Gpl</h6>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Gpl - Data Effettuata"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={gpl.dataEffettuata}
                                                onChange={(e) => setGpl({ ...gpl, dataEffettuata: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Gpl - Data Scadenza"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={gpl.dataScadenza}
                                                onChange={(e) => setGpl({ ...gpl, dataScadenza: e.target.value })}
                                            />
                                        </div>
                                        <h6 style={{backgroundColor: "#224072"}} className="mt-4 py-1">Metano</h6>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Metano - Data Effettuata"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={metano.dataEffettuata}
                                                onChange={(e) => setMetano({ ...metano, dataEffettuata: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Metano - Data Scadenza"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={metano.dataScadenza}
                                                onChange={(e) => setMetano({ ...metano, dataScadenza: e.target.value })}
                                            />
                                         </div>
                                         <h6 style={{backgroundColor: "#224072"}} className="mt-4 py-1">Assicurazione</h6>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Assicurazione - Data Effettuata"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={assicurazione.dataEffettuata}
                                                onChange={(e) => setAssicurazione({ ...assicurazione, dataEffettuata: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-12">
                                            <TextField
                                                color="tertiary"
                                                className="w-100"
                                                label="Assicurazione - Data Scadenza"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={assicurazione.dataScadenza}
                                                onChange={(e) => setAssicurazione({ ...assicurazione, dataScadenza: e.target.value })}
                                            />
                                        </div>
                                        {/* Continua con GPL, Metano, Assicurazione */}
                                    </div>
                                </Collapse>
                            </div>

                        </div>
                    </form>
                </div>
            </DialogContent>
            <DialogActions style={{ backgroundColor: "#1E1E1E" }}>
                <Button onClick={onClose} variant="contained" color="error">
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
