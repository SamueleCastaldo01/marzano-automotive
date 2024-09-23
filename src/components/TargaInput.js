import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";

const TargaInput = ({
  targa,
  setTarga,
  handleTargaChange,
  handleCercaVeicolo,
  loading,
  veicoloTrovato,
  messaggio,
  recentTarghe,
}) => {
  return (
    <>
      <div className="mt-4 d-flex">
        <Autocomplete
          options={recentTarghe}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Targa"
              variant="outlined"
              onChange={(e) => handleTargaChange(e.target.value)}
              style={{ marginRight: "10px", width: "200px" }}
            />
          )}
          value={targa}
          onInputChange={(event, newInputValue) => {
            handleTargaChange(newInputValue);
          }}
          freeSolo
        />
        <Button
          className="me-2"
          variant="contained"
          color="primary"
          onClick={handleCercaVeicolo}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Cerca"}
        </Button>
        {veicoloTrovato && (
          <Button
            variant="contained"
            color="success"
            style={{ backgroundColor: "#07BC0C" }}
          >
            Crea Scheda
          </Button>
        )}
      </div>
      <div>
        {veicoloTrovato && (
          <Typography style={{ marginTop: "10px", color: "#07BC0C" }}>
            {messaggio}
          </Typography>
        )}
        {!veicoloTrovato && (
          <Typography color="error" style={{ marginTop: "10px" }}>
            {messaggio}
          </Typography>
        )}
      </div>
    </>
  );
};

export default TargaInput;
