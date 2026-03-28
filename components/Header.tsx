import { getCurrentUser, isCurrentUserAdmin } from "@/lib/auth-server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const user = await getCurrentUser();
  const admin = user ? await isCurrentUserAdmin() : false;

  return <HeaderClient initialSignedIn={Boolean(user)} initialIsAdmin={admin} />;
}
