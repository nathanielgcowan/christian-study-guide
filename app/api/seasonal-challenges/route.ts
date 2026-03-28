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
      .from("user_seasonal_challenge_progress")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

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

    const {
      challenge_title,
      challenge_season,
      status,
      progress_note,
      reward_claimed,
      last_completed_at,
    } = await request.json();
    if (!challenge_title) {
      return NextResponse.json({ error: "challenge_title is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("user_seasonal_challenge_progress")
      .upsert(
        {
          user_id: user.id,
          challenge_title,
          challenge_season: challenge_season || "always-on",
          status: status || "active",
          progress_note: progress_note || null,
          reward_claimed: reward_claimed ?? false,
          last_completed_at: last_completed_at || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,challenge_title" },
      )
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

    const { challenge_title, status, progress_note, reward_claimed, last_completed_at } =
      await request.json();
    if (!challenge_title) {
      return NextResponse.json({ error: "challenge_title is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof status === "string") updates.status = status;
    if (typeof progress_note === "string") updates.progress_note = progress_note;
    if (typeof reward_claimed === "boolean") updates.reward_claimed = reward_claimed;
    if (typeof last_completed_at === "string") updates.last_completed_at = last_completed_at;

    const { data, error } = await supabase
      .from("user_seasonal_challenge_progress")
      .update(updates)
      .eq("user_id", user.id)
      .eq("challenge_title", challenge_title)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
