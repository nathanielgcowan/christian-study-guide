import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth-server';

async function ensureUserProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
) {
  const { error } = await supabase.from('user_profiles').upsert(
    {
      id: user.id,
      email: user.email ?? `${user.id}@example.com`,
    },
    { onConflict: 'id' }
  );

  return error;
}

// GET reading plans
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Get public plans and user's progress
    const { data: plans, error: plansError } = await supabase
      .from('reading_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (plansError) {
      return NextResponse.json({ error: plansError.message }, { status: 400 });
    }

    // Get user's progress on each plan
    const { data: userPlans, error: userPlansError } = await supabase
      .from('user_reading_plans')
      .select('*')
      .eq('user_id', user.id);

    if (userPlansError) {
      return NextResponse.json({ error: userPlansError.message }, { status: 400 });
    }

    // Merge data
    const plansWithProgress = plans.map((plan) => {
      const progress = userPlans.find((up) => up.plan_id === plan.id);
      return {
        ...plan,
        userProgress: progress || null,
      };
    });

    return NextResponse.json(plansWithProgress);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST start a reading plan
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan_id } = await request.json();

    if (!plan_id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const profileError = await ensureUserProfile(supabase, user);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // Check if already started
    const { data: existing, error: existingError } = await supabase
      .from('user_reading_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('plan_id', plan_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Already enrolled in this plan' },
        { status: 409 }
      );
    }

    if (existingError && existingError.code !== 'PGRST116') {
      return NextResponse.json({ error: existingError.message }, { status: 400 });
    }

    // Create enrollment
    const { data, error } = await supabase
      .from('user_reading_plans')
      .insert({
        user_id: user.id,
        plan_id,
        current_day: 1,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
