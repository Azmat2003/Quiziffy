import React, {useContext} from 'react'
import { Navigate, Outlet } from 'react-router';
import AuthContext from '../context/AuthContext.js';


function ProtectedRoute() {
    const {user} = useContext(AuthContext);

    if(user){
        return <Outlet></Outlet>
    }
    else{
        return <Navigate to="/unauthorized" replace />;
    }
}

export default ProtectedRoute