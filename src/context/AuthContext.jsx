import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId) => {
    if (!userId) { setProfile(null); return; }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      console.warn("Profile error:", error);
      setProfile(null);
    } else {
      setProfile(data ?? null);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        // 🔑 1) fijá sesión
        setSession(data?.session ?? null);
        // 🔑 2) destrabá loading YA
        setLoading(false);
        // 🔑 3) perfil en paralelo
        loadProfile(data?.session?.user?.id);
      } catch (e) {
        console.error("init error", e);
        setLoading(false);
      }
    })();


    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_evt, newSession) => {

      setSession(newSession ?? null);
      setLoading(false);
      loadProfile(newSession?.user?.id);
    });

    const onVisible = async () => {
      if (document.visibilityState !== "visible") return;
      const { data } = await supabase.auth.getSession();
      setSession(data?.session ?? null);
      setLoading(false);
      loadProfile(data?.session?.user?.id);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { data: null, error };
    setSession(data.session);
    setLoading(false);
    loadProfile(data.session?.user?.id);
    return { data, error: null };
  };

  const signUp = async ({ email, password, nombre }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });
    if (error) return { data: null, error };
    if (data?.session) {
      setSession(data.session);
      setLoading(false);
      loadProfile(data.session?.user?.id);
    }
    return { data, error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthCtx.Provider
      value={{ session, user: session?.user ?? null, profile, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
