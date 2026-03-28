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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_publishing_flows")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

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

    const { title, audience, content_type, status, destination, summary, share_scope } =
      await request.json();

    if (!title || !summary) {
      return NextResponse.json(
        { error: "title and summary are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_publishing_flows")
      .insert({
        user_id: user.id,
        title,
        audience: audience || "small-group",
        content_type: content_type || "study",
        status: status || "draft",
        destination: destination || "shared-studies",
        summary,
        share_scope: share_scope || "team",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("user_activity").insert({
      user_id: user.id,
      event_type: "publishing_flow_saved",
      reference: null,
      metadata: { title, status: data.status, destination: data.destination },
    });

    return NextResponse.json(data, { status: 201 });
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

    const { id, status, destination, share_scope } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (destination) updates.destination = destination;
    if (share_scope) updates.share_scope = share_scope;

    const { data, error } = await supabase
      .from("user_publishing_flows")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
