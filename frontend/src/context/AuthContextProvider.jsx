import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import AuthContext from "./AuthContext.js";

function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getProfile = async () => {
        try {
            const api = `${import.meta.env.VITE_BACKEND_BASE_URL}/user/profile`;
            console.log(api);
            const options = {
                method: "GET",
                credentials: "include",
            };
            const res = await fetch(api, options);
            const data = await res.json();

            if(!res.ok){
                throw new Error("Cannot fetch details");
            }
            if(data){
                setUser(data.user);
            }
        }
        catch (err) {
            // console.log(err.message);
            setUser(null);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    // LOGOUT
    async function logout(){
        console.log("logging out");
        try{
            console.log("start");
            
            const api = `${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`;
            const res = await fetch(api, {
                method : "POST",
                credentials : "include"
            })

            console.log("Make logout call")

            if(!res.ok){
                throw new Error("Logging Out");
            }

            setUser(null);
            navigate('/');
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                logout,
                setUser,
                getProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
