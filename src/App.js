import React from "react";
import "./App.css";
import moment from "moment/moment";
import "moment/locale/it";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Box from '@mui/material/Box';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation  // Importa useLocation
} from "react-router-dom";
import AnimateRoutes from "./components/AnimateRoutes";
import { ToastContainer, toast, Slide } from 'react-toastify';
import BottomNavi from "./components/BottomNavigation";
import MiniDrawer from "./components/MiniDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import Paper from "@mui/material/Paper";
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { BottomNavigation } from "@mui/material";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import { supa, tutti } from "./components/utenti";

function App() {
  const [value, setValue] = React.useState(0);
  const matches = useMediaQuery("(max-width:920px)");
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [selectedPage, setSelectedPage] = useState("home"); // Stato iniziale selezionato

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      localStorage.setItem("uid", uid);
    } else {
      // User is signed out
    }
  });

  // SignOut
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
    });
  };

  const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
    color: #f6f6f6;
  `);

  React.useEffect(() => {
    setValue("");
    console.log("sono entrato baby");
    console.log(localStorage.getItem("naviBottom"));
  }, [value]);

  return (
    <>
      <Router>
        <Box sx={{ display: "flex", padding: "0px" }}>
          {/* Sposta l'uso di useLocation qui */}
          <AppContent signUserOut={signUserOut} matches={matches} />
        </Box>

      {matches &&
       <BottomNavi />
      }
      </Router>
    </>
  );
}

// Crea un nuovo componente che utilizza useLocation
function AppContent({ signUserOut, matches }) {
  const location = useLocation(); // Ora funziona perché è dentro il Router

  // Controlla se l'utente è nella pagina di login
  const isLoginPage = location.pathname === "/login";  // Modifica "/login" secondo il path della tua pagina di login

  return (
    <>
      {/* Mostra la MiniDrawer solo se non è la pagina di login */}
      {!matches && !isLoginPage && <MiniDrawer signUserOut={signUserOut} />}

      <Box
        className="backPage"
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          padding: matches ? "0px" : "24px",
          paddingTop: "24px",
        }}
      >
        <div className="background-imagePage"></div>
        <div>
          <ToastContainer limit={1} />
        </div>

         
        <div style={{ marginTop: !matches && "50px" }}>
          <AnimateRoutes />
        </div>
      
      </Box>
    </>
  );
}

export default App;
