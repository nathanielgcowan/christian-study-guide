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
      .from("user_gamification_progress")
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

    const {
      xp_points,
      current_level,
      unlocked_badges,
      completed_daily_quests,
      active_weekly_challenges,
      mastery_rank,
      streak_freezes,
    } = await request.json();

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("user_gamification_progress")
      .upsert(
        {
          user_id: user.id,
          xp_points: xp_points ?? 0,
          current_level: current_level ?? 1,
          unlocked_badges: unlocked_badges ?? [],
          completed_daily_quests: completed_daily_quests ?? [],
          active_weekly_challenges: active_weekly_challenges ?? [],
          mastery_rank: mastery_rank ?? "Learning",
          streak_freezes: streak_freezes ?? 0,
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

    const {
      xp_points,
      current_level,
      unlocked_badges,
      completed_daily_quests,
      active_weekly_challenges,
      mastery_rank,
      streak_freezes,
    } = await request.json();

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof xp_points === "number") updates.xp_points = xp_points;
    if (typeof current_level === "number") updates.current_level = current_level;
    if (Array.isArray(unlocked_badges)) updates.unlocked_badges = unlocked_badges;
    if (Array.isArray(completed_daily_quests)) updates.completed_daily_quests = completed_daily_quests;
    if (Array.isArray(active_weekly_challenges)) updates.active_weekly_challenges = active_weekly_challenges;
    if (typeof mastery_rank === "string") updates.mastery_rank = mastery_rank;
    if (typeof streak_freezes === "number") updates.streak_freezes = streak_freezes;

    const { data, error } = await supabase
      .from("user_gamification_progress")
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

