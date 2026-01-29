import { supabase } from '../../supabase/client';

// Register
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    console.error('Registration error:', error.message);
    return null;
  }
  return data.user;
}

// Login
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
    return null;
  }
  return data.user;
}

// Logout
export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
    return false;
  }
  return true;
}