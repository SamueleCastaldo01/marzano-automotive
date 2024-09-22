import { Outlet, Navigate } from 'react-router-dom'
import { tutti, dipen, guid, supa } from './utenti';


export function PrivateRoutes ({isAuth})  {
    return(
        isAuth ? <Outlet/> : <Navigate to="/login"/>
    );
}

export function PrivatePerm({}) {
    let ta= tutti.includes(localStorage.getItem("uid"))  //se trova id esatto nell'array rispetto a quello corrente, ritorna true
    return (
        ta ? <Outlet/> : <Navigate to="/block"/>
    );
}
