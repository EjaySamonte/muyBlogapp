import React from 'react';
import { logoutUser } from '../features/auth/authService';

export default function Logout() {
  const isLogout = async () => {
    const success = await logoutUser();
    console.log("Logged out:", success);
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={isLogout}>Logout</button>
    </div>
  );
}