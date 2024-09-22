import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Homepage ()  {

    const [flagCont, setFlagCont] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    localStorage.setItem("naviBottom", 0);

    let navigate = useNavigate();
  
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const buttonStyle = {
        width: '80%', // Personalizza la larghezza del bottone
        height: "120px",
        marginBottom: "20px",
        textColor: "#333"
      };

    return (
        <>
{/**************NAVBAR MOBILE*************************************** */}


      <motion.div
        initial= {{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 0.7 }}>
      <div>
        <h1>Ciao sono entrato</h1>
      </div>

      </motion.div>
        </>
    )

}

export default Homepage 
