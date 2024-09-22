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
    <div className='navMobile row'>
      <div className='col-2'>
      </div>
      <div className='col' style={{padding: 0}}>
      <p className='navText'> Ricevuta Veloce </p>
      </div>
      </div>

      <motion.div
        initial= {{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 0.7 }}>
      <div className='container' style={{textAlign: "center", marginTop: "160px"}}>

      <div >
      <Button variant="contained" color='secondary' style={buttonStyle} onClick={() => { setTimeout(function() {navigate("/entrate"+"/"+1);}, 160);}}>Entrate</Button>
      </div>

      <div >
      <Button variant="contained" color='secondary' style={buttonStyle}  onClick={() => {setTimeout(function() {navigate("/entrate"+"/"+0);}, 160);}}>Uscite</Button>
      </div> 

      <div >
      <Button variant="contained" color='secondary' style={buttonStyle} onClick={() => {setTimeout(function() {navigate("/riepilogo");}, 160);}}>Riepilogo</Button>
      </div>


      <div >
      <Button variant="contained" color='error'  onClick={() => {setFlagCont(true);}}>Azzera contatore</Button>
      </div>
      <div style={{marginTop: "10px"}}>
      {flagCont == true && 
      <>
       <Button className='me-2' variant="contained" color='error'  onClick={() => {setFlagCont(false);}}>No</Button>
      <Button variant="contained" color='success'  onClick={() => {handleClickOpen(); setFlagCont(false);}}>SI</Button>
      </>
      }
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Attenzione!!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sei sicuro di voler azzerare il conteggio della ricevuta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={() => {localStorage.setItem("cont", "0"); setFlagCont(false); handleClose()}} autoFocus>
            Si
          </Button>
        </DialogActions>
      </Dialog>


      </div>

      </motion.div>
        </>
    )

}

export default Homepage 
