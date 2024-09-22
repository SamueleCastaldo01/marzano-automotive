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
import ShareIcon from "@mui/icons-material/Share";
import { StyledDataGrid, theme } from '../components/StyledDataGrid';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Button from '@mui/material/Button';

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

  const handleTogglePassword = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = (telefono, username, password) => {
    const message = `Marzano Automotive\nUsername: ${username}\nPassword: ${password}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${telefono}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsApp = (telefono) => {
    const message = 'Ciao! Questo è un messaggio automatico.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${telefono}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 130 },
    {
      field: "password",
      headerName: "Password",
      width: 200,
      renderCell: (params) => {
        const isPasswordVisible = showPassword[params.row.id];

        return (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span>{isPasswordVisible ? params.value : "*********"}</span>
            <div>
              <IconButton onClick={() => handleTogglePassword(params.row.id)} aria-label="toggle password visibility" size="small" sx={{ padding: 0 }}>
                {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
              <IconButton onClick={() => handleShare(params.row.telefono, params.row.username, params.row.password)} aria-label="share credentials" size="small" sx={{ padding: 0, marginLeft: 1 }}>
                <ShareIcon />
              </IconButton>
            </div>
          </div>
        );
      },
    },
    { field: "nome", headerName: "Nome", width: 130 },
    { field: "cognome", headerName: "Cognome", width: 130 },
    {
      field: "telefono",
      headerName: "Telefono",
      width: 150,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <span>{params.value}</span>
          <IconButton onClick={() => handleWhatsApp(params.value)} aria-label="send WhatsApp message" size="small" sx={{ padding: 0 }}>
            <WhatsAppIcon />
          </IconButton>
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 130 },
  ];

  return (
    <ThemeProvider theme={theme}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="container-fluid">
            <div className='d-flex justify-content-between align-items-center'>
                <h2>Anagrafica Clienti</h2> 
                <div>
                    <Button variant="contained" color='primary' className='me-2' >Modifica</Button>
                    <Button color='error' variant="contained">Elimina</Button>
                </div>  
            </div>
          
          <Paper className='mt-4' sx={{ height: 500, borderRadius: '8px', overflowX: "auto" }}>
          <StyledDataGrid
              rows={customers}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
            />
          </Paper>
          <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} message="Copiato negli appunti!" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
        </div>
      </motion.div>
    </ThemeProvider>
  );
}
