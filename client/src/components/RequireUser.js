import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { KEY_ACCESS_TOKEN, getItem } from '../utils/localStorageManagement';

function RequireUser() {
    const user = getItem(KEY_ACCESS_TOKEN);
  return (
    user ? <Outlet /> : <Navigate to="/login"/>
  )
}

export default RequireUser