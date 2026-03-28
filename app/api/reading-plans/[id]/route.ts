import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth-server';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, currentDay, completed } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Update progress
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (currentDay !== undefined) {
      updates.current_day = currentDay;
    }

    if (completed !== undefined) {
      updates.completed = completed;
      if (completed) {
        updates.completed_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('user_reading_plans')
      .update(updates)
      .eq('user_id', user.id)
      .eq('plan_id', planId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Delete enrollment
    const { error } = await supabase
      .from('user_reading_plans')
      .delete()
      .eq('user_id', user.id)
      .eq('plan_id', planId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
