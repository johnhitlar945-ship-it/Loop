import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { ai, db, isAdmin, isCollector } from '@/lib/server';
import { FEEDS } from '@/lib/feeds';

export const maxDuration = 60;
const parser = new Parser({ timeout: 12000 });
const categories = ['World','Ghana & Africa','Entertainment','Culture','Technology','Fun & Memes','Stories'];

export async function POST(request: Request) {
 if (!isAdmin(request) && !isCollector(request)) return NextResponse.json({error:'Unauthorized. Admin or collector secret required.'},{status:401});
 try {
  const supabase=db();
  const existing=await supabase.from('stories').select('source_url').limit(1000);
  const known=new Set((existing.data||[]).map(x=>x.source_url));
  let collected=0, created=0;
  for (const feed of FEEDS) {
   let parsed;
   try { parsed=await parser.parseURL(feed.url); } catch { continue; }
   for (const item of (parsed.items||[]).slice(0,8)) {
    const url=item.link?.trim();
    if(!url || known.has(url)) continue;
    collected++; known.add(url);
    const sourceText=[item.title,item.contentSnippet,item.content].filter(Boolean).join('\n').slice(0,4500);
    if(!item.title || sourceText.length<40) continue;
    const completion=await ai().chat.completions.create({
     model:process.env.OPENAI_MODEL||'gpt-4.1-mini',
     temperature:0.3,
     response_format:{type:'json_object'},
     messages:[
      {role:'system',content:`You are an assistant editor for LOOP, a global youth-friendly media publication. Use only facts present in the supplied feed text. Do not invent facts, quotes, dates, motives or numbers. Write an original headline and a concise 2-3 sentence summary in your own words; do not copy phrases. If facts are unclear, state that the source report says so or omit the claim. No graphic, sexual, hateful, or sensational framing. Return JSON: title, summary, category. category must be one of: ${categories.join(', ')}. Keep summary under 90 words.`},
      {role:'user',content:`Publisher: ${feed.name}\nFeed category: ${feed.category}\nFeed item:\n${sourceText}`}
     ]
    });
    const raw=completion.choices[0]?.message?.content||'{}';
    let draft:any; try{draft=JSON.parse(raw)}catch{continue}
    if(!draft.title||!draft.summary) continue;
    const category=categories.includes(draft.category)?draft.category:feed.category;
    const {error}=await supabase.from('stories').insert({title:String(draft.title).slice(0,180),summary:String(draft.summary).slice(0,900),category,source_name:feed.name,source_url:url,status:'draft',ai_generated:true});
    if(!error) created++;
   }
  }
  return NextResponse.json({collected,created});
 } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Collection failed'},{status:500}); }
}
