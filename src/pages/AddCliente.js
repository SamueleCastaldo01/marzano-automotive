import { useState } from 'react';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { db } from '../firebase-config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';
import CodiceFiscale from 'codice-fiscale-js';
import { notifyErrorAddCliente, notifyErrorAddUsername, successAddCliente } from '../components/Notify';

export function AddCliente() {
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [dataNascita, setDataNascita] = useState('');
    const [cittaNascita, setCittaNascita] = useState('');
    const [provinciaNascita, setProvinciaNascita] = useState('');
    const [codiceFiscale, setCodiceFiscale] = useState('');
    const [telefono, setTelefono] = useState(''); // Stato per il numero di telefono
    const [email, setEmail] = useState(''); // Stato per l'email

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleReset = () => {
        setUsername("");
        setPassword("");
        setNome("");
        setCognome("");
        setGender("");
        setDataNascita("");
        setCittaNascita("");
        setProvinciaNascita("");
        setCodiceFiscale(""); // Reset del codice fiscale
        setTelefono(""); // Reset del numero di telefono
        setEmail(""); // Reset dell'email
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Controlla se lo username esiste già
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
            notifyErrorAddUsername();
            return;
        }

        // Formatta la data di nascita
        const formattedDataNascita = moment(dataNascita).format('DD-MM-YYYY');

        // Aggiungi il cliente al database
        try {
            await addDoc(collection(db, 'customersTab'), {
                username,
                password, // Assicurati di gestire la sicurezza della password
                nome,
                cognome,
                gender,
                dataNascita: formattedDataNascita,
                cittaNascita,
                provinciaNascita,
                codiceFiscale,
                telefono, // Aggiungi il numero di telefono
                email, // Aggiungi l'email
            });
            handleReset();
            successAddCliente();
        } catch (error) {
            console.error('Errore nell\'aggiunta del cliente: ', error);
        }
    };

    const checkUsernameExists = async (username) => {
        const q = query(collection(db, 'customersTab'), where('username', '==', username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

    const generateCodiceFiscale = (nome, cognome, dataNascita, sesso, comune) => {
        const cf = CodiceFiscale.fromData({
            nome,
            cognome,
            data: dataNascita, // Assicurati che sia in formato 'YYYY-MM-DD'
            sesso, // 'M' per maschio, 'F' per femmina
            comune: {
                nome: comune.nome,
                codice: comune.codice // Codice catastale
            }
        });
        return cf;
    };

    const handleCf = () => {
        const sesso = gender === "maschio" ? "M" : "F";
        const comune = {
            nome: cittaNascita,
            codice: 'F104' // Sostituisci con il codice corretto per il tuo comune
        };

        try {
            const cf = generateCodiceFiscale(nome, cognome, dataNascita, sesso, comune);
            setCodiceFiscale(cf);
        } catch (error) {
            console.error('Errore nella generazione del codice fiscale: ', error);
        }
    };

    const handleGeneratePassword = () => {
        const length = 10; // Lunghezza massima
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const upperCharset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numberCharset = "0123456789";
        
        let password = "";

        // Aggiungi una lettera maiuscola
        password += upperCharset.charAt(Math.floor(Math.random() * upperCharset.length));

        // Aggiungi un numero
        password += numberCharset.charAt(Math.floor(Math.random() * numberCharset.length));

        // Completa la password con caratteri casuali fino a raggiungere la lunghezza desiderata
        for (let i = 2; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        // Mescola la password
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        setPassword(password);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
        >
            <div className='container-fluid'>
                <h2>Aggiungi un nuovo Cliente</h2>

                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Username" variant="outlined" color='tertiary' value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className='d-flex mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Password" variant="outlined" color='tertiary' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button onClick={handleGeneratePassword} variant="contained">Genera</Button>    
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='number' required label="Numero di Telefono" variant="outlined" color='tertiary' value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Nome" variant="outlined" color='tertiary' value={nome} onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' required label="Cognome" variant="outlined" color='tertiary' value={cognome} onChange={(e) => setCognome(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <FormControl fullWidth color='tertiary'>
                                <InputLabel id="gender-select-label">Genere</InputLabel>
                                <Select
                                    labelId="gender-select-label"
                                    id="gender-select"
                                    value={gender}
                                    label="Genere"
                                    onChange={handleGenderChange}
                                >
                                    <MenuItem value="maschio">Maschio</MenuItem>
                                    <MenuItem value="femmina">Femmina</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' type='date' label="Data di nascita" variant="outlined" color='tertiary' value={dataNascita} onChange={(e) => setDataNascita(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Città di nascita" variant="outlined" color='tertiary' value={cittaNascita} onChange={(e) => setCittaNascita(e.target.value)} />
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Provincia di nascita" variant="outlined" color='tertiary' value={provinciaNascita} onChange={(e) => setProvinciaNascita(e.target.value)} />
                        </div>
                        <div className='d-flex mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Codice Fiscale" variant="outlined" color='tertiary' value={codiceFiscale} onChange={(e) => setCodiceFiscale(e.target.value)} />
                            <Button onClick={handleCf} variant="contained">Genera</Button>    
                        </div>
                        <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                            <TextField className='w-100' label="Email" variant="outlined" color='tertiary' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <Button className='mt-4' type="submit" variant="contained">Aggiungi Cliente</Button>
                </form>
            </div>
        </motion.div>
    );
}
