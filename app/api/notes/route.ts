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

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return Array.from(
    new Set(
      tags
        .filter((tag): tag is string => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

// GET all notes for user
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_notes")
      .select("*, note_tags(tag)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST create new note
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reference, content, note_type, color, tags } = await request.json();
    const normalizedTags = normalizeTags(tags);

    if (!reference || !content) {
      return NextResponse.json(
        { error: "Reference and content are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Create note
    const { data: noteData, error: noteError } = await supabase
      .from("user_notes")
      .insert({
        user_id: user.id,
        reference,
        content,
        note_type: note_type || "note",
        color: color || "#ffff00",
      })
      .select()
      .single();

    if (noteError) {
      return NextResponse.json({ error: noteError.message }, { status: 400 });
    }

    // Add tags if provided
    if (normalizedTags.length > 0) {
      const tagInserts = normalizedTags.map((tag: string) => ({
        note_id: noteData.id,
        tag,
      }));

      const { error: tagError } = await supabase.from("note_tags").insert(tagInserts);

      if (tagError) {
        console.error("Error saving note tags:", tagError.message);
      }
    }

    const { data: createdNote } = await supabase
      .from("user_notes")
      .select("*, note_tags(tag)")
      .eq("id", noteData.id)
      .single();

    return NextResponse.json(createdNote ?? noteData, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH update note
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, reference, content, note_type, color, tags } = await request.json();
    const normalizedTags = normalizeTags(tags);

    if (!id || !reference || !content) {
      return NextResponse.json(
        { error: "ID, reference, and content are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: note, error: fetchError } = await supabase
      .from("user_notes")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || note.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update note
    const { data: updatedNote, error } = await supabase
      .from("user_notes")
      .update({
        reference,
        content,
        note_type: note_type || "note",
        color,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update tags if provided
    if (tags !== undefined) {
      // Delete existing tags
      await supabase.from("note_tags").delete().eq("note_id", id);

      // Insert new tags
      if (normalizedTags.length > 0) {
        const tagInserts = normalizedTags.map((tag: string) => ({
          note_id: id,
          tag,
        }));
        await supabase.from("note_tags").insert(tagInserts);
      }
    }

    const { data: fullNote } = await supabase
      .from("user_notes")
      .select("*, note_tags(tag)")
      .eq("id", updatedNote.id)
      .single();

    return NextResponse.json(fullNote ?? updatedNote);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE note
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify ownership
    const { data: note, error: fetchError } = await supabase
      .from("user_notes")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || note.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete note (cascades to tags)
    const { error } = await supabase.from("user_notes").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
