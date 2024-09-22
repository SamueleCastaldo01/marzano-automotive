import React from "react";
import "./App.css";
import moment from "moment/moment";
import "moment/locale/it";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import AnimateRoutes from "./components/AnimateRoutes";
import BottomNavi from "./components/BottomNavigation";
import MiniDrawer from "./components/MiniDrawer";
import useMediaQuery from '@mui/material/useMediaQuery';
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

  //permessi utente
  let sup = supa.includes(localStorage.getItem("uid"));
  let ta = tutti.includes(localStorage.getItem("uid")); //se trova id esatto nell'array rispetto a quello corrente, ritorna true

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      localStorage.setItem("uid", uid);
    } else {
      // User is signed out
      // ...
    }
  });

  //signOut
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
        {!matches && <MiniDrawer signUserOut={signUserOut} />}
        <div className="container" style={{ padding: "0px" }}>
          <div
            className="container"
            style={{ padding: "0px", marginTop: "60px" }}
          >
            <AnimateRoutes />
          </div>
        </div>

        <BottomNavi />
      </Router>
    </>
  );
}

export default App;
