import React, { ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase/client";

//you can't type it into searchbar when you aren't login with your acc

export default function ProtectRoute({ children }: { children: ReactElement }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
