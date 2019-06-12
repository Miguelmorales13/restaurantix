export const urlServer = "https://restaurantix.herokuapp.com";
export const App = "Restaurantix";
import toastr from "toastr";
import { logout } from "./TokenValid";

export const managementErrors = (error) => {
  if (error.response && error.response.data) {
    if (error.response.data.message) toastr.info(error.response.data.message);
    if (error.response.data.error) toastr.info(error.response.data.error);
    if (error.response.data.errors) {
      if (error.response.data.errors._shop){
        toastr.info('Seleccione una tienda en caso de ser administrador de alguna');
      } else{
        toastr.info('Error desconocido');
        
      }
      
    }
  } else {
    toastr.error("error desconocido");
  }
  if (error.response.status === 401){
    window.history.go(0)
    logout()
    toastr.info('Sesion teminada');
  }
};
export const sendNotification=(title,body)=>{
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title,body)
  }
}
export const getTheme=()=>{
  const theme =localStorage.getItem('theme')
  if (theme === null || theme ===undefined){
    setTheme(false)
    return false
  }
  return theme
}
export const setTheme=theme=>{
  return localStorage.setItem('theme',theme)
}