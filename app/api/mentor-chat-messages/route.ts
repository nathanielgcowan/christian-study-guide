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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const threadId = request.nextUrl.searchParams.get("thread_id");
    if (!threadId) {
      return NextResponse.json({ error: "thread_id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_mentor_chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { thread_id, speaker, message, stage } = await request.json();
    if (!thread_id || !speaker || !message) {
      return NextResponse.json(
        { error: "thread_id, speaker, and message are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_mentor_chat_messages")
      .insert({
        thread_id,
        user_id: user.id,
        speaker,
        message,
        stage: stage || "conversation",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase
      .from("user_mentor_chat_threads")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", thread_id)
      .eq("user_id", user.id);

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
