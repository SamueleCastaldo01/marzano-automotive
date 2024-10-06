import { styled, ThemeProvider } from '@mui/material/styles';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { itIT } from "@mui/x-data-grid/locales";
import { Paper, IconButton, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ShareIcon from "@mui/icons-material/Share";
import { StyledDataGrid, theme } from '../components/StyledDataGrid';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { EditCliente } from '../components/EditCliente';

export function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showPassword, setShowPassword] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (customerId) => {
    setEditCustomerId(customerId);
    setEditOpen(true);
  };


  const fetchCustomers = async () => {
    try {
        const customerCollection = collection(db, "customersTab");
        
        // Crea una query per ordinare per dataCreazione in ordine decrescente
        const customerQuery = query(customerCollection, orderBy("dataCreazione", "desc"));

        const customerSnapshot = await getDocs(customerQuery);
        const customerList = customerSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        
        setCustomers(customerList);
    } catch (error) {
        console.error("Errore nel recupero dei dati dei clienti: ", error);
    }
};


  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleTogglePassword = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = (telefono, username, password) => {
    const message = `Marzano Automotive\nhttps://marzano-automotive.web.app/loginuser\nUsername: ${username}\nPassword: ${password}`;
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

  const handleRowSelectionChange = (newSelection) => {
    console.log("Selected Customer IDs:", newSelection);
    setSelectedCustomerIds(newSelection);
  };

  const handleDelete = async () => {
    const deletePromises = selectedCustomerIds.map((id) => deleteDoc(doc(db, "customersTab", id)));

    try {
      await Promise.all(deletePromises);
      setCustomers(customers.filter(customer => !selectedCustomerIds.includes(customer.id)));
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Errore durante l'eliminazione dei clienti: ", error);
    } finally {
      setConfirmOpen(false);
      setSelectedCustomerIds([]);
    }
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "Username",
      width: 130,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={{  cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {navigate("/dashboardcustomer/" + params.row.id)}}
          >
            {params.value}
          </span>
        </div>
      ),
    },
    {
      field: "password",
      headerName: "Password",
      width: 200,
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
            <span>{isPasswordVisible ? params.value : "*********"}</span>
            <div>
              <IconButton
                onClick={() => handleTogglePassword(params.row.id)}
                aria-label="toggle password visibility"
                size="small"
                sx={{ padding: 0 }}
              >
                {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
              <IconButton
                onClick={() =>
                  handleShare(params.row.telefono, params.row.username, params.row.password)
                }
                aria-label="share credentials"
                size="small"
                sx={{ padding: 0, marginLeft: 1 }}
              >
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span>{params.value}</span>
          <IconButton
            onClick={() => handleWhatsApp(params.value)}
            aria-label="send WhatsApp message"
            size="small"
            sx={{ padding: 0 }}
          >
            <WhatsAppIcon />
          </IconButton>
        </div>
      ),
    },
    { field: "email", headerName: "Email", width: 130 },
  ];

  return (
    
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="container-fluid">
          <div className='d-flex justify-content-between align-items-center'>
            <h2>Anagrafica Clienti</h2>
            <div>
            <Button
                variant="contained"
                color='primary'
                className='me-2'
                onClick={() => navigate("/addcustomer")} // Passa l'ID del cliente selezionato// Abilita solo se c'è un cliente selezionato
              >
                Aggiungi Cliente
              </Button>
              <Button
                variant="contained"
                color='primary'
                className='me-2'
                onClick={() => handleEdit(selectedCustomerIds[0])} // Passa l'ID del cliente selezionato
                disabled={selectedCustomerIds.length !== 1} // Abilita solo se c'è un cliente selezionato
              >
                Modifica
              </Button>
              <Button color='error' variant="contained" onClick={handleConfirmDelete} disabled={selectedCustomerIds.length === 0}>
                Elimina {selectedCustomerIds.length > 0 && `(${selectedCustomerIds.length})`}
              </Button>
            </div>
          </div>
          <ThemeProvider theme={theme}>
          <Paper className='mt-4' sx={{ height: 500, borderRadius: '8px', overflowX: "auto" }}>
            <StyledDataGrid
            onCellClick={() => {
                
            }}
              rows={customers}
              columns={columns}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleRowSelectionChange}
              localeText={itIT.components.MuiDataGrid.defaultProps.localeText}
            />
          </Paper>
          </ThemeProvider>
          <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} message="Cliente eliminato!" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />

          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle style={{backgroundColor: "#1E1E1E" }}>Conferma Eliminazione</DialogTitle>
            <DialogContent style={{backgroundColor: "#1E1E1E" }}>
              <DialogContentText>
                Sei sicuro di voler eliminare {selectedCustomerIds.length} cliente{i => (selectedCustomerIds.length > 1 ? 'i' : '')} selezionato{i => (selectedCustomerIds.length > 1 ? 'i' : '')}?
              </DialogContentText>
            </DialogContent >
            <DialogActions style={{backgroundColor: "#1E1E1E" }}>
              <Button onClick={() => setConfirmOpen(false)} color="primary">Annulla</Button>
              <Button onClick={handleDelete} color="error">Elimina</Button>
            </DialogActions>
          </Dialog>

          <Dialog maxWidth="md" open={editOpen} onClose={() => setEditOpen(false)}>
            <DialogTitle style={{backgroundColor: "#1E1E1E" }}>Modifica Cliente</DialogTitle>
            <DialogContent style={{backgroundColor: "#1E1E1E" }}>
                <EditCliente fetchCustomers={fetchCustomers} customerId={editCustomerId} onClose={() => setEditOpen(false)} />
            </DialogContent>
          </Dialog>

        </div>
      </motion.div>

  );
}
