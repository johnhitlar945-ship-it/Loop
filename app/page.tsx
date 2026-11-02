'use client';
import { useEffect, useMemo, useState } from 'react';

type Story = { id:string; title:string; summary:string; category:string; source_name:string; source_url:string; published_at:string|null };
const categories = ['All','World','Ghana & Africa','Entertainment','Culture','Technology','Fun & Memes','Stories'];

export default function Home() {
  const [stories,setStories] = useState<Story[]>([]);
  const [category,setCategory] = useState('All');
  const [query,setQuery] = useState('');
  const [loading,setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/stories').then(r=>r.json()).then(d=>setStories(d.stories||[])).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  const shown = useMemo(()=>stories.filter(s=>(category==='All'||s.category===category) && (s.title+' '+s.summary).toLowerCase().includes(query.toLowerCase())),[stories,category,query]);
  return <main>
    <header className="top"><a className="logo" href="/">LOOP<span>.</span></a><nav><a href="#latest">Latest</a><a href="#categories">Categories</a><a href="/admin">Admin</a></nav></header>
    <section className="hero"><div className="eyebrow">THE WORLD, IN THE LOOP</div><h1>Stories worth<br/><em>your time.</em></h1><p>News, culture, entertainment and ideas that move the conversation forward.</p><a className="button" href="#latest">Explore the latest ↓</a><div className="hero-note">INFORMED. CURIOUS. ALWAYS MOVING.</div></section>
    <section id="categories" className="filters"><div><span className="eyebrow">EXPLORE</span><h2>Find your loop.</h2></div><div className="chips">{categories.map(c=><button className={category===c?'active':''} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div></section>
    <section id="latest" className="latest"><div className="section-head"><div><span className="eyebrow">FRESHLY UPDATED</span><h2>Latest stories<span>.</span></h2></div><input aria-label="Search stories" placeholder="Search LOOP..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
      {loading?<p className="empty">Loading the latest stories…</p>:shown.length===0?<div className="empty"><h3>No published stories yet.</h3><p>LOOP is ready. The editor can collect source material and review AI-written drafts in the admin area.</p><a href="/admin">Open editor →</a></div>:
      <div className="grid">{shown.map(s=><article className="card" key={s.id}><div className="card-top"><span>{s.category}</span><span>{s.published_at?new Date(s.published_at).toLocaleDateString():'LATEST'}</span></div><h3>{s.title}</h3><p>{s.summary}</p><div className="source">SOURCE: <a href={s.source_url} target="_blank" rel="noreferrer">{s.source_name}</a></div></article>)}</div>}
    </section>
    <footer><a className="logo" href="/">LOOP<span>.</span></a><p>Stories worth your time.</p><small>LOOP is an independent editorial project. Sources are credited on every story.</small></footer>
  </main>;
}
