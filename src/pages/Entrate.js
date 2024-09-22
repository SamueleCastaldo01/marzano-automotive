import React from 'react'
import { auth, db } from "../firebase-config";
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, serverTimestamp, limit, getDocs, getCountFromServer} from 'firebase/firestore';
import { useNavigate, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { clear } from '@testing-library/user-event/dist/clear';

function Entrate ({dataOdi})  {
    const { flag } = useParams();

    const [currrentData, setCurrentData] = React.useState(serverTimestamp());
    const [data, setData] = React.useState(dataOdi);
    const [nome, setNome] = React.useState("");
    const [importo, setImporto] = React.useState("");
    const [causale, setCausale] = React.useState("");
    

    const [flagConferma, setFlagConferma] = React.useState(false);

    let navigate = useNavigate();

    const buttonStyle = {
        width: '80%', // Personalizza la larghezza del bottone
        height: "120px",
        marginBottom: "20px"
      };


      const handleClear = async () => {  
        setNome("");
        setImporto("");
        setCausale("");
      }

//conferma***************************************************************
      const conferma = async () => {  
        if (!nome || !importo || !causale) {  //coontrollo dei campi
        setFlagConferma(true)
            return
        }  
         //salva i dati in locale   in realtà non lo vado ad utilizzare questa cosa
        localStorage.setItem("nome", nome);
        localStorage.setItem("importo", importo);
        localStorage.setItem("causale", causale);
        if(localStorage.getItem("cont") == null) {   //se non esiste allora lo inizializza a 0
            localStorage.setItem("cont", "0");
        }
        var numero = parseInt(localStorage.getItem("cont"), 10);  //conversione da stringa a numero
        localStorage.setItem("cont", numero +1); // aggiorna il contatore

        await addDoc(collection(db, "ricevuta"), {  //aggiunta dei dati nel database
            nome,
            data,
            causale,
            importo,
            cont : localStorage.getItem("cont"),
            flag,
            currrentData
          });
          //entrata
          {flag ==1 && 
            navigate('/ricevuta/'+data+"/"+nome+"/"+importo+"/"+causale+"/"+1+"/"+localStorage.getItem("cont"));
        }
        //uscita
        {flag ==0 && 
            navigate('/ricevuta/'+data+"/"+nome+"/"+importo+"/"+causale+"/"+0+"/"+localStorage.getItem("cont"));
        }
      }

    return (
        <>
{/**************NAVBAR MOBILE*************************************** */}
    <div className='navMobile row'>
      <div className='col-2'>
      <IconButton className="buttonArrow" aria-label="delete" sx={{ color: "#cab497", marginTop: "7px" }}
        onClick={ ()=> {navigate(-1); }}>
        <ArrowBackIcon sx={{ fontSize: 30 }}/>
      </IconButton>
      </div>
      <div className='col' style={{padding: 0}}>
      {flag == 1 ? <p className='navText'> Entrate </p> : <p className='navText'> Uscita </p>}
      
      </div>
      </div>
{/***************************************************** */}

      <motion.div
        initial= {{x: "-100vw"}}
        animate= {{x: 0}}
        transition={{ duration: 0.6 }}>


      <div className='container' style={{textAlign: "center", marginTop: "130px"}}>
      <Button style={{float: "right"}}  onClick={() => { handleClear();}} variant="outlined" size='large'> clear </Button>
  
      <div className="input_container">

      <h5 style={{textAlign: "left"}}>Data: {data}</h5>

      <TextField className='inp mt-2' label="Nome" variant="outlined" autoComplete='off' value={nome} 
        onChange={(e) => setNome(e.target.value)}/>

      <TextField className='inp mt-3' type="number"                 
        inputProps={{
                  step: 0.01,
                }}  label="Importo" variant="outlined" autoComplete='off' value={importo} 
        onChange={(e) => setImporto(e.target.value)}
        InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
        />

    <TextField className='inp mt-3' label="Causale" multiline value={causale}  rows={4} variant="outlined"
    onChange={(e) => setCausale(e.target.value)}
    />
      </div>

      <Button onClick={() => { conferma();}} variant="contained" size='large'> Conferma </Button>

      {flagConferma == true &&
    <h5 style={{color: "red", marginTop: "50px" ,textAlign: "center"}}> Inserisci tutti i campi correttamente pls</h5>
    }


      </div>
      
      </motion.div>
        </>
    )

}

export default Entrate 