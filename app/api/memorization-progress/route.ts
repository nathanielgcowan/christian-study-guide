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
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_memorization_progress")
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
      reference,
      prompt,
      review_count,
      mastery_level,
      last_result,
      next_review_at,
    } = await request.json();
    if (!reference || !prompt) {
      return NextResponse.json({ error: "reference and prompt are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_memorization_progress")
      .upsert(
        {
          user_id: user.id,
          reference,
          prompt,
          review_count: review_count || 1,
          mastery_level: mastery_level || "starting",
          last_result: last_result || "reviewed",
          next_review_at: next_review_at || null,
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

    const { id, review_count, mastery_level, last_result, next_review_at } =
      await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (typeof review_count === "number") updates.review_count = review_count;
    if (typeof mastery_level === "string") updates.mastery_level = mastery_level;
    if (typeof last_result === "string") updates.last_result = last_result;
    if (typeof next_review_at === "string") updates.next_review_at = next_review_at;

    const { data, error } = await supabase
      .from("user_memorization_progress")
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
