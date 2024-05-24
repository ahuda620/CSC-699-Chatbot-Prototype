import React from 'react';
import { useAuthContext } from '../Hooks/useAuthContext';

const Logout = () => {
  return (
    <div>Logout</div>
  )
}

export default Logout


//Logout User Function
export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout= () => {
    //remove user info from local storage
    localStorage.removeItem('user');

    //update the auth context
    dispatch({type: 'LOGOUT'});
    window.location.reload(true);
  }

  return {logout};
}