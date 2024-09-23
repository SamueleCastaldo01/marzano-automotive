import { styled, ThemeProvider } from '@mui/material/styles';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button, Paper, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle, Snackbar } from "@mui/material";
import EditVeicolo from '../components/EditVeicolo';
import { useParams } from "react-router-dom";
import { db } from "../firebase-config"; // Assicurati che il percorso sia corretto
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { StyledDataGrid, theme } from '../components/StyledDataGrid';
import AddVeicolo from "../components/AddVeicolo";
import { itIT } from "@mui/x-data-grid/locales";

export function DashboardCustomer() {
    const { id } = useParams();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleIds, setSelectedVehicleIds] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Stato per la Snackbar

    const [editVehicleId, setEditVehicleId] = useState(null);
    const [editOpen, setEditOpen] = useState(false);

    const handleEdit = (vehicleId) => {
        setEditVehicleId(vehicleId);
        setEditOpen(true);
    };

    const handleRowSelectionChange = (newSelection) => {
        setSelectedVehicleIds(newSelection);
        if (newSelection.length === 1) {
            setEditVehicleId(newSelection[0]); // Setta l'ID del veicolo selezionato
        } else {
            setEditVehicleId(null); // Resetta se non è un veicolo singolo
        }
    };

    const fetchVehicles = async () => {
        try {
            const vehicleCollection = collection(db, "veicoloTab");
            const vehicleQuery = query(vehicleCollection, where("idCustomer", "==", id)); // Filtro diretto
            const vehicleSnapshot = await getDocs(vehicleQuery);
            const vehicleList = vehicleSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setVehicles(vehicleList);
        } catch (error) {
            console.error("Errore nel recupero dei veicoli: ", error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [id]);


    const handleDelete = async () => {
        const deletePromises = selectedVehicleIds.map((id) => deleteDoc(doc(db, "veicoloTab", id)));

        try {
            await Promise.all(deletePromises);
            setVehicles(vehicles.filter(vehicle => !selectedVehicleIds.includes(vehicle.id)));
            setConfirmOpen(false);
            setSelectedVehicleIds([]);
            setSnackbarOpen(true); // Mostra la Snackbar dopo l'eliminazione
        } catch (error) {
            console.error("Errore durante l'eliminazione dei veicoli: ", error);
        }
    };

    const handleConfirmDelete = () => {
        setConfirmOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "targa", headerName: "Targa", width: 130 },
        { field: "marca", headerName: "Marca", width: 130 },
        { field: "nomeModello", headerName: "Nome Modello", width: 130 },
    ];

    return (
        <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <div className="container-fluid">
                <h2>Dashboard Cliente</h2>
                <div className="mt-5">
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className='mb-0'>Veicoli</h5>
                        <div>
                            <Button className="me-2" variant="contained" onClick={() => setOpenAddDialog(true)}>
                                Aggiungi
                            </Button>
                            <Button className="me-2" variant="contained" onClick={() => handleEdit(selectedVehicleIds[0])} disabled={selectedVehicleIds.length !== 1}>
                                Modifica
                            </Button>
                            <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={selectedVehicleIds.length === 0}>
                                Elimina {selectedVehicleIds.length > 0 && `(${selectedVehicleIds.length})`}
                            </Button>
                        </div>
                    </div>
                    <ThemeProvider theme={theme}>
                        <Paper className='mt-4' sx={{ height: 300, borderRadius: '8px', overflowX: "auto" }}>
                            <StyledDataGrid
                                rows={vehicles}
                                columns={columns}
                                checkboxSelection
                                onRowSelectionModelChange={handleRowSelectionChange}
                                localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
                            />
                        </Paper>
                    </ThemeProvider>
                </div>
            </div>
        </motion.div>

        {/* Dialog per aggiungere il veicolo */}
        <AddVeicolo open={openAddDialog} onClose={() => setOpenAddDialog(false)} idCustomer={id} fetchVehicles={fetchVehicles}/>

        {/* Dialog di conferma eliminazione */}
        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Sei sicuro di voler eliminare {selectedVehicleIds.length} veicolo{i => (selectedVehicleIds.length > 1 ? 'i' : '')} selezionato{i => (selectedVehicleIds.length > 1 ? 'i' : '')}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setConfirmOpen(false)} color="primary">Annulla</Button>
                <Button onClick={handleDelete} color="error">Elimina</Button>
            </DialogActions>
        </Dialog>

        {/* Snackbar per conferma eliminazione */}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={handleSnackbarClose}
            message="Veicolo rimosso!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        {/* Dialog per modificare il veicolo */}
        <EditVeicolo open={editOpen} onClose={() => setEditOpen(false)} vehicleId={editVehicleId} fetchVehicles={fetchVehicles} />
    </>
    );
}
