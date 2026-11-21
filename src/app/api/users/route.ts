import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase as publicSupabase } from '@/lib/supabase';

const supabase = supabaseAdmin || publicSupabase;

// In-memory fallback overrides for user status (active | inactive | banned)
export const USER_STATUS_STORE: Map<string, { status: string; isBanned: boolean }> = new Map();

// In-memory persistent cache of all registered users (so they are 100% visible in real-time)
export const GLOBAL_USERS_CACHE: Map<string, any> = new Map([
  [
    'admin@bhai.com',
    {
      id: 'usr-admin-master',
      name: 'Master Admin',
      fullName: 'Master Admin',
      email: 'admin@bhaijeweller.co.uk',
      phone: '+44 (0) 1274 722 888',
      role: 'admin',
      status: 'active',
      isBanned: false,
      failedAttempts: 0,
      loginAttempts: 0,
      isLocked: false,
      registeredDate: 'Store Inception',
      created_at: new Date().toISOString(),
    },
  ],
]);

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const mergedUsersMap = new Map<string, any>();

    // 1. Populate from Global Server Cache
    for (const [key, user] of GLOBAL_USERS_CACHE.entries()) {
      const emailLower = (user.email || key).toLowerCase();
      const override = USER_STATUS_STORE.get(user.id) || USER_STATUS_STORE.get(emailLower);
      const effectiveStatus = override ? override.status : user.status || 'active';

      mergedUsersMap.set(emailLower, {
        ...user,
        status: effectiveStatus,
        isBanned: effectiveStatus === 'banned',
        isLocked: effectiveStatus === 'locked' || user.isLocked || false,
      });
    }

    let attemptsList: any[] = [];

    // 2. Fetch Users from Supabase if connected
    if (supabase) {
      try {
        const { data: usersData, error: usersErr } = await supabase
          .from('users')
          .select('id, full_name, email, phone, role, status, is_banned, failed_attempts, lock_until, created_at')
          .order('created_at', { ascending: false });

        if (!usersErr && Array.isArray(usersData)) {
          for (const u of usersData) {
            const emailLower = (u.email || '').toLowerCase();
            const override = USER_STATUS_STORE.get(u.id) || USER_STATUS_STORE.get(emailLower);
            const effectiveStatus = override
              ? override.status
              : u.status || (u.is_banned ? 'banned' : 'active');

            const isLocked = u.lock_until ? new Date(u.lock_until).getTime() > Date.now() : false;
            const regDate = u.created_at
              ? new Date(u.created_at).toLocaleDateString('en-GB')
              : 'Recently';

            mergedUsersMap.set(emailLower, {
              id: u.id,
              name: u.full_name || 'Registered Client',
              fullName: u.full_name || 'Registered Client',
              email: u.email,
              phone: u.phone || 'N/A',
              role: u.role || 'client',
              status: effectiveStatus,
              isBanned: effectiveStatus === 'banned',
              failedAttempts: u.failed_attempts || 0,
              loginAttempts: u.failed_attempts || 0,
              isLocked,
              registeredDate: regDate,
              created_at: u.created_at || new Date().toISOString(),
            });
          }
        }

        // 3. Fetch Security Login Logs
        const { data: attemptsData, error: attemptsErr } = await supabase
          .from('login_attempts')
          .select('*')
          .order('attempted_at', { ascending: false })
          .limit(100);

        if (!attemptsErr && Array.isArray(attemptsData)) {
          attemptsList = attemptsData.map((att) => ({
            id: att.id,
            identifier: att.email_attempted || att.ip_address,
            email: att.email_attempted,
            ip: att.ip_address,
            ip_address: att.ip_address,
            status: att.status,
            success: att.status === 'SUCCESS',
            failure_reason: att.failure_reason || (att.status === 'SUCCESS' ? 'Normal Login' : 'Failed attempt'),
            time: att.attempted_at ? new Date(att.attempted_at).toLocaleString('en-GB') : 'Just now',
            created_at: att.attempted_at || new Date().toISOString(),
            attempt_count: 1,
          }));
        }
      } catch (dbErr) {
        console.error('Supabase users fetch error:', dbErr);
      }
    }

    const usersList = Array.from(mergedUsersMap.values());

    return NextResponse.json({
      success: true,
      users: usersList,
      loginAttempts: attemptsList,
      attempts: attemptsList, // Provide both for backward and forward compatibility
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load user accounts' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin(request);
    if (!auth.authorized) {
      return auth.errorResponse!;
    }

    const body = await request.json();
    const { userId, email, status, action } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: 'User ID or email is required' },
        { status: 400 }
      );
    }

    const newStatus =
      status ||
      (action === 'ban'
        ? 'banned'
        : action === 'deactivate'
        ? 'inactive'
        : action === 'unlock'
        ? 'active'
        : 'active');

    const isBanned = newStatus === 'banned';

    // Update in-memory overrides
    if (userId) {
      USER_STATUS_STORE.set(userId, { status: newStatus, isBanned });
    }
    if (email) {
      USER_STATUS_STORE.set(email.toLowerCase(), { status: newStatus, isBanned });
      const cached = GLOBAL_USERS_CACHE.get(email.toLowerCase());
      if (cached) {
        cached.status = newStatus;
        cached.isBanned = isBanned;
        if (action === 'unlock' || newStatus === 'active') {
          cached.isLocked = false;
          cached.failedAttempts = 0;
          cached.loginAttempts = 0;
        }
      }
    }

    // Update in Supabase if connected
    if (supabase) {
      try {
        const updatePayload: Record<string, any> = {
          status: newStatus,
          is_banned: isBanned,
        };

        if (action === 'unlock' || newStatus === 'active') {
          updatePayload.lock_until = null;
          updatePayload.failed_attempts = 0;
        }

        let query = supabase.from('users').update(updatePayload);
        if (userId) {
          query = query.eq('id', userId);
        } else if (email) {
          query = query.eq('email', email.toLowerCase());
        }

        const { error } = await query;
        if (error) {
          console.error('Supabase update user error:', error);
        }
      } catch (err) {
        console.error('Supabase update execution error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `User status successfully updated to ${newStatus.toUpperCase()}`,
      status: newStatus,
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}
