import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc, query, limit, orderBy } from "firebase/firestore";
import { db } from "../firebase-config"; // Assicurati che il percorso sia corretto
import { Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from "@mui/material";
import { StyledDataGrid, theme } from '../components/StyledDataGrid';
import { ThemeProvider } from '@mui/material/styles';
import { itIT } from "@mui/x-data-grid/locales";

export function SchedeDiLavoro() {
  const navigate = useNavigate();
  const [workCards, setWorkCards] = useState([]);
  const [selectedWorkCardIds, setSelectedWorkCardIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchWorkCards = async () => {
    try {
      const workCardCollection = collection(db, "schedaDiLavoroTab");
      
      // Aggiungi orderBy per ordinare in base alla data di creazione
      const workCardQuery = query(
        workCardCollection,
        orderBy("dataCreazione", "desc"), // Ordina per data di creazione in ordine decrescente
        limit(100) // Limita il numero di schede a 100
      );
      
      const workCardSnapshot = await getDocs(workCardQuery);
      const workCardList = workCardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setWorkCards(workCardList);
    } catch (error) {
      console.error("Errore nel recupero delle schede di lavoro: ", error);
    }
  };

  useEffect(() => {
    fetchWorkCards();
  }, []);

  const handleRowSelectionChange = (newSelection) => {
    setSelectedWorkCardIds(newSelection);
  };

  const handleDelete = async () => {
    const deletePromises = selectedWorkCardIds.map((id) => deleteDoc(doc(db, "schedaDiLavoroTab", id)));

    try {
      await Promise.all(deletePromises);
      setWorkCards(workCards.filter((workCard) => !selectedWorkCardIds.includes(workCard.id)));
      setConfirmOpen(false);
      setSelectedWorkCardIds([]);
      setSnackbarOpen(true); // Mostra la Snackbar dopo l'eliminazione
    } catch (error) {
      console.error("Errore durante l'eliminazione delle schede di lavoro: ", error);
    }
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRowClick = (id) => {
    navigate(`/aggiungischeda1/${id}`);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      renderCell: (params) => (
        <span className="p-1 rounded-4"
          style={{ cursor: 'pointer', backgroundColor: "#224072" }}
          onClick={() => handleRowClick(params.row.id)}
        >
          {params.row.id}
        </span>
      ),
    },
    { field: "cliente", headerName: "Cliente", width: 130 },
    { field: "targa", headerName: "Targa", width: 130 },
    { field: "veicolo", headerName: "Veicolo", width: 130 },
    { field: "totale", headerName: "Totale", width: 130 },
    { field: "pagato", headerName: "Pagato", width: 130 },
    { field: "resto", headerName: "Resto", width: 130 },
    {
      field: "dataCreazione",
      headerName: "Data",
      width: 130,
      renderCell: (params) => {
        // Se il valore è un oggetto timestamp di Firebase, converti in Date prima di formattare
        const date = params.value ? moment(params.value.toDate()) : null;
        return date && date.isValid() ? date.format('DD/MM/YYYY') : 'N/A'; // Formatta in 'dd/mm/yyyy' o mostra 'N/A'
      },
    },
  ];

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="container-fluid">
          <h2>Schede di Lavoro</h2>
          <div className="mt-5">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Schede di Lavoro</h5>
              <div>
                <Button className="me-2" variant="contained" disabled={selectedWorkCardIds.length !== 1}>
                  Modifica
                </Button>
                <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={selectedWorkCardIds.length === 0}>
                  Elimina {selectedWorkCardIds.length > 0 && `(${selectedWorkCardIds.length})`}
                </Button>
              </div>
            </div>
            <ThemeProvider theme={theme}>
              <Paper className="mt-4" sx={{ height: 400, borderRadius: "8px", overflowX: "auto" }}>
                <StyledDataGrid
                  rows={workCards}
                  columns={columns}
                  checkboxSelection
                  disableRowSelectionOnClick
                  onRowSelectionModelChange={handleRowSelectionChange}
                  localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
                />
              </Paper>
            </ThemeProvider>
          </div>
        </div>
      </motion.div>

      {/* Dialog di conferma eliminazione */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle style={{ backgroundColor: "#1E1E1E" }}>Conferma Eliminazione</DialogTitle>
        <DialogContent style={{ backgroundColor: "#1E1E1E" }}>
          <DialogContentText>
            Sei sicuro di voler eliminare {selectedWorkCardIds.length} scheda{selectedWorkCardIds.length > 1 ? 'e' : ''} selezionata{selectedWorkCardIds.length > 1 ? 'e' : ''}?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#1E1E1E" }}>
          <Button onClick={() => setConfirmOpen(false)} color="primary">Annulla</Button>
          <Button onClick={handleDelete} color="error">Elimina</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per conferma eliminazione */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Scheda di lavoro eliminata!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
