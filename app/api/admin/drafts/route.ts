import { NextResponse } from 'next/server';
import { db, isAdmin } from '@/lib/server';
export async function GET(request:Request) {
 if(!isAdmin(request)) return NextResponse.json({error:'Unauthorized'},{status:401});
 const {data,error}=await db().from('stories').select('*').eq('status','draft').order('created_at',{ascending:false}).limit(100);
 if(error) return NextResponse.json({error:error.message},{status:500});
 return NextResponse.json({drafts:data||[]});
}
