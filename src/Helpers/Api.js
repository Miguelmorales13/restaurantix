import axios from "axios";
import { urlServer } from "@/Helpers/Globales";
import { getToken } from "@/Helpers/TokenValid";

export const AGet = type => {
  return axios.get(`${urlServer}/api/${type}`, {
  // return axios.get(`http://192.168.1.106:3001/api/${type}`, {
    headers: {
      Authorization: getToken()
    }
  });
};
export const Apost = (type, data) => {
  return axios.post(`${urlServer}/api/${type}`, data, {
  // return axios.post(`http://192.168.1.106:3001/api/${type}`, data, {
    headers: {
      Authorization: getToken()
    }
  });
};
export const Aput = (type, id, data) => {
  return axios.put(`${urlServer}/api/${type}/${id}`, data, {
  // return axios.put(`http://192.168.1.106:3001/api/${type}/${id}`, data, {
    headers: {
      Authorization: getToken()
    }
  });
};
export const Adelete = (type, id) => {
  return axios.delete(`${urlServer}/api/${type}/${id}`, {
  // return axios.delete(`http://192.168.1.106:3001/api/${type}/${id}`, {
    headers: {
      Authorization: getToken()
    }
  });
};
