import { motion } from "framer-motion";
import { NavMobile } from "../components/NavMobile";

export function UserSchedeDiLavoro() {
    return(
        <>
         <NavMobile />
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
       
        <div className="text-center" style={{marginTop: "110px"}}>
        <h1>Schede di lavoro</h1>
        </div>
      </motion.div>
        
        </>
    )
}