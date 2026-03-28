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

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_new_believer_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      program_name,
      current_week_index,
      current_week_title,
      completed_weeks,
      completed_milestones,
      reviewed_mentor_topics,
      week_checklists,
      daily_readings_completed,
      status,
      started_at,
      completed_at,
    } = await request.json();

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_new_believer_progress")
      .upsert(
        {
          user_id: user.id,
          program_name: program_name || "New Believer Foundations",
          current_week_index: typeof current_week_index === "number" ? current_week_index : 0,
          current_week_title: current_week_title || null,
          completed_weeks: Array.isArray(completed_weeks) ? completed_weeks : [],
          completed_milestones: Array.isArray(completed_milestones)
            ? completed_milestones
            : [],
          reviewed_mentor_topics: Array.isArray(reviewed_mentor_topics)
            ? reviewed_mentor_topics
            : [],
          week_checklists:
            week_checklists && typeof week_checklists === "object" ? week_checklists : {},
          daily_readings_completed:
            daily_readings_completed && typeof daily_readings_completed === "object"
              ? daily_readings_completed
              : {},
          status: status || "not-started",
          started_at: started_at || null,
          completed_at: completed_at || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("user_activity").insert({
      user_id: user.id,
      event_type: "new_believer_progress_updated",
      reference: current_week_title || null,
      metadata: {
        status: status || "not-started",
        current_week_index: typeof current_week_index === "number" ? current_week_index : 0,
      },
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
