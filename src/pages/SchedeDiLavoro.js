import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  limit,
  orderBy,
  where, // Importa 'where' per filtrare i documenti
} from "firebase/firestore";
import { db } from "../firebase-config"; // Assicurati che il percorso sia corretto
import {
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  IconButton,
  TextField, // Importa TextField per l'input
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { StyledDataGrid, theme } from "../components/StyledDataGrid";
import { ThemeProvider } from "@mui/material/styles";
import { itIT } from "@mui/x-data-grid/locales";

export function SchedeDiLavoro() {
  const navigate = useNavigate();
  const [workCards, setWorkCards] = useState([]);
  const [selectedWorkCardIds, setSelectedWorkCardIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Stato per l'input di ricerca

  const fetchWorkCards = async (search = "") => {
    try {
      const workCardCollection = collection(db, "schedaDiLavoroTab");
  
      let workCardQuery;
      if (search) {
        // Trasformiamo la ricerca in uppercase
        const uppercaseSearch = search.toUpperCase();
        
        // Se c'è un termine di ricerca, usa where per filtrare i risultati
        workCardQuery = query(
          workCardCollection,
          where("targa", "==", uppercaseSearch) // Applica il filtro in uppercase
        );
      } else {
        // Altrimenti, recupera le schede senza filtro
        workCardQuery = query(workCardCollection);
      }
  
      const workCardSnapshot = await getDocs(workCardQuery);
      const workCardList = workCardSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Ordina manualmente l'array per data di creazione dal più recente
      workCardList.sort((a, b) => {
        const dateA = a.dataCreazione ? a.dataCreazione.toDate() : null; // Assicurati di avere una data valida
        const dateB = b.dataCreazione ? b.dataCreazione.toDate() : null;
        return dateB - dateA; // Ordina in ordine decrescente
      });
  
      // Imposta le schede di lavoro
      setWorkCards(workCardList);
    } catch (error) {
      console.error("Errore nel recupero delle schede di lavoro: ", error);
    }
  };

  useEffect(() => {
    fetchWorkCards(); // Fetch iniziale senza ricerca
  }, []);

  const handleRowSelectionChange = (newSelection) => {
    setSelectedWorkCardIds(newSelection);
  };

  //delete---------------------------------------------------
  const handleDelete = async () => {
    const deletePromises = selectedWorkCardIds.map((id) =>
      deleteDoc(doc(db, "schedaDiLavoroTab", id))
    );

    try {
      await Promise.all(deletePromises);
      setWorkCards(
        workCards.filter(
          (workCard) => !selectedWorkCardIds.includes(workCard.id)
        )
      );
      setConfirmOpen(false);
      setSelectedWorkCardIds([]);
      setSnackbarOpen(true); // Mostra la Snackbar dopo l'eliminazione
    } catch (error) {
      console.error(
        "Errore durante l'eliminazione delle schede di lavoro: ",
        error
      );
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

  const handleSearchChange = (event) => {
    // Aggiorna lo stato dell'input di ricerca trasformandolo in uppercase
    setSearchTerm(event.target.value.toUpperCase());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWorkCards(searchTerm); // Effettua la ricerca quando l'input cambia
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      renderCell: (params) => (
        <span
          className="p-1 rounded-4"
          style={{ cursor: "pointer", backgroundColor: "#224072" }}
          onClick={() => handleRowClick(params.row.id)}
        >
          {params.row.id}
        </span>
      ),
    },
    {
      field: "cliente",
      headerName: "Cliente",
      width: 130,
      renderCell: (params) => (
        <span
          className="p-1 rounded-4"
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => {
            navigate("/dashboardcustomer/" + params.row.idCustomer);
          }}
        >
          {params.row.cliente}
        </span>
      ),
    },
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
        const date = params.value ? moment(params.value.toDate()) : null;
        return date && date.isValid() ? date.format("DD/MM/YYYY") : "N/A";
      },
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">Schede di Lavoro</h2>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-4">
            <form
              className="d-flex align-items-center"
              onSubmit={handleSearch}
            >
              <TextField
                label="Cerca per Targa"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange} // Gestisci l'input di ricerca
                className="me-2"
              />
              <Button
                className="me-2"
                type="submit"
                color="primary"
                variant="contained"
              >
                Cerca
              </Button>
            </form>
            <div className="d-flex align-items-center">
            <IconButton variant="contained" onClick={() => {fetchWorkCards()}}>
              <RefreshIcon/>
            </IconButton>
              <Button
                className="me-2"
                color="primary"
                variant="contained"
                onClick={() => {
                  navigate("/aggiungischeda");
                }}
              >
                Aggiungi Schede
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={handleConfirmDelete}
                disabled={selectedWorkCardIds.length === 0}
              >
                Elimina{" "}
                {selectedWorkCardIds.length > 0 &&
                  `(${selectedWorkCardIds.length})`}
              </Button>
            </div>
          </div>

          <ThemeProvider theme={theme}>
            <Paper
              className="mt-4"
              sx={{ height: 450, borderRadius: "8px", overflowX: "auto" }}
            >
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
      </motion.div>

      {/* Dialog di conferma eliminazione */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle style={{ backgroundColor: "#1E1E1E" }}>
          Conferma Eliminazione
        </DialogTitle>
        <DialogContent style={{ backgroundColor: "#1E1E1E" }}>
          <DialogContentText>
            Sei sicuro di voler eliminare {selectedWorkCardIds.length} scheda
            {selectedWorkCardIds.length > 1 ? "e" : ""} selezionata
            {selectedWorkCardIds.length > 1 ? "e" : ""}?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ backgroundColor: "#1E1E1E" }}>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Annulla
          </Button>
          <Button onClick={handleDelete} color="error">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar per conferma eliminazione */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Scheda di lavoro eliminata!"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}
