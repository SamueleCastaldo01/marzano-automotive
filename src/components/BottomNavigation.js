import React from 'react'
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate} from "react-router-dom";
import moment from 'moment/moment';
import 'moment/locale/it'
import Paper from '@mui/material/Paper';
import MuiBottomNavigationAction from "@mui/material/BottomNavigationAction";
import { BottomNavigation } from '@mui/material';
import { styled } from "@mui/material/styles";
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';



function BottomNavi ()  {
    
    const navigate = useNavigate();

    const location = useLocation();
    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

    const timeElapsed = Date.now();  //prende la data attuale in millisecondi
    const today = new Date(timeElapsed);    //converte nel tipo data
    var formattedDate = moment(today).format('DD-MM-YYYY');  //coverte nel formato richiesto
    localStorage.setItem("today", formattedDate);
    const [todayC, setTodayC] = useState(localStorage.getItem("today"));  //variabile che andiamo ad utilizzare

    const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
    color: #f6f6f6;
  `);
  





return (

<Paper  sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
<BottomNavigation 
        sx={{
      bgcolor: '#333',
      '& .Mui-selected': {
      '& .MuiBottomNavigationAction-label': {
        fontSize: theme => theme.typography.caption,
        transition: 'none',
        fontWeight: 'bold',
        lineHeight: '20px'
      },
      '& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label': {
        color: theme => theme.palette.primary.main
        }}}} showLabels>
        <BottomNavigationAction
          component={Link}
          className="linq"
          value="home"
          to="/"
           label="Home"
        icon={<HomeIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />}
           />
        <BottomNavigationAction
          component={Link}
          className="linq"
          value="profilo"
          to="/profilo"
          label="Profilo"
          icon={<PersonIcon color={(location.pathname === '/profilo' || location.pathname === '/login') ? 'primary' : 'inherit'} />}
           />
        <BottomNavigationAction
          component={Link}
          className="linq"
          value="riepilogo"
          to="/riepilogo"
           label="Riepilogo" 
           icon={<HistoryIcon color={(location.pathname === '/riepilogo') ? 'primary' : 'inherit'} />}
           />

</BottomNavigation>
</Paper>

    )

}

export default BottomNavi 