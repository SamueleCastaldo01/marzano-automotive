import React, { useState, useEffect } from "react";
import "./App.css";
import moment from "moment/moment";
import "moment/locale/it";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Box from '@mui/material/Box';
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AnimateRoutes from "./components/AnimateRoutes";
import { ToastContainer } from 'react-toastify';
import BottomNavi from "./components/BottomNavigation";
import MiniDrawer from "./components/MiniDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled } from "@mui/material/styles";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { tutti } from './components/utenti';

// Styled BottomNavigationAction
const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
  color: #f6f6f6;
`);

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const matches = useMediaQuery("(max-width:920px)");
  const auth = getAuth();

  useEffect(() => {
    // Monitoraggio dello stato di autenticazione
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem("uid", user.uid);
      } else {
        localStorage.removeItem("uid");
      }
    });

    return () => unsubscribe(); // Cleanup all'unmount del componente
  }, [auth]);

  // SignOut function
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
    });
  };

  return (
    <Router>
      <Box sx={{ display: "flex", padding: 0 }}>
        {/* AppContent renderizzato con i suoi parametri */}
        <AppContent signUserOut={signUserOut} matches={matches} />
      </Box>

      {/* Mostra BottomNavi solo su schermi piccoli */}
      {matches && <BottomNavi />}
    </Router>
  );
}

// Componente per il contenuto principale
function AppContent({ signUserOut, matches }) {
  const location = useLocation(); // Usa useLocation per ottenere l'URL corrente

  // Verifica se l'utente si trova nelle pagine di login o block
  const isLoginPage = location.pathname === "/login";
  const isBlockPage = location.pathname === "/block";
  let ta= tutti.includes(localStorage.getItem("uid"))

  return (
    <>
      {/* Mostra MiniDrawer solo se non è la pagina di login o block e lo schermo è grande */}
      {!matches && !isLoginPage && !isBlockPage && ta && <MiniDrawer signUserOut={signUserOut} />}

      <Box
        className="backPage"
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          padding: matches ? 0 : "24px",
          paddingTop: "24px",
        }}
      >
        {/* Sfondo e contenuto principale */}
        <div className="background-imagePage"></div>
        <ToastContainer limit={1} />

        {/* Render delle rotte animate */}
        <div style={{ marginTop: !matches && "50px" }}>
          <AnimateRoutes />
        </div>
      </Box>
    </>
  );
}

export default App;
