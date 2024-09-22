import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import {signOut} from "firebase/auth";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Profilo ()  {

    let navigate = useNavigate();
    localStorage.setItem("naviBottom", 1);

    const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));

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
      //______________________________________________________________________________________________________________
    //signOut
    const signUserOut = () => {
        signOut(auth).then(() => {
          localStorage.setItem("isAuth", false);
          setIsAuth(false);
        })
      };

    const buttonStyle = {
        width: '80%', // Personalizza la larghezza del bottone
        height: "120px",
        marginBottom: "20px"
      };

    return (
        <>
{/**************NAVBAR MOBILE*************************************** */}
    <div className='navMobile row'>
      <div className='col-2'>
      </div>
      <div className='col' style={{padding: 0}}>
      <p className='navText'> Profilo </p>
      </div>
      </div>

      <motion.div
        initial= {{opacity: 0}}
        animate= {{opacity: 1}}
        transition={{ duration: 0.7 }}>
      <div className='container' style={{textAlign: "center", marginTop: "160px"}}>

      <div >
      <Button variant="contained" color='secondary' style={buttonStyle} onClick={() => {navigate("/login");}}>Login</Button>
      </div>

      <div >
      <Button variant="contained" color='error' style={buttonStyle} onClick={() => { signUserOut(); navigate("/login");}}>Disconetti</Button>
      </div>
      </div>

      </motion.div>
        </>
    )

}

export default Profilo 