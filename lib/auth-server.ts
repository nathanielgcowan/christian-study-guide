import { createClient as createServerClient } from "@/lib/supabase/server";
import { UserProfile } from "@/lib/types/database";

// Server-side auth helpers
export async function getCurrentUser() {
  const supabase = await createServerClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data as UserProfile;
}

export async function updateUserProfile(
  updates: Partial<UserProfile>,
): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data as UserProfile;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === "admin" || profile?.role === "super_admin";
}

export async function canManageUser(targetUserId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  if (user.id === targetUserId) return true;

  return isCurrentUserAdmin();
}
