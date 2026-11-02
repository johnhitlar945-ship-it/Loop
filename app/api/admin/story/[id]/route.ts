import { NextResponse } from 'next/server';
import { db, isAdmin } from '@/lib/server';
export async function PATCH(request:Request, context:{params:Promise<{id:string}>}) {
 if(!isAdmin(request)) return NextResponse.json({error:'Unauthorized'},{status:401});
 const {id}=await context.params;
 const body=await request.json();
 if(!['publish','reject'].includes(body.action)) return NextResponse.json({error:'Invalid action'},{status:400});
 const status=body.action==='publish'?'published':'rejected';
 const {error}=await db().from('stories').update({status,published_at:status==='published'?new Date().toISOString():null}).eq('id',id).eq('status','draft');
 if(error) return NextResponse.json({error:error.message},{status:500});
 return NextResponse.json({ok:true,status});
}
