import { motion } from "framer-motion";

export function UserSchedeDiLavoro() {
    return(
        <>
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center">
        <h2>Schede di lavoro</h2>
        </div>
      </motion.div>
        
        </>
    )
}