import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {collection, deleteDoc, doc, onSnapshot ,addDoc ,updateDoc, query, orderBy, where, serverTimestamp, limit, getDocs, getCountFromServer} from 'firebase/firestore';
import { auth, db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Riepilogo ()  {
  localStorage.setItem("naviBottom", 2);
    let navigate = useNavigate();
    const [todos, setTodos] = React.useState([]);
    const [Progress1, setProgress1] = React.useState(false);

    const [flagDelete, setFlagDelete] = React.useState(false);
    const [flagCont, setFlagCont] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const [searchTerm, setSearchTerm] = useState("");  //search
    const inputRef= useRef();

    const buttonStyle = {
        width: '80%', // Personalizza la larghezza del bottone
        height: "120px",
        marginBottom: "20px"
      };
  

      const navi = (data, nome, cont, importo, flag, causale) => {
        navigate('/ricevuta/'+data+"/"+nome+"/"+importo+"/"+causale+"/"+flag+"/"+cont);
    } 

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };



    //cronologia Ricevuta
    React.useEffect(() => {
      localStorage.setItem("naviBottom", 2);
      console.log("Sono entrato nel riepilogo")
      const collectionRef = collection(db, "ricevuta");
      const q = query(collectionRef, orderBy("currrentData", "desc") , limit(50));
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        let todosArray = [];
        querySnapshot.forEach((doc) => {
          todosArray.push({ ...doc.data(), id: doc.id });
        });
        setTodos(todosArray);
        setProgress1(true)
      });
      return () => unsub();
  
    }, []);


//**************************************************************************** */
const handleDelete = async (id) => {
  await deleteDoc(doc(db, "ricevuta", id));
};

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
      <div className='col-3' style={{padding: 0}} onClick={() => { setFlagDelete(!flagDelete) }}>
      <p className='navText'> Riepilogo </p>
      </div>
      <div className='col'>
      <TextField
      inputRef={inputRef}
      className="inputSearchNav"
      onChange={event => {setSearchTerm(event.target.value)}}
      type="text"
      placeholder="Ricerca Ricevuta"
      InputProps={{
      startAdornment: (
      <InputAdornment position="start">
      <SearchIcon color='primary'/>
      </InputAdornment>
                ),
                }}
       variant="outlined"/>
      </div>
      </div>

      <motion.div
        initial= {{x: "-100vw"}}
        animate= {{x: 0}}
        transition={{ duration: 0.6 }}>



<div class="wrapper">
      {todos.filter((val)=> {
        if(searchTerm === ""){
          return val
      } else if (val.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||  val.cont.toLowerCase().includes(searchTerm.toLowerCase()) ||  val.data.toLowerCase().includes(searchTerm.toLowerCase())  ) {
        return val
                }
            }).map((todo) => (
    <div key={todo.id}>
    {Progress1 == false && 
  <div style={{marginTop: "100px"}}>
      <CircularProgress />
  </div>
      }

    <div className="colla">
                <hr style={{margin: "0"}}/>
                <div className="row ">
                    <div className="col-3" style={{padding: "0px"}}  onClick={() => { navi(todo.data, todo.nome, todo.cont, todo.importo, todo.flag, todo.causale) }}>
                        <div className="caption">
                        <div className="tex">{todo.cont}</div>
                        </div>
                           </div>

                    <div className="col" style={{padding: "0px"}}  onClick={() => { navi(todo.data, todo.nome, todo.cont, todo.importo, todo.flag, todo.causale) }}>
                    {todo.nome.length < 20 ? <h5 className="text colla" style={{textAlign: "left", fontSize: "18px"}} > {todo.nome} </h5> :
                    <h5 className="text colla" style={{textAlign: "left", fontSize: "18px"}} > {todo.nome.substr(0, 20)}.. </h5>}
                         
                    </div>


                    <div className="col-1" style={{padding: "0px"}}  onClick={() => { navi(todo.data, todo.nome, todo.cont, todo.importo, todo.flag, todo.causale) }}>
                    {todo.flag == 1 ? <h5 className="text colla" style={{textAlign: "", fontSize: "18px"}} > E </h5> :
                    <h5 className="text colla" style={{textAlign: "", fontSize: "18px"}} > U </h5>  }
                    </div>

                    <div className="col-1" style={{padding: "0px", marginRight: "30px"}}  onClick={() => { navi(todo.data, todo.nome, todo.cont, todo.importo, todo.flag, todo.causale) }}> 
                    <NavigateNextIcon fontSize="large" color="primary"/></div>

                  {flagDelete == true && 
                    <div className="col-2" style={{padding: "0px"}}>
                    <button className="button-delete" type="button"  
                    onClick={() => {handleClickOpen(); localStorage.setItem("deleteRice", todo.id); }}>
                    <DeleteIcon id="i" />
                    </button>
                    </div>
                  }


                </div>
                </div>

    </div>
  ))}
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
            Sei sicuro di voler eliminare la ricevuta?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={() => {handleDelete(localStorage.getItem("deleteRice")); handleClose()}} autoFocus>
            Si
          </Button>
        </DialogActions>
      </Dialog>

      </motion.div>
        </>
    )

}

export default Riepilogo 