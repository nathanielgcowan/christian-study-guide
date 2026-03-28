import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { canManageUser } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const allowed = await canManageUser(userId);
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
    );

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete account";

    console.error("Delete account error:", error);
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 },
    );
  }
}
