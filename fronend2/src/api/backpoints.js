import axios from 'axios';

const BASE_URL = "http://127.0.0.1:3000/api/";

const LOGIN_URL = `${BASE_URL}login`;
const SIGNUP_URL = `${BASE_URL}signup`;
const AUTOLOGIN_URL = `${BASE_URL}auto_login`;


export const login = async (email, password) => {
    const resopnse = await axios.post(LOGIN_URL, {email, password})
    return resopnse.data
};

export const signup = async (email, user_name, age, gender, password, phone_num, address, user_img) => {
    const resopnse = await axios.post(SIGNUP_URL, {
        email, 
        user_name, 
        age, gender, 
        password, 
        phone_num, 
        address, 
        user_img
    })
    return resopnse.data
};

export const auto_login = async (token) =>{
    const resopnse = await fetch (AUTOLOGIN_URL, {
        method: 'GET',
        headers: {
            'Content-type': "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    return resopnse.json();
};