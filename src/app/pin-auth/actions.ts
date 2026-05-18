'use server'

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function verifyPinAction(pin: string) {
  try {
    // 1. Check for rate limiting / brute force (3+ failed attempts in the last 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: attempts, error: attErr } = await supabaseAdmin
      .from('system_logs')
      .select('created_at')
      .eq('stage', 'PIN_ATTEMPT')
      .eq('severity', 'error')
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: true });

    if (attErr) {
      console.error("Error checking PIN attempts:", attErr);
    }

    if (attempts && attempts.length >= 3) {
      // Find the latest attempt time to calculate remaining block time
      const latestAttempt = new Date(attempts[attempts.length - 1].created_at).getTime();
      const unblockTime = new Date(latestAttempt + 60 * 60 * 1000);
      const remainingMinutes = Math.ceil((unblockTime.getTime() - Date.now()) / (60 * 1000));
      
      return { 
        success: false, 
        blocked: true, 
        message: `Too many failed attempts. Access blocked for 1 hour (${remainingMinutes > 0 ? remainingMinutes : 60} mins remaining).` 
      };
    }

    // 2. Fetch the stored PIN from DB
    const { data: pinCfg, error: pinErr } = await supabaseAdmin
      .from('system_logs')
      .select('message')
      .eq('stage', 'PIN_CONFIG')
      .single();

    if (pinErr || !pinCfg) {
      console.error("Error fetching PIN config:", pinErr);
      return { success: false, blocked: false, message: "System error: PIN configuration not found in database." };
    }

    const storedPin = pinCfg.message;

    // 3. Compare entered PIN with stored PIN
    if (pin === storedPin) {
      // Success! Clear any failed attempts from the last hour to reset the counter
      await supabaseAdmin
        .from('system_logs')
        .delete()
        .eq('stage', 'PIN_ATTEMPT');

      // Set HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set('bbie_pin_auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });

      return { success: true };
    } else {
      // Failed match. Log the failed attempt in system_logs
      await supabaseAdmin
        .from('system_logs')
        .insert({
          stage: 'PIN_ATTEMPT',
          message: `Failed PIN entry attempt`,
          severity: 'error'
        });

      const failedCount = (attempts?.length || 0) + 1;
      const remainingAttempts = 3 - failedCount;

      if (remainingAttempts <= 0) {
        return { 
          success: false, 
          blocked: true, 
          message: "Incorrect PIN. You have exceeded 3 failed attempts. Access blocked for 1 hour." 
        };
      }

      return { 
        success: false, 
        blocked: false, 
        message: `Incorrect PIN code. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.` 
      };
    }
  } catch (error: any) {
    console.error("verifyPinAction error:", error);
    return { success: false, blocked: false, message: error.message || "An unexpected error occurred." };
  }
}
