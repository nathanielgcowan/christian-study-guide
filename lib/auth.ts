import { createClient as createBrowserClient } from "@/lib/supabase/client";

// Client-side auth helpers
export function useAuthClient() {
  const supabase = createBrowserClient();

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  };

  const getSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    getSession,
    getUser,
  };
}
