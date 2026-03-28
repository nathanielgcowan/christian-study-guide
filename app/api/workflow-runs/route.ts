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
      .from("user_workflow_runs")
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

    const { workflow_name, linked_reference, stage, status, summary, next_step, output } =
      await request.json();

    if (!workflow_name || !summary) {
      return NextResponse.json(
        { error: "workflow_name and summary are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_workflow_runs")
      .insert({
        user_id: user.id,
        workflow_name,
        linked_reference: linked_reference || null,
        stage: stage || "planned",
        status: status || "active",
        summary,
        next_step: next_step || null,
        output: output || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("user_activity").insert({
      user_id: user.id,
      event_type: "workflow_run_created",
      reference: linked_reference || null,
      metadata: {
        workflow_name,
        stage: stage || "planned",
        status: status || "active",
      },
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

    const { id, stage, status, next_step, output } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (stage) updates.stage = stage;
    if (status) updates.status = status;
    if (typeof next_step === "string") updates.next_step = next_step;
    if (output) updates.output = output;

    const { data, error } = await supabase
      .from("user_workflow_runs")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    await supabase.from("user_activity").insert({
      user_id: user.id,
      event_type: "workflow_run_updated",
      reference: data.linked_reference,
      metadata: {
        workflow_name: data.workflow_name,
        stage: data.stage,
        status: data.status,
      },
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
