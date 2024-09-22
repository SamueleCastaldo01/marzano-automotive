import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from "framer-motion";
import { DataGrid } from "@mui/x-data-grid";
import { itIT } from "@mui/x-data-grid/locales";
import { Paper, IconButton, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const theme = createTheme({
    palette: {
      mode: 'dark', // Imposta il tema su scuro
      background: {
        default: '#18181B', // Colore di sfondo principale
        paper: '#18181', // Colore di sfondo per i componenti Paper
      },
      text: {
        primary: 'white', // Colore del testo primario
      },
    },
    mixins: {
      MuiDataGrid: {
        pinnedBackground: '#18181', // Colore di sfondo per le sezioni appuntate
        containerBackground: '#224072', // Colore di sfondo per l'intestazione e le righe fisse
      },
    },
  });
  
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none', // Rimuove i bordi
    '& .MuiDataGrid-row': {
      backgroundColor: '#18181', // Colore di sfondo per le righe
      '&:hover': {
        backgroundColor: '#18181', // Colore di sfondo al passaggio del mouse
      },
    },
    '& .MuiDataGrid-footerContainer': {
      display: 'flex',
      alignItems: 'center', // Centra verticalmente gli elementi nel footer
      justifyContent: 'space-between', // Spazia gli elementi nel footer
      backgroundColor: '#18181', // Colore di sfondo per il footer
      padding: '0 10px', // Aggiungi padding se necessario
    },
    '& .MuiDataGrid-footer .MuiTypography-root': {
      margin: 0, // Rimuove il margine dal testo del footer
    },
    '& .MuiDataGrid-footer': {
      borderTop: 'none', // Rimuove il bordo superiore del footer
    },
  }));

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerCollection = collection(db, "customersTab");
        const customerSnapshot = await getDocs(customerCollection);
        const customerList = customerSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customerList);
      } catch (error) {
        console.error("Errore nel recupero dei dati dei clienti: ", error);
      }
    };

    fetchCustomers();
  }, []);

  // Funzione per gestire la visibilità della password
  const handleTogglePassword = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id], // Alterna la visibilità della password per l'utente selezionato
    }));
  };

  // Funzione per copiare il testo negli appunti
  const handleCopy = (username, password) => {
    const copyText = `Username: ${username}\nPassword: ${password}`;
    navigator.clipboard.writeText(copyText).then(() => {
      // Mostra la notifica "copiato negli appunti"
      setSnackbarOpen(true);
    });
  };

  // Definizione delle colonne
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 130 },
    {
      field: "password",
      headerName: "Password",
      width: 300,
      renderCell: (params) => {
        const isPasswordVisible = showPassword[params.row.id];

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Mostra la password censurata o visibile */}
            <span>{isPasswordVisible ? params.value : "*********"}</span>

            <div>
              {/* Aggiunge l'icona occhio per alternare la visibilità */}
              <IconButton
                onClick={() => handleTogglePassword(params.row.id)}
                aria-label="toggle password visibility"
                size="small"
                sx={{ padding: 0 }}
              >
                {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>

              {/* Aggiunge il pulsante di copia */}
              <IconButton
                onClick={() =>
                  handleCopy(params.row.username, params.row.password)
                }
                aria-label="copy credentials"
                size="small"
                sx={{ padding: 0, marginLeft: 1 }} // Aggiunge un po' di spazio a sinistra
              >
                <ContentCopyIcon />
              </IconButton>
            </div>
          </div>
        );
      },
    },
    { field: "nome", headerName: "Nome", width: 130 },
    { field: "cognome", headerName: "Cognome", width: 130 },
    { field: "telefono", headerName: "Telefono", width: 130 },
    { field: "email", headerName: "Email", width: 130 },
  ];

  return (
    <ThemeProvider theme={theme}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container-fluid">
          <h2>Anagrafica Clienti</h2>
          <Paper
  sx={{
    height: 500,
    width: "94%",
    borderRadius: '8px',
    overflow: 'hidden', // Nasconde lo scroll
  }}
>
  <StyledDataGrid
    rows={customers}
    columns={columns}
    pageSize={5}
    checkboxSelection
    disableRowSelectionOnClick
    localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
    sx={{
      width: '100%', // Assicura che il DataGrid prenda tutta la larghezza disponibile
      overflowX: 'hidden', // Nasconde lo scroll orizzontale
    }}
  />
</Paper>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000}
            onClose={() => setSnackbarOpen(false)}
            message="Copiato negli appunti!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </div>
      </motion.div>
    </ThemeProvider>
  );
}
