import cookie from 'react-cookies'
import { isExpired } from "react-jwt";
import { decodeToken } from "react-jwt";

export const checkTokenValidity = ()=>{
    const token = getToken()

    const isMyTokenExpired = isExpired(token);
    
    if(token!==undefined && !isMyTokenExpired){
        return true;
    }
    else{
        return false;
    }
} 

export const getTokenData = () =>{
    const token = getToken()

    const decodedToken = decodeToken(token);
    return decodedToken;
}


export const getToken = () => {
    return cookie.load('jwt')
}