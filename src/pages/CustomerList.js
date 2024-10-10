import { styled, ThemeProvider } from '@mui/material/styles';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { itIT } from "@mui/x-data-grid/locales";
import { Paper, IconButton, Snackbar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, deleteDoc, doc, orderBy, query, where, getDoc } from "firebase/firestore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ShareIcon from "@mui/icons-material/Share";
import RefreshIcon from '@mui/icons-material/Refresh';
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
  const [searchPhone, setSearchPhone] = useState(''); // Stato per il numero di telefono da cercare
  const [searchTarga, setSearchTarga] = useState(''); // Stato per il valore della targa da cercare

  const handleEdit = (customerId) => {
    setEditCustomerId(customerId);
    setEditOpen(true);
  };

  const fetchCustomers = async (telefono = '') => {
    try {
        const customerCollection = collection(db, "customersTab");

        let customerQuery;
        if (telefono) {
            // Filtro per numero di telefono
            customerQuery = query(customerCollection, where("telefono", "==", telefono));
        } else {
            // Crea una query per ordinare per dataCreazione in ordine decrescente se non c'è il filtro
            customerQuery = query(customerCollection, orderBy("dataCreazione", "desc"));
        }

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

  const fetchCustomerByTarga = async (targa) => {
    try {
      const veicoloCollection = collection(db, "veicoloTab");
      const veicoloQuery = query(veicoloCollection, where("targa", "==", targa));
      const veicoloSnapshot = await getDocs(veicoloQuery);

      if (!veicoloSnapshot.empty) {
        const veicolo = veicoloSnapshot.docs[0].data(); // Recupera il primo documento trovato
        const idCustomer = veicolo.idCustomer;

        // Una volta ottenuto l'idCustomer, cerca il cliente corrispondente
        fetchCustomersById(idCustomer);
      } else {
        console.log("Nessun veicolo trovato con questa targa");
        setCustomers([]); // Resetta la lista dei clienti se non ci sono risultati
      }
    } catch (error) {
      console.error("Errore nella ricerca del cliente per targa: ", error);
    }
  };

  const fetchCustomersById = async (idCustomer) => {
    try {
      const customerDocRef = doc(db, "customersTab", idCustomer);
      const customerSnapshot = await getDoc(customerDocRef);
  
      if (customerSnapshot.exists()) {
        setCustomers([{ id: customerSnapshot.id, ...customerSnapshot.data() }]);
      } else {
        console.log("Cliente non trovato");
        setCustomers([]); // Resetta la lista dei clienti se il cliente non esiste
      }
    } catch (error) {
      console.error("Errore nella ricerca del cliente: ", error);
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
    const deletePromises = selectedCustomerIds.map(async (id) => {
        await deleteDoc(doc(db, "customersTab", id));

        const vehiclesRef = collection(db, "veicoloTab");
        const vehiclesQuery = query(vehiclesRef, where("idCustomer", "==", id));
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        
        const vehicleDeletePromises = vehiclesSnapshot.docs.map(vehicleDoc => 
            deleteDoc(doc(vehiclesRef, vehicleDoc.id))
        );

        await Promise.all(vehicleDeletePromises);
    });

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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(searchPhone);
  };

  const handleSearchTarga = (e) => {
    e.preventDefault();
    fetchCustomerByTarga(searchTarga);
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
            style={{ cursor: "pointer", textDecoration: "underline" }}
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
        <h2>Anagrafica Clienti</h2>
        <div className='d-flex justify-content-between align-items-center mt-4'>
          <div className='d-flex'>
          <form className="d-flex align-items-center" onSubmit={handleSearch}>
            <TextField
              style={{width: "165px"}}
              label="Cerca per Telefono"
              variant="outlined"
              className="me-2"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)} // Aggiorna lo stato con il valore inserito
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
          <form className="d-flex align-items-center" onSubmit={handleSearchTarga}>
            <TextField
              style={{width: "140px"}}
              label="Cerca per Targa"
              variant="outlined"
              className="me-2"
              value={searchTarga}
              onChange={(e) => setSearchTarga(e.target.value)} // Aggiorna lo stato con il valore inserito
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
          </div>
          <div>
            <IconButton variant="contained" onClick={() => {fetchCustomers()}}>
              <RefreshIcon/>
            </IconButton>
            <Button
              variant="contained"
              color='primary'
              className='me-2'
              onClick={() => navigate("/addcustomer")}
            >
              Aggiungi Cliente
            </Button>
            <Button
              variant="contained"
              color='primary'
              className='me-2'
              onClick={() => handleEdit(selectedCustomerIds[0])}
              disabled={selectedCustomerIds.length !== 1}
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
              onCellClick={() => {}}
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
