import { urlServer } from "./Globales";

//mange token
// funcion para guardar el token en storage
const setToken = token => localStorage.setItem("token", token);
// funcion para obtener el token de el storage
export const getToken = () => {
  return localStorage.getItem("token");
};
// funcion para eliminar el token de la sesion
const removeToken = () => {
  localStorage.removeItem("token");
};
// funcion para validar si el tken es valido o no
export const isValidToken = token => {
  if (token) {
    const payload = handlePayload(token);
    return payload && payload.iss === `${urlServer}/api/auth` ? true : false;
  }
  return false;
};
// mange session
export const login = (token, cb, cbe) => {
  if (isValidToken(token)) {
    setToken(token);
    setSession(token);
    cb();
  } else {
    cbe();
  }
};
export const logout = () => {
  removeToken();
  deleteSession();
};
// ses obtiene la sesion en curso
const setSession = token => {
  const payload = handlePayload(token);
  if (payload) {
    if (payload.data) {
      localStorage.setItem("user", JSON.stringify(payload.data));
    }
  }
};
// si es super usuario
export const isSuperSu = () => {
  return (
    isValidToken(getToken()) && getAnyUser("rol") === "Super administrador"
  );
};
// se obtiene el usuario
export const getSession = () => {
  return JSON.parse(localStorage.getItem("user"));
};
// funcion para obtener alguna parte en especifico del usuaipren la sesion
export const getAnyUser = type => {
  // eslint-disable-next-line
  const user = JSON.parse(localStorage.getItem('user'));
  const evaluacion = `user.${type}`;
  // eslint-disable-next-line
  return eval(evaluacion)
};
const deleteSession = () => localStorage.removeItem("user");
// helpers
// obtiene el token y lo valida
const handlePayload = token => {
  const payload = token.split(".")[1];
  return decode(payload);
};
// decodifica el token
const decode = payload => {
  return JSON.parse(atob(payload));
};
