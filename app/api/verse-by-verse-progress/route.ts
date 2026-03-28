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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const query = supabase
      .from("user_verse_by_verse_progress")
      .select("*")
      .eq("user_id", user.id);

    if (reference) {
      const { data, error } = await query.eq("reference", reference).maybeSingle();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await query.order("updated_at", { ascending: false });
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

    const { reference, completed_verses, last_focus_verse, completion_status } = await request.json();
    if (!reference) {
      return NextResponse.json({ error: "reference is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const { data, error } = await supabase
      .from("user_verse_by_verse_progress")
      .upsert(
        {
          user_id: user.id,
          reference,
          completed_verses: completed_verses ?? [],
          last_focus_verse: last_focus_verse ?? null,
          completion_status: completion_status ?? "in-progress",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,reference" },
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

    const { id, completed_verses, last_focus_verse, completion_status } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (Array.isArray(completed_verses)) updates.completed_verses = completed_verses;
    if (typeof last_focus_verse === "string") updates.last_focus_verse = last_focus_verse;
    if (typeof completion_status === "string") updates.completion_status = completion_status;

    const { data, error } = await supabase
      .from("user_verse_by_verse_progress")
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
