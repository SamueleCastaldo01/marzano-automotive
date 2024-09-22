import React from 'react'
import { useState, useEffect } from "react";
import Homepage from '../pages/Homepage'
import Profilo from '../pages/Profilo';
import Ricevuta from '../pages/Ricevuta';
import Entrate from '../pages/Entrate';
import Uscite from '../pages/Uscite';
import Riepilogo from '../pages/Riepilogo';
import Login from '../pages/Login';
import Page_per from '../pages/Page_per';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import {PrivateRoutes, PrivatePerm} from '../components/PrivateRoutes';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment/moment';
import 'moment/locale/it'



function AnimateRoutes ()  {
    
    

    const location = useLocation();
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte nel tipo data
    var formattedDate = moment(today).format('DD-MM-YYYY');  //coverte nel formato richiesto
    localStorage.setItem("today", formattedDate);
    const [todayC, setTodayC] = useState(localStorage.getItem("today"));  //variabile che andiamo ad utilizzare



return (

    <AnimatePresence>
    <Routes location={location} key={location.pathname}>

    <Route path="/profilo" element={<Profilo />} /> 
    <Route path="/ricevuta/:data/:nome/:importo/:causale/:flag/:conteggio" element={<Ricevuta />} />

    <Route element={<PrivateRoutes isAuth={isAuth}/>}> 
    <Route element={<PrivatePerm/>}>

    <Route path="/" element={<Homepage />} /> 
    <Route path="/entrate/:flag" element={<Entrate dataOdi={todayC}/>} /> 
    <Route path="/riepilogo" element={<Riepilogo />} /> 
    
    </Route>
    </Route>
    <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
    <Route path="/block" element={<Page_per/>} />
    {isAuth ? <Route path="*" element={<Page_per /> }/> :
              <Route path="*" element={<Login setIsAuth={setIsAuth} />}/>    }


    </Routes>


    </AnimatePresence>

    )

}

export default AnimateRoutes 