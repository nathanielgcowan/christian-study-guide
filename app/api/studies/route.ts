import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth-server";

async function ensureUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>,
) {
  const { error } = await supabase.from("user_profiles").upsert(
    {
      id: user.id,
      email: user.email ?? `${user.id}@example.com`,
    },
    { onConflict: "id" },
  );

  return error;
}

async function ensureUserStreak(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { error } = await supabase.from("user_streaks").upsert(
    {
      user_id: userId,
    },
    { onConflict: "user_id" },
  );

  return error;
}

// POST - Log a study session
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      reference,
      translation = "web",
      time_spent_minutes = 0,
    } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    const streakSetupError = await ensureUserStreak(supabase, user.id);

    if (profileError || streakSetupError) {
      return NextResponse.json(
        { error: profileError?.message || streakSetupError?.message },
        { status: 400 },
      );
    }

    // Record the study
    const { data: studyData, error: studyError } = await supabase
      .from("user_studies")
      .insert({
        user_id: user.id,
        reference,
        translation,
        time_spent_minutes,
      })
      .select()
      .single();

    if (studyError) {
      return NextResponse.json({ error: studyError.message }, { status: 400 });
    }

    // Update streaks
    const today = new Date().toISOString().split("T")[0];

    const { data: streakData, error: streakError } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (streakError) {
      return NextResponse.json({ error: streakError.message }, { status: 400 });
    }

    let newStreak = streakData.current_streak;
    const lastReadDate = streakData.last_read_date;

    // Check if this is a new day
    if (lastReadDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      // If last read was yesterday, increment streak; otherwise reset
      if (lastReadDate === yesterdayStr) {
        newStreak = streakData.current_streak + 1;
      } else {
        newStreak = 1;
      }
    }

    // Update best streak if necessary
    const bestStreak = Math.max(streakData.best_streak, newStreak);

    // Update streak record
    const { data: updatedStreak, error: updateError } = await supabase
      .from("user_streaks")
      .update({
        current_streak: newStreak,
        best_streak: bestStreak,
        last_read_date: today,
        total_studies: streakData.total_studies + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        study: studyData,
        streak: updatedStreak,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET - Fetch user's streak and study stats
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    const streakSetupError = await ensureUserStreak(supabase, user.id);

    if (profileError || streakSetupError) {
      return NextResponse.json(
        { error: profileError?.message || streakSetupError?.message },
        { status: 400 },
      );
    }

    const { data: streakData, error: streakError } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (streakError) {
      return NextResponse.json({ error: streakError.message }, { status: 400 });
    }

    // Get recent studies
    const { data: recentStudies, error: studiesError } = await supabase
      .from("user_studies")
      .select("*")
      .eq("user_id", user.id)
      .order("read_at", { ascending: false })
      .limit(10);

    if (studiesError) {
      return NextResponse.json(
        { error: studiesError.message },
        { status: 400 },
      );
    }

    return NextResponse.json({
      streak: streakData,
      recentStudies,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
