import React from 'react'
import { useRef } from 'react';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintIcon from '@mui/icons-material/Print';
import { WhatsappShareButton, WhatsappIcon, EmailShareButton, EmailIcon } from 'react-share';
import { useReactToPrint } from 'react-to-print';

function Ricevuta ()  {

    const { nome } = useParams();
    const { data } = useParams();
    const { importo } = useParams();
    const { causale } = useParams();
    const { flag } = useParams();
    const { conteggio } = useParams();
    const [cont, setCont] = React.useState(localStorage.getItem("cont"));  

    const [flagStampa, setFlagStampa] = React.useState(false);  //quando è falso si vedono le icone,
    const componentRef = useRef();  //serve per la stampa

    const string = "https://ricevuta-ada77.web.app/ricevuta/"+data+"/"+nome+"/"+importo+"/"+causale+"/"+flag+"/"+conteggio;
    const url = string.replace(/ /g, '%20');  //conversione da stringa a url

    let navigate = useNavigate();
  
    const buttonStyle = {
        width: '80%', // Personalizza la larghezza del bottone
        height: "120px",
        marginBottom: "20px",
        textColor: "#333"
      };
    
//_________________________________________________________________________________________________________________
  //stampa
 const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'emp-data',
    onAfterPrint: () => setFlagStampa(false)
  })
  
  const print = async () => {
    setFlagStampa(true);
    setTimeout(function(){
      handlePrint();
    },1);
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
      <p className='navText'> Ricevuta </p>
      </div>
      </div>

      <motion.div
        initial= {{x: "-100vw"}}
        animate= {{x: 0}}
        transition={{ duration: 0.4 }}>

      <div  className='container' style={{marginTop: "70px"}}>

      <button onClick={print}>Stampa </button>
      <WhatsappShareButton url={url}>
        <WhatsappIcon type="button" size={40} round={true} />
    </WhatsappShareButton>
    <EmailShareButton url={url}>
        <EmailIcon type="button" size={40} round={true} />
    </EmailShareButton>

{/***************************ENTRATE************************ */}
    {flag == 1 &&
    <>
      <div ref={componentRef} className='stampRice' style={{ background: "white", textAlign:"center", color:"black", overflowY: "auto", overflowX: "hidden", maxHeight:"95%", fontFamily:"Roboto"}}> 
      <h2 style={{paddingTop:"15px"}}> <b>Chiesa Cristiana Evangelica ADI Caivano</b></h2>
      <div className='row' style={{marginTop:"30px"}}>
        <div className='col-2'>  </div>
        <div className='col' style={{textAlign: "left"}}>
        <h5 style={{textAlign: "left", position: "relative", right: "30px"}} ><b>N. {conteggio}</b> </h5> 
            <h5 >Ricevo dal Sig. <b>{nome}</b>   </h5>
            <h5 >la somma di € <b>{importo}</b></h5>
            <h5 > per: {causale}</h5>
        </div>
        <div  className='col-3'> </div>

        <div className='row' style={{marginTop: "30px"}}>
            <div className='col-8' style={{paddingLeft: "50px"}}>
            <h6 style={{textAlign:"left"}}> {data} </h6>
            </div>
            <div className='col' style={{marginLeft: ""}}>
            <h6 style={{textAlign:"center"}}> <b>Il Tesoriere</b>  </h6>
            <h6 style={{textAlign:"center", paddingBottom: "20px"}}> Mario Castaldo  </h6>
            </div>
        </div>
      </div>
      </div>
      </>
    }

{/********************************USCITE************************ */}
    {flag == 0 && 
    <>
    <div ref={componentRef} style={{ background: "white", textAlign:"center", color:"black", overflowY: "auto", overflowX: "hidden", maxHeight:"95%", fontFamily:"Roboto" }}> 
      <h2 style={{paddingTop:"15px"}}> <b>Chiesa Cristiana Evangelica ADI Caivano</b></h2>
      <div className='row' style={{marginTop:"30px"}}>
      <div className='col-2'>  </div>
        <div className='col' style={{textAlign: "left"}}>
        <h5 style={{textAlign: "left", position: "relative", right: "30px"}}> <b>N. {conteggio}</b></h5> 
            <h5 >Ricevo dal Tesoriere <b>Mario Castaldo</b></h5>
            <h5 >la somma di € <b>{importo}</b></h5>
            <h5 > per: {causale}</h5>
        </div>
        <div className='col-2'></div>

        <div className='row' style={{marginTop: "30px"}}>
            <div className='col-8' style={{paddingLeft: "50px"}}>
            <h6 style={{textAlign:"left"}}> {data} </h6>
            <h6 style={{textAlign:"left"}}> Il ricevente: {nome} </h6>
            </div>
            <div className='col' style={{paddingLeft: "30px"}}>
            <h6 style={{textAlign:"center"}}> <b>Il Tesoriere</b> </h6>
            <h6 style={{textAlign:"center", paddingBottom: "20px"}}> Mario Castaldo  </h6>
            </div>
        </div>
      </div>
      </div>
      </>
    }
      </div>

      </motion.div>
        </>
    )

}

export default Ricevuta 