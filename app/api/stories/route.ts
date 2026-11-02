import { NextResponse } from 'next/server';
import { db } from '@/lib/server';
export const dynamic = 'force-dynamic';
export async function GET() {
 try {
  const {data,error}=await db().from('stories').select('id,title,summary,category,source_name,source_url,published_at').eq('status','published').order('published_at',{ascending:false}).limit(60);
  if(error) throw error;
  return NextResponse.json({stories:data||[]});
 } catch(e) { return NextResponse.json({stories:[],error:e instanceof Error?e.message:'Database not configured'},{status:200}); }
}
