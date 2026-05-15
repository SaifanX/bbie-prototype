import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { anonymizeRecord } from '@/utils/privacy';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ubid: string }> }
) {
  try {
    const { ubid } = await params;
    const searchParams = request.nextUrl.searchParams;
    const include_audit = searchParams.get('include_audit') === 'true';

    if (!ubid) {
      return NextResponse.json({ error: 'ubid is required' }, { status: 400 });
    }

    // 1. Fetch the business record
    let query = supabase
      .from('businesses')
      .select('*')
      .eq('ubid', ubid)
      .single();

    const { data: business, error } = await query;

    if (error || !business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // 2. Fetch resolution events if audit is requested
    let auditTimeline = [];
    if (include_audit) {
      const { data: events } = await supabase
        .from('resolution_events')
        .select('*')
        .eq('target_business_id', business.id)
        .order('created_at', { ascending: false });
      
      auditTimeline = events || [];
    }

    // 3. Anonymize sensitive fields
    const sanitizedBusiness = anonymizeRecord(business);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      ubid: business.ubid,
      data: sanitizedBusiness,
      audit: include_audit ? auditTimeline : undefined,
      verification_status: business.status === 'active' ? 'Verified' : 'Pending'
    });

  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
