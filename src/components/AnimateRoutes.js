import React from 'react'
import { useState, useEffect } from "react";
import Homepage from '../pages/Homepage'
import Login from '../pages/Login';
import { CustomerList } from '../pages/CustomerList';
import { DashboardCustomer } from '../pages/DashboardCustomer';
import { SchedeDiLavoro } from '../pages/SchedeDiLavoro';
import { AddSchede } from '../pages/AddSchede';
import AggiungiScheda from './AggiungiScheda';
import Page_per from '../pages/Page_per';
import { BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import {PrivateRoutes, PrivatePerm} from '../components/PrivateRoutes';
import { AnimatePresence } from 'framer-motion';
import moment from 'moment/moment';
import 'moment/locale/it'
import { AddCliente } from '../pages/AddCliente';



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
      {/**qui ci vanno quelli che non servono i permessi, o se ne creano degli altri */}

    <Route element={<PrivateRoutes isAuth={isAuth}/>}> 
    <Route element={<PrivatePerm/>}>

    <Route path="/" element={<Homepage />} /> 
    <Route path="/customerlist" element={<CustomerList />} /> 
    <Route path="/addcustomer" element={<AddCliente />} /> 
    <Route path="/dashboardcustomer/:id" element={<DashboardCustomer />} /> 
    <Route path="/schededilavoro" element={<SchedeDiLavoro />} /> 
    <Route path="/aggiungischeda" element={<AddSchede />} /> 
    <Route path="/aggiungischeda1/:id" element={<AggiungiScheda />} /> 

    
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