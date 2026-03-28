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
      .from("user_memory_battle_stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

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

    const { current_score, best_score, rounds_played, rounds_won } = await request.json();

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("user_memory_battle_stats")
      .upsert(
        {
          user_id: user.id,
          current_score: current_score ?? 0,
          best_score: best_score ?? 0,
          rounds_played: rounds_played ?? 0,
          rounds_won: rounds_won ?? 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
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

    const { current_score, best_score, rounds_played, rounds_won } = await request.json();

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof current_score === "number") updates.current_score = current_score;
    if (typeof best_score === "number") updates.best_score = best_score;
    if (typeof rounds_played === "number") updates.rounds_played = rounds_played;
    if (typeof rounds_won === "number") updates.rounds_won = rounds_won;

    const { data, error } = await supabase
      .from("user_memory_battle_stats")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
