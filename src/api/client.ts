import axios, { type InternalAxiosRequestConfig } from "axios";

const API_URL = import.meta.env.VITE_API_ENDPOINT || 'https://mini-instagram-api.mistcloud.workers.dev'

export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const api_token = sessionStorage.getItem("api-key");

    if(api_token){
        config.headers['x-api-key'] = api_token;
    }
    return config;
})