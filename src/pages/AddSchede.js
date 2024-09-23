import { motion } from "framer-motion";

export function AddSchede() {
    return(
        <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
            <div className="container-fliud">
                <h2>Aggiungi Scheda di Lavoro</h2>

                
            </div>
        </motion.div>
        </>
    )
}