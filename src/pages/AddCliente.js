import { useState } from 'react';
import { motion } from 'framer-motion';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export function AddCliente() {
    const [gender, setGender] = useState('');

    const handleGenderChange = (event) => {
      setGender(event.target.value);
    };

    const handleSubmit = () => {
        
    }

  return (
    <>
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
                    <TextField className='w-100' id="outlined-basic" label="Username*" variant="outlined" color='tertiary'/>
                </div>
                <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                    <TextField className='w-100' id="outlined-basic" label="Nome*" variant="outlined" color='tertiary'/>
                </div>
                <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                <FormControl fullWidth color='tertiary'>
                    <InputLabel id="gender-select-label">Genere*</InputLabel>
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
                    <TextField className='w-100' id="outlined-basic" label="Data di nascita" variant="outlined" color='tertiary'/>
                </div>
                <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                    <TextField className='w-100' id="outlined-basic" label="Città di nascita" variant="outlined" color='tertiary'/>
                </div>
                <div className='mt-4 col-lg-4 col-md-6 col-sm-12'>
                    <TextField className='w-100' id="outlined-basic" label="Provincia di Nascita" variant="outlined" color='tertiary'/>
                </div>
          
            
            <div className='d-flex mt-4 gap-2'>
                <Button type='submit' variant="contained">Aggiungi</Button>
                <Button color='tertiary' variant="outlined">Resetta</Button>
            </div>
            </div>
        </form>
        </div>
        
       
      </motion.div>
    </>
  );
}
