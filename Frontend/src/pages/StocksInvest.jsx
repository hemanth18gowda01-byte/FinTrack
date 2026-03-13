import { useState, useEffect } from "react";
import { C, fmt } from "../constants/theme";
import { api, DEMO_TOKEN, yahooGet, YAHOO_KEY_SET } from "../api";
import { MOCK_STOCKS, SPARKS, PROFILES, AI_STOCK_SUGGESTIONS, MOCK_NEWS, SECTOR_HEAT, TOP_MOVERS } from "../constants/mockData";
import { Sparkline } from "../components/Sparkline";

function Sparkline({data, color, w=80, h=30}) {
  if (!data||data.length<2) return null;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>`${((i/(data.length-1))*w).toFixed(1)},${(h-((v-mn)/rng)*h).toFixed(1)}`).join(" ");
  const last=pts.split(" ").slice(-1)[0].split(",");
  return (
    <svg width={w} height={h} style={{overflow:"visible",flexShrink:0}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" opacity="0.9"/>
      <circle cx={last[0]} cy={last[1]} r="2.8" fill={color}/>
    </svg>
  );
}

function SectorHeatmap() {
  const max=Math.max(...SECTOR_HEAT.map(s=>Math.abs(s.pct)));
  return (
    <div className="card fade-up" style={{padding:"20px 22px"}}>
      <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:14}}>Sector Heatmap — Today</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
        {SECTOR_HEAT.map(s=>{
          const intensity=Math.abs(s.pct)/max;
          const bg=s.pct>=0?`rgba(76,175,120,${0.08+intensity*0.28})`:`rgba(224,82,82,${0.08+intensity*0.28})`;
          const border=s.pct>=0?`rgba(76,175,120,${0.2+intensity*0.4})`:`rgba(224,82,82,${0.2+intensity*0.4})`;
          const clr=s.pct>=0?C.green:C.red;
          return (
            <div key={s.sector} style={{padding:"12px 10px",background:bg,border:`1px solid ${border}`,borderRadius:1,textAlign:"center"}}>
              <div style={{fontSize:9,color:clr,fontFamily:C.mono,fontWeight:600,marginBottom:4}}>{s.pct>=0?"▲":"▼"} {Math.abs(s.pct).toFixed(1)}%</div>
              <div style={{fontSize:10,color:C.text1,lineHeight:1.3}}>{s.sector}</div>
              <div style={{fontSize:8,color:C.text3,fontFamily:C.mono,marginTop:4}}>{s.stocks.length} stock{s.stocks.length>1?"s":""}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MarketMovers() {
  const [side,setSide]=useState("gainers");
  const data=TOP_MOVERS[side];
  return (
    <div className="card fade-up" style={{padding:"20px 22px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono}}>Market Movers</div>
        <div style={{display:"flex",gap:2,background:"rgba(200,169,110,.06)",border:"1px solid "+C.border,borderRadius:2,padding:2}}>
          {[["gainers","▲ Gainers"],["losers","▼ Losers"]].map(([id,label])=>(
            <button key={id} onClick={()=>setSide(id)} style={{padding:"3px 11px",borderRadius:1,border:"none",cursor:"pointer",fontFamily:C.mono,fontSize:8,letterSpacing:".08em",textTransform:"uppercase",background:side===id?(id==="gainers"?C.green:C.red):"transparent",color:side===id?"#fff":C.text3,transition:"all .18s"}}>{label}</button>
          ))}
        </div>
      </div>
      {data.map((s,i)=>(
        <div key={s.symbol} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<data.length-1?"1px solid "+C.border:"none"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:9,color:C.text3,fontFamily:C.mono,width:16,textAlign:"right"}}>#{i+1}</span>
            <div><div style={{fontSize:9,color:C.gold,fontFamily:C.mono,letterSpacing:".08em"}}>{s.symbol}</div><div style={{fontSize:12,color:C.text1}}>{s.name}</div></div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:15,color:C.text0,fontFamily:C.serif}}>{s.price}</div>
            <div style={{fontSize:11,color:side==="gainers"?C.green:C.red,fontFamily:C.mono}}>{s.pct>=0?"+":""}{s.pct.toFixed(2)}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}


function StocksInvest({token, toast}) {
  const SAVINGS=43000;
  const [profile,setProfile]=useState("conservative");
  const [tab,setTab]=useState("watchlist");
  const [stocks,setStocks]=useState({});
  const [loading,setLoading]=useState(false);
  const [liveMode,setLiveMode]=useState(false);
  const [query,setQuery]=useState("");
  const [searchRes,setSearchRes]=useState(null);
  const [searching,setSearching]=useState(false);
  const [detail,setDetail]=useState(null);
  const [watchlist,setWatchlist]=useState([]);
  const prof=PROFILES[profile];

  useEffect(()=>{loadProfile(profile);},[profile]);

  const loadProfile=async(key)=>{
    setLoading(true);
    const tickers=PROFILES[key].tickers;
    try{
      if(YAHOO_KEY==="YOUR_RAPIDAPI_KEY_HERE"){await new Promise(r=>setTimeout(r,500));const d={};tickers.forEach(t=>{if(MOCK_STOCKS[t])d[t]=MOCK_STOCKS[t];});setStocks(d);setLiveMode(false);}
      else{const d={};await Promise.all(tickers.map(async t=>{try{const res=await yahooGet(`/markets/stock/quotes?ticker=${t}`);const q=res?.body?.[0]||res?.quoteResponse?.result?.[0];if(q)d[t]={symbol:q.symbol,name:q.longName||q.shortName||t,price:q.regularMarketPrice,change:q.regularMarketChange,pct:q.regularMarketChangePercent,high:q.regularMarketDayHigh,low:q.regularMarketDayLow,vol:(q.regularMarketVolume/1e6).toFixed(1)+"M",cap:q.marketCap?(q.marketCap/1e12).toFixed(2)+"T":"—",sector:q.sector||"—",currency:t.endsWith(".NS")?"₹":"$"};}catch(e){}}));setStocks(d);setLiveMode(true);toast.show("Live prices from Yahoo Finance","success");}
    }catch(e){const d={};tickers.forEach(t=>{if(MOCK_STOCKS[t])d[t]=MOCK_STOCKS[t];});setStocks(d);}
    setLoading(false);
  };

  const doSearch=async()=>{
    const sym=query.trim().toUpperCase();if(!sym)return;setSearching(true);setSearchRes(null);
    try{if(YAHOO_KEY==="YOUR_RAPIDAPI_KEY_HERE"){await new Promise(r=>setTimeout(r,600));const found=MOCK_STOCKS[sym]||MOCK_STOCKS[sym+".NS"]||null;setSearchRes(found||{error:`No mock data for "${sym}". Add your RapidAPI key for live search.`});}
    else{const res=await yahooGet(`/markets/stock/quotes?ticker=${sym}`);const q=res?.body?.[0]||res?.quoteResponse?.result?.[0];if(q)setSearchRes({symbol:q.symbol,name:q.longName||q.shortName||sym,price:q.regularMarketPrice,change:q.regularMarketChange,pct:q.regularMarketChangePercent,high:q.regularMarketDayHigh,low:q.regularMarketDayLow,vol:(q.regularMarketVolume/1e6).toFixed(1)+"M",cap:q.marketCap?(q.marketCap/1e12).toFixed(2)+"T":"—",sector:q.sector||"—",currency:sym.endsWith(".NS")?"₹":"$"});else setSearchRes({error:`No result found for "${sym}"`});}}
    catch(e){setSearchRes({error:"Search failed — check your API key."});}
    setSearching(false);
  };

  const addToWatchlist=(s)=>{
    if(watchlist.find(x=>x.symbol===s.symbol)){toast.show(`${s.symbol} already in watchlist`,"info");return;}
    setWatchlist(p=>[...p,s]);toast.show(`${s.symbol} added to watchlist`,"success");
  };

  const TabBtn=({id,label,icon,count,badge})=>(
    <button onClick={()=>setTab(id)} style={{padding:"7px 13px",border:"none",cursor:"pointer",borderRadius:1,fontFamily:C.mono,fontSize:9,letterSpacing:".09em",textTransform:"uppercase",background:tab===id?C.gold:"transparent",color:tab===id?"#08090a":C.text3,transition:"all .18s",display:"flex",alignItems:"center",gap:5}}>
      {icon} {label}
      {count>0&&<span style={{background:tab===id?"rgba(0,0,0,.25)":"rgba(200,169,110,.2)",color:tab===id?"#08090a":C.gold,borderRadius:8,fontSize:8,padding:"1px 5px",fontFamily:C.mono}}>{count}</span>}
      {badge&&<span style={{background:"#5b8fd4",color:"#fff",borderRadius:8,fontSize:7,padding:"1px 5px",fontFamily:C.mono}}>{badge}</span>}
    </button>
  );

  const gainers=Object.values(stocks).filter(s=>s.pct>=0).length;
  const losers =Object.values(stocks).filter(s=>s.pct<0).length;

  return (
    <div style={{padding:"28px 30px",display:"flex",flexDirection:"column",gap:20}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:7,display:"flex",alignItems:"center",gap:10}}>
          YAHOO FINANCE ·&nbsp;{liveMode?<span style={{color:C.green}}>● LIVE DATA</span>:<span style={{color:C.text3}}>● DEMO — add RapidAPI key for live prices</span>}
        </div>
        <h1 style={{fontFamily:C.serif,fontSize:30,fontWeight:400,color:C.text0,lineHeight:1.1}}>Stocks & <em style={{fontStyle:"italic",color:C.gold}}>Investments</em></h1>
        <p style={{color:C.text3,fontFamily:C.mono,fontSize:10,marginTop:7,letterSpacing:".05em"}}>AI-personalised suggestions · ₹{(SAVINGS/1000).toFixed(0)}K/month investable surplus</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12}}>
        {[{label:"Monthly Investable",value:"₹"+(SAVINGS/1000).toFixed(0)+"K",color:C.gold},{label:"SIP Suggestion",value:"₹"+(Math.round(SAVINGS*0.35)/1000).toFixed(1)+"K/mo",color:C.green},{label:"Direct Stocks",value:"₹"+(Math.round(SAVINGS*0.15)/1000).toFixed(1)+"K/mo",color:C.blue},{label:"My Watchlist",value:`${watchlist.length} stock${watchlist.length!==1?"s":""}`,color:watchlist.length>0?C.gold:C.text2}].map((s,i)=>(
          <div key={s.label} className="card fade-up" style={{padding:"17px 20px",animationDelay:`${i*55}ms`}}>
            <div style={{fontSize:9,color:C.text3,letterSpacing:".13em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:21,color:s.color,fontFamily:C.serif,fontWeight:400}}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="fade-up" style={{display:"flex",gap:2,background:"rgba(200,169,110,.06)",border:"1px solid "+C.border,borderRadius:2,padding:3,width:"fit-content",animationDelay:"100ms",flexWrap:"wrap"}}>
        <TabBtn id="watchlist" icon="◈" label="Watchlist"/>
        <TabBtn id="suggest"   icon="◆" label="AI Picks" badge="AI"/>
        <TabBtn id="search"    icon="◭" label="Search"/>
        <TabBtn id="portfolio" icon="◲" label="My Watchlist" count={watchlist.length}/>
        <TabBtn id="movers"    icon="⇌" label="Movers"/>
      </div>

      {/* WATCHLIST TAB */}
      {tab==="watchlist"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card fade-up" style={{padding:"13px 18px",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:9,color:C.text3,fontFamily:C.mono,letterSpacing:".1em"}}>RISK PROFILE:</span>
            {Object.entries(PROFILES).map(([key,p])=>(
              <button key={key} onClick={()=>setProfile(key)} style={{padding:"5px 14px",borderRadius:1,cursor:"pointer",transition:"all .18s",fontFamily:C.mono,fontSize:10,letterSpacing:".08em",textTransform:"uppercase",border:`1px solid ${profile===key?p.color:C.border}`,background:profile===key?`${p.color}18`:"transparent",color:profile===key?p.color:C.text2}}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
          <div style={{padding:"9px 15px",background:`${prof.color}0d`,border:`1px solid ${prof.color}28`,borderRadius:1}}>
            <span style={{fontSize:10,color:prof.color,fontFamily:C.mono}}>{prof.icon}  {prof.desc}</span>
          </div>
          {!loading&&Object.keys(stocks).length>0&&(
            <div style={{display:"flex",gap:10}}>
              <div style={{padding:"6px 14px",background:"rgba(76,175,120,.08)",border:"1px solid rgba(76,175,120,.2)",borderRadius:1,fontFamily:C.mono,fontSize:10,color:C.green}}>▲ {gainers} Gaining</div>
              <div style={{padding:"6px 14px",background:"rgba(224,82,82,.08)",border:"1px solid rgba(224,82,82,.2)",borderRadius:1,fontFamily:C.mono,fontSize:10,color:C.red}}>▼ {losers} Declining</div>
              <button className="btn-outline" style={{padding:"5px 14px",fontSize:9,marginLeft:"auto"}} onClick={()=>loadProfile(profile)}>↻ Refresh</button>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
            {loading?[1,2,3,4,5].map(i=><div key={i} className="card" style={{padding:"18px 20px"}}>{[140,90,70].map((w,j)=><div key={j} className="shimmer" style={{height:12,width:w,marginBottom:12}}/>)}</div>)
              :prof.tickers.map((ticker,i)=>{
                const s=stocks[ticker];if(!s)return null;
                const up=s.change>=0;const clr=up?C.green:C.red;
                const spark=SPARKS[ticker];
                const rangePct=s.high>s.low?Math.max(0,Math.min(((s.price-s.low)/(s.high-s.low))*100,100)):50;
                return(
                  <div key={ticker} className="card fade-up" style={{padding:"18px 20px",animationDelay:`${(i+2)*65}ms`,display:"flex",flexDirection:"column",gap:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}><span style={{fontSize:9,color:prof.color,fontFamily:C.mono,letterSpacing:".1em"}}>{s.symbol}</span><span className="tag tag-gold" style={{fontSize:8}}>{s.sector}</span></div>
                        <div style={{fontSize:13,color:C.text0,lineHeight:1.25,maxWidth:160}}>{s.name}</div>
                      </div>
                      <Sparkline data={spark} color={clr} w={78} h={30}/>
                    </div>
                    <div style={{display:"flex",alignItems:"baseline",gap:9,marginBottom:10}}>
                      <span style={{fontSize:26,color:C.text0,fontFamily:C.serif,fontWeight:400,lineHeight:1}}>{s.currency}{Number(s.price).toLocaleString("en-IN",{maximumFractionDigits:2})}</span>
                      <span style={{fontSize:11,color:clr,fontFamily:C.mono}}>{up?"+":""}{s.change.toFixed(2)}  {up?"+":""}{s.pct.toFixed(2)}%</span>
                    </div>
                    <div style={{marginBottom:10}}>
                      <div style={{position:"relative",height:3,background:C.border,borderRadius:2,marginBottom:4}}>
                        <div style={{position:"absolute",height:"100%",width:"100%",background:`${clr}18`,borderRadius:2}}/>
                        <div style={{position:"absolute",top:"50%",left:`${rangePct}%`,transform:"translate(-50%,-50%)",width:8,height:8,borderRadius:"50%",background:clr,boxShadow:`0 0 7px ${clr}90`}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:C.text3,fontFamily:C.mono}}>L {s.currency}{s.low}</span><span style={{fontSize:8,color:C.text3,fontFamily:C.mono}}>H {s.currency}{s.high}</span></div>
                    </div>
                    <div style={{display:"flex",gap:7,marginTop:"auto"}}>
                      <button className="btn-gold" style={{flex:1,padding:"7px 8px",fontSize:9}} onClick={()=>addToWatchlist(s)}>+ Watchlist</button>
                      <button className="btn-outline" style={{flex:1,padding:"7px 8px",fontSize:9}} onClick={()=>setDetail(s)}>Details →</button>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* AI PICKS TAB */}
      {tab==="suggest"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card fade-up" style={{padding:"16px 20px",background:"rgba(200,169,110,.04)",border:"1px solid rgba(200,169,110,.18)"}}>
            <div style={{fontSize:9,color:C.gold,letterSpacing:".12em",fontFamily:C.mono,marginBottom:6}}>◆ AI STOCK RECOMMENDATIONS · {prof.label} Profile</div>
            <div style={{fontSize:11,color:C.text2,fontFamily:C.mono,lineHeight:1.7}}>Personalised picks based on your ₹{(SAVINGS/1000).toFixed(0)}K monthly surplus and risk tolerance.</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:14}}>
            {(AI_STOCK_SUGGESTIONS[profile]||[]).map((sugg,i)=>{
              const s=MOCK_STOCKS[sugg.symbol];const sig=sugg.signal;
              const sigColor=sig==="BUY"?C.green:sig==="SELL"?C.red:C.gold;
              const up=s?s.pct>=0:true;
              return(
                <div key={sugg.symbol} className="card fade-up" style={{padding:"20px 22px",animationDelay:`${i*80}ms`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontSize:9,color:C.gold,fontFamily:C.mono,letterSpacing:".1em",marginBottom:4}}>{sugg.symbol}</div>
                      <div style={{fontSize:15,color:C.text0}}>{s?.name||sugg.symbol}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                      <span style={{padding:"3px 10px",background:`${sigColor}18`,border:`1px solid ${sigColor}40`,borderRadius:1,fontSize:9,color:sigColor,fontFamily:C.mono,letterSpacing:".1em",fontWeight:600}}>{sig}</span>
                      <span style={{fontSize:9,color:C.text3,fontFamily:C.mono}}>{sugg.confidence}% confidence</span>
                    </div>
                  </div>
                  {s&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontFamily:C.serif,fontSize:22,color:C.text0}}>{s.currency}{Number(s.price).toLocaleString("en-IN",{maximumFractionDigits:2})}</span><span style={{fontFamily:C.mono,fontSize:11,color:up?C.green:C.red}}>{up?"+":""}{s.pct?.toFixed(2)}% today</span></div>}
                  {SPARKS[sugg.symbol]&&<div style={{marginBottom:10}}><Sparkline data={SPARKS[sugg.symbol]} color={up?C.green:C.red} w={220} h={36}/></div>}
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".08em"}}>AI CONFIDENCE</span><span style={{fontSize:8,color:sigColor,fontFamily:C.mono}}>{sugg.confidence}%</span></div>
                    <div style={{height:3,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${sugg.confidence}%`,background:sigColor,borderRadius:2,transition:"width 1.2s ease"}}/></div>
                  </div>
                  <div style={{padding:"10px 12px",background:"rgba(200,169,110,.04)",border:"1px solid "+C.border,borderRadius:1,marginBottom:12}}>
                    <div style={{fontSize:8,color:C.gold,fontFamily:C.mono,letterSpacing:".1em",marginBottom:5}}>◆ AI ANALYSIS</div>
                    <div style={{fontSize:10,color:C.text2,fontFamily:C.mono,lineHeight:1.7}}>{sugg.reason}</div>
                  </div>
                  <div style={{display:"flex",gap:8,marginBottom:12}}>
                    <div style={{flex:1,padding:"8px 10px",background:C.bg3,border:"1px solid "+C.border,borderRadius:1,textAlign:"center"}}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".08em",marginBottom:3}}>TARGET</div><div style={{fontSize:15,color:C.gold,fontFamily:C.serif}}>{sugg.target}</div></div>
                    <div style={{flex:1,padding:"8px 10px",background:`${C.green}0d`,border:`1px solid ${C.green}28`,borderRadius:1,textAlign:"center"}}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".08em",marginBottom:3}}>UPSIDE</div><div style={{fontSize:15,color:C.green,fontFamily:C.serif}}>{sugg.upside}</div></div>
                  </div>
                  <button className="btn-gold" style={{width:"100%",padding:"7px"}} onClick={()=>s&&addToWatchlist(s)}>+ Add to Watchlist</button>
                </div>
              );
            })}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <SectorHeatmap/><MarketMovers/>
          </div>
          <div style={{padding:"10px 16px",background:"rgba(224,82,82,.05)",border:"1px solid rgba(224,82,82,.15)",borderRadius:1}}>
            <span style={{fontSize:9,color:C.text3,fontFamily:C.mono,lineHeight:1.8}}>⚠ AI suggestions are for informational purposes only and do not constitute financial advice. Always consult a SEBI-registered advisor before investing.</span>
          </div>
        </div>
      )}

      {/* SEARCH TAB */}
      {tab==="search"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="card fade-up" style={{padding:"20px 22px"}}>
            <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:14}}>Search Any Stock</div>
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              <input className="app-input" style={{flex:1}} placeholder="RELIANCE.NS  ·  TCS.NS  ·  AAPL  ·  NVDA" value={query} onChange={e=>setQuery(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&doSearch()}/>
              <button className="btn-gold" style={{padding:"11px 20px"}} onClick={doSearch} disabled={searching||!query.trim()}>{searching?<span className="spinner"/>:"Search →"}</button>
            </div>
            <div style={{fontSize:9,color:C.text3,fontFamily:C.mono}}>Indian NSE stocks: add .NS suffix  ·  US stocks: plain ticker (AAPL, MSFT, NVDA)</div>
          </div>
          <div className="card fade-up" style={{padding:"14px 18px",animationDelay:"60ms"}}>
            <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:10}}>Quick Search</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
              {["RELIANCE.NS","TCS.NS","INFY.NS","HDFCBANK.NS","ZOMATO.NS","AAPL","MSFT","NVDA","AMZN","GOOGL"].map(t=>(
                <button key={t} className="btn-outline" style={{padding:"4px 11px",fontSize:9}} onClick={()=>setQuery(t)}>{t}</button>
              ))}
            </div>
          </div>
          {searchRes&&(
            <div className="card fade-up" style={{padding:"24px 26px",animationDelay:"80ms"}}>
              {searchRes.error?<div style={{color:C.red,fontFamily:C.mono,fontSize:12}}>✗  {searchRes.error}</div>:(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
                    <div><div style={{fontSize:9,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:5}}>{searchRes.symbol} · <span style={{color:C.gold}}>{searchRes.sector}</span></div><div style={{fontFamily:C.serif,fontSize:24,color:C.text0,lineHeight:1.1}}>{searchRes.name}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:34,color:C.text0,fontFamily:C.serif,fontWeight:400,lineHeight:1}}>{searchRes.currency}{Number(searchRes.price).toLocaleString("en-IN",{maximumFractionDigits:2})}</div><div style={{fontSize:13,color:searchRes.change>=0?C.green:C.red,fontFamily:C.mono,marginTop:4}}>{searchRes.change>=0?"+":""}{searchRes.change?.toFixed(2)} ({searchRes.change>=0?"+":""}{searchRes.pct?.toFixed(2)}%)</div></div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
                    {[{label:"Day High",value:searchRes.currency+searchRes.high},{label:"Day Low",value:searchRes.currency+searchRes.low},{label:"Volume",value:searchRes.vol},{label:"Market Cap",value:searchRes.cap}].map(d=>(
                      <div key={d.label} style={{padding:"10px 12px",background:C.bg3,borderRadius:1,border:"1px solid "+C.border}}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:6,textTransform:"uppercase"}}>{d.label}</div><div style={{fontSize:15,color:C.text0,fontFamily:C.serif}}>{d.value}</div></div>
                    ))}
                  </div>
                  {SPARKS[searchRes.symbol]&&<div style={{marginBottom:18,padding:"12px 14px",background:C.bg3,border:"1px solid "+C.border,borderRadius:1}}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:10}}>7-DAY PRICE TREND</div><Sparkline data={SPARKS[searchRes.symbol]} color={searchRes.change>=0?C.green:C.red} w={320} h={48}/></div>}
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn-gold" style={{padding:"10px 20px"}} onClick={()=>addToWatchlist(searchRes)}>+ Add to Watchlist</button>
                    <button className="btn-outline" style={{padding:"10px 20px"}} onClick={()=>{setSearchRes(null);setQuery("");}}>Clear</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* MY WATCHLIST TAB */}
      {tab==="portfolio"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {watchlist.length===0?(
            <div style={{textAlign:"center",padding:52,color:C.text3,fontFamily:C.mono,fontSize:12,lineHeight:2}}>Your watchlist is empty.<br/>Add stocks from the Watchlist or Search tab.</div>
          ):(
            <>
              <div className="card fade-up" style={{padding:"14px 20px",display:"flex",gap:22,flexWrap:"wrap"}}>
                {[{label:"Holdings",value:watchlist.length+""},{label:"Gaining",value:watchlist.filter(s=>s.change>=0).length+"",color:C.green},{label:"Declining",value:watchlist.filter(s=>s.change<0).length+"",color:C.red},{label:"Avg Change",value:(watchlist.reduce((a,s)=>a+s.pct,0)/watchlist.length).toFixed(2)+"%",color:C.gold}].map(s=>(
                  <div key={s.label}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:4,textTransform:"uppercase"}}>{s.label}</div><div style={{fontSize:20,color:s.color||C.text0,fontFamily:C.serif}}>{s.value}</div></div>
                ))}
              </div>
              <div className="card fade-up" style={{animationDelay:"60ms"}}>
                <div style={{display:"grid",gridTemplateColumns:"2.5fr 1fr 1fr 1fr 1fr auto",padding:"10px 20px",borderBottom:"1px solid "+C.border,color:C.text3,fontSize:9,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>
                  {["Stock","Price","Change","7D Trend","Cap",""].map(h=><span key={h}>{h}</span>)}
                </div>
                {watchlist.map((s,i)=>(
                  <div key={s.symbol} className="trow" style={{display:"grid",gridTemplateColumns:"2.5fr 1fr 1fr 1fr 1fr auto",padding:"13px 20px",borderBottom:i<watchlist.length-1?"1px solid "+C.border:"none",alignItems:"center"}}>
                    <div><div style={{fontSize:9,color:C.text3,fontFamily:C.mono,letterSpacing:".08em"}}>{s.symbol}</div><div style={{color:C.text1,fontSize:13,marginTop:2}}>{s.name}</div></div>
                    <span style={{fontFamily:C.serif,fontSize:15,color:C.text0}}>{s.currency}{Number(s.price).toLocaleString("en-IN",{maximumFractionDigits:2})}</span>
                    <span style={{fontFamily:C.mono,fontSize:12,color:s.change>=0?C.green:C.red}}>{s.change>=0?"+":""}{s.pct?.toFixed(2)}%</span>
                    <Sparkline data={SPARKS[s.symbol]} color={s.change>=0?C.green:C.red} w={65} h={22}/>
                    <span style={{fontFamily:C.mono,fontSize:11,color:C.text2}}>{s.cap}</span>
                    <button onClick={()=>setWatchlist(p=>p.filter(x=>x.symbol!==s.symbol))} style={{background:"rgba(224,82,82,.08)",border:"1px solid rgba(224,82,82,.22)",color:C.red,padding:"4px 10px",fontFamily:C.mono,fontSize:9,cursor:"pointer",borderRadius:1}}>✕</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* MOVERS TAB */}
      {tab==="movers"&&(
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><SectorHeatmap/><MarketMovers/></div>
        </div>
      )}

      {/* Detail modal */}
      {detail&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDetail(null)}>
          <div className="card fade-up" style={{width:440,padding:"28px 30px",position:"relative",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setDetail(null)} style={{position:"absolute",top:14,right:16,background:"none",border:"none",color:C.text3,fontSize:18,cursor:"pointer"}}>✕</button>
            <div style={{fontSize:9,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:5}}>{detail.symbol} · {detail.sector}</div>
            <div style={{fontFamily:C.serif,fontSize:22,color:C.text0,marginBottom:4}}>{detail.name}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:16}}>
              <span style={{fontSize:36,color:C.text0,fontFamily:C.serif,fontWeight:400}}>{detail.currency}{Number(detail.price).toLocaleString("en-IN",{maximumFractionDigits:2})}</span>
              <span style={{fontSize:14,color:detail.change>=0?C.green:C.red,fontFamily:C.mono}}>{detail.change>=0?"+":""}{detail.change?.toFixed(2)} ({detail.change>=0?"+":""}{detail.pct?.toFixed(2)}%)</span>
            </div>
            {SPARKS[detail.symbol]&&<div style={{marginBottom:18,padding:"14px",background:C.bg3,border:"1px solid "+C.border,borderRadius:1}}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:10}}>7-DAY PRICE TREND</div><Sparkline data={SPARKS[detail.symbol]} color={detail.change>=0?C.green:C.red} w={370} h={55}/></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
              {[{label:"Day High",value:detail.currency+detail.high},{label:"Day Low",value:detail.currency+detail.low},{label:"Volume",value:detail.vol},{label:"Market Cap",value:detail.cap}].map(d=>(
                <div key={d.label} style={{padding:"10px 12px",background:C.bg3,borderRadius:1,border:"1px solid "+C.border}}><div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:5,textTransform:"uppercase"}}>{d.label}</div><div style={{fontSize:16,color:C.text0,fontFamily:C.serif}}>{d.value}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-gold" style={{flex:1,padding:"11px"}} onClick={()=>{addToWatchlist(detail);setDetail(null);}}>+ Add to Watchlist</button>
              <button className="btn-outline" style={{flex:1,padding:"11px"}} onClick={()=>setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { StocksInvest };