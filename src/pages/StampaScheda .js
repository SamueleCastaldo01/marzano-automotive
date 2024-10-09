import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { db } from "../firebase-config";
import moment from "moment"; // Assicurati di avere moment.js installato

export function StampaScheda() {
    const { id } = useParams();
    const ref = useRef();
    const [infoScheda, setInfoScheda] = useState({});
    const [cliente, setCliente] = useState("");
    const [dataScheda, setDataScheda] = useState([]);
    const [pagato, setPagato] = useState("");
    const [resta, setResta] = useState(0);
    const [sconto, setSconto] = useState("");
    const [totale, setTotale] = useState(""); 
    const [chilometraggio, setChilometraggio] = useState(0);
    const [manodopera, setManodopera] = useState([
        {
            qt: "1",
            prezzo: "",
            sconto: "0",
            totale: "",
        },
    ]);

    const fetchData = async () => {
        if (!id) return;

        const docRef = doc(db, "schedaDiLavoroTab", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setInfoScheda(data);
            setPagato(data.pagato);
            
            setCliente(data.cliente);
            setResta(data.resto || 0);
            setSconto(data.sconto || 0);
            setTotale(data.totale || 0);
            setChilometraggio(data.chilometraggio || 0);
            setDataScheda(data.dataScheda || []);
            setManodopera(data.manodopera || []);
        } else {
            console.log("Nessun documento trovato!");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                <div className="mt-4 bg-white text-black p-2">
                    {/* Pulsante di Stampa posizionato esternamente */}
                    <ReactToPrint
                        trigger={() => <button className="btn btn-primary mb-4">Stampa</button>}
                        content={() => ref.current}
                    />

                    <div className="stampa px-5" ref={ref}>
                        <h1 className="mt-2">Preventivo</h1>

                        <div>
                            <p><strong>Cliente:</strong> {cliente}</p>
                            <p><strong>Data Creazione:</strong> {moment().format("DD/MM/YYYY")}</p>
                            <p><strong>Veicolo:</strong> {infoScheda.veicolo}</p>
                            <p><strong>Targa:</strong> {infoScheda.targa}</p>
                            <p><strong>Chilometraggio:</strong> {chilometraggio} km</p>
                        </div>

                        <h2>Dettagli Scheda</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Descrizione</th>
                                    <th>Prezzo</th>
                                    <th>Qt</th>
                                    <th>Sconto</th>
                                    <th>Totale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataScheda.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.descrizione || ""}</td>
                                        <td>{item.prezzo || ""}</td>
                                        <td>{item.qt || "1"}</td>
                                        <td>{item.sconto || "0"}</td>
                                        <td>{item.totale || ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <h2>Manodopera</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Prezzo</th>
                                    <th>Qt</th>
                                    <th>Sconto</th>
                                    <th>Totale</th>
                                </tr>
                            </thead>
                            <tbody>
                                {manodopera.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.prezzo || ""}</td>
                                        <td>{item.qt || ""}</td>
                                        <td>{item.sconto || ""}</td>
                                        <td>{item.totale || ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div>
                            <p><strong> Totale:</strong> {totale}</p>
                            <p><strong> Pagato:</strong> {pagato}</p>
                            <p><strong>Resto:</strong> {resta}</p>
                            <p><strong>Sconto:</strong> {sconto}</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
