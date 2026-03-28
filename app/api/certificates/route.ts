import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

async function ensureUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>,
) {
  const { error } = await supabase.from("user_profiles").upsert(
    { id: user.id, email: user.email ?? `${user.id}@example.com` },
    { onConflict: "id" },
  );

  return error;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("user_certificates")
      .select("*")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, reward, status, share_card_state } = await request.json();
    if (!title || !reward) {
      return NextResponse.json({ error: "title and reward are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("user_certificates")
      .insert({
        user_id: user.id,
        title,
        reward,
        status: status ?? "earned",
        share_card_state: share_card_state ?? "private",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status, share_card_state } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof status === "string") updates.status = status;
    if (typeof share_card_state === "string") updates.share_card_state = share_card_state;

    const { data, error } = await supabase
      .from("user_certificates")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

