import { Outlet, Navigate } from 'react-router-dom'
import { tutti, dipen, guid, supa } from './utenti';


export function PrivateRoutes ({isAuth})  {
    return(
        isAuth ? <Outlet/> : <Navigate to="/login"/>
    );
}

export function PrivateRoutesUser ({isAuthUser})  {
    console.log(isAuthUser);
    return(
        isAuthUser ? <Outlet/> : <Navigate to="/loginuser"/>
    );
}

export function PrivatePerm({}) {
    let ta= tutti.includes(localStorage.getItem("uid"))  //questo è un ulteriore controllo, solo per gli utenti supervisori, per i permessi
    return (
        ta ? <Outlet/> : <Navigate to="/block"/>
    );
}
