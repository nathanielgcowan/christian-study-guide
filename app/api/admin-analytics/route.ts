import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getCurrentUser, getUserProfile } from "@/lib/auth-server";

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables");
  }

  return createSupabaseClient(
    supabaseUrl,
    serviceRoleKey,
  );
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await getUserProfile();
    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [
      usersCountRes,
      studiesCountRes,
      studiesWeeklyRes,
      guidedPathsCountRes,
      guidedPathsCompletedRes,
      mentorCountRes,
      prayerCountRes,
      answeredPrayerCountRes,
      notesCountRes,
      qualityCountRes,
      activityCountRes,
      activityRecentRes,
    ] = await Promise.all([
      supabase.from("user_profiles").select("*", { count: "exact", head: true }),
      supabase.from("user_studies").select("*", { count: "exact", head: true }),
      supabase
        .from("user_studies")
        .select("user_id, reference, read_at")
        .gte("read_at", sevenDaysAgo)
        .order("read_at", { ascending: false })
        .limit(500),
      supabase.from("user_guided_paths").select("*", { count: "exact", head: true }),
      supabase
        .from("user_guided_paths")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed"),
      supabase
        .from("ai_conversations")
        .select("*", { count: "exact", head: true })
        .eq("type", "guide"),
      supabase.from("user_prayer_entries").select("*", { count: "exact", head: true }),
      supabase
        .from("user_prayer_entries")
        .select("*", { count: "exact", head: true })
        .eq("answered", true),
      supabase.from("user_notes").select("*", { count: "exact", head: true }),
      supabase.from("quality_reports").select("*", { count: "exact", head: true }),
      supabase.from("user_activity").select("*", { count: "exact", head: true }),
      supabase
        .from("user_activity")
        .select("event_type, created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);

    const weeklyStudies = studiesWeeklyRes.data?.length || 0;
    const weeklyActiveLearners = new Set(
      (studiesWeeklyRes.data || []).map((study) => study.user_id),
    ).size;

    const recentActivity = activityRecentRes.data || [];
    const activityCounts = recentActivity.reduce<Record<string, number>>((acc, item) => {
      acc[item.event_type] = (acc[item.event_type] || 0) + 1;
      return acc;
    }, {});

    const topActivity = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([eventType, count]) => ({
        eventType,
        count,
      }));

    return NextResponse.json(
      {
        users: usersCountRes.count || 0,
        totalStudies: studiesCountRes.count || 0,
        weeklyStudies,
        weeklyActiveLearners,
        guidedPaths: guidedPathsCountRes.count || 0,
        completedPaths: guidedPathsCompletedRes.count || 0,
        mentorSessions: mentorCountRes.count || 0,
        prayerEntries: prayerCountRes.count || 0,
        answeredPrayers: answeredPrayerCountRes.count || 0,
        notes: notesCountRes.count || 0,
        qualityReports: qualityCountRes.count || 0,
        activityCount: activityCountRes.count || 0,
        topActivity,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
