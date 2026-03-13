import { useState, useEffect, useRef } from "react";
import { C, fmt } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { CAT_DATA } from "../constants/mockData";

const AI_DEMOS = {
  spending:"Based on your transactions, Shopping leads at ₹5,540, followed by Food at ₹3,630. These two categories account for 56% of monthly expenses. Setting a ₹4,000 shopping cap and ₹3,000 food cap saves ₹2,170/month.",
  saving:  "Your savings rate of 57.3% is exceptional — 2.8× the recommended 20%. With ₹43,000 saved monthly, you\'ll build a 6-month emergency fund (₹2,58,000) in just 6 months.",
  cut:     "Three quick wins:\n1. Share Netflix (₹649) with family — saves ₹400/month.\n2. Reduce food delivery (₹830 total) by cooking twice a week — saves ₹300.\n3. Off-peak BESCOM usage reduces electricity by 15%.",
  loan:    "Profile: income ₹75,000, expenses ₹32,000, savings ₹43,000 — you can afford EMI up to ₹21,500/month. This qualifies you for loans up to ₹5,00,000 at 10.5% over 5 years with EMI ₹10,800.",
  plan:    "3-Step Savings Plan:\n1. Emergency Fund: ₹2,50,000 target → ₹20,000/month → ready in 12 months.\n2. Investments: ₹15,000/month into index funds (projected 12% p.a.).\n3. Short-term RD: ₹8,000/month for goals under 2 years.\n\nEstimated 3-year corpus: ₹8,50,000+",
};

function AIInsights({token, toast}) {
  const [messages,setMessages]=useState([{role:"ai",text:"Hello! I'm your AI financial advisor. I've analysed your transaction history, spending patterns, and savings rate.\n\nWhat would you like to know today?"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const endRef=useRef(null);
  const QUICK=["Where am I spending most?","Am I saving enough?","How can I cut expenses?","What loan can I afford?","Give me a savings plan."];
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send=async(text)=>{
    const msg=(text||input).trim();
    if(!msg||loading)return;
    setInput("");
    setMessages(p=>[...p,{role:"user",text:msg}]);
    setLoading(true);
    try{
      let reply;
      if(token===DEMO_TOKEN){await new Promise(r=>setTimeout(r,1100));const key=Object.keys(AI_DEMOS).find(k=>msg.toLowerCase().includes(k));reply=AI_DEMOS[key]||"I've reviewed your financial data. Income ₹75,000/month, expenses ₹32,000, savings ₹43,000. Financial health score: 8.2/10. What specific area would you like to explore?";}
      else{const data=await api.getAIInsights(token,msg);reply=data.text||data.insight||data.message||"Analysis received.";}
      setMessages(p=>[...p,{role:"ai",text:reply}]);
    }catch(e){setMessages(p=>[...p,{role:"ai",text:"Unable to reach AI service. Please try again."}]);}
    setLoading(false);
  };
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:18,height:"calc(100vh - 40px)"}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:8}}>POWERED BY AI</div>
        <h1 style={{fontFamily:C.serif,fontSize:28,fontWeight:400,color:C.text0}}>AI Financial <em style={{fontStyle:"italic",color:C.gold}}>Advisor</em></h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:14,flex:1,minHeight:0}}>
        <div className="card" style={{display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"10px 18px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite"}}/>
            <span style={{color:C.text2,fontSize:9,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>AI Advisor · Online</span>
            <span style={{marginLeft:"auto"}} className="tag tag-gold">GPT-4 / Gemini</span>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:14}}>
            {messages.map((m,i)=>(
              <div key={i} style={{display:"flex",gap:10,flexDirection:m.role==="user"?"row-reverse":"row",animation:"fadeUp .3s ease"}}>
                <div style={{width:28,height:28,borderRadius:1,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,background:m.role==="user"?C.goldD:"rgba(200,169,110,.1)",border:"1px solid "+C.border,color:m.role==="user"?C.goldL:C.gold}}>{m.role==="user"?"U":"◆"}</div>
                <div style={{maxWidth:"80%",padding:"12px 16px",borderRadius:1,fontSize:13,lineHeight:1.8,background:m.role==="user"?"rgba(200,169,110,.1)":"rgba(255,255,255,.03)",border:`1px solid ${m.role==="user"?"rgba(200,169,110,.25)":C.border}`,color:C.text1,fontFamily:C.mono,whiteSpace:"pre-wrap",letterSpacing:".02em"}}>{m.text}</div>
              </div>
            ))}
            {loading&&(<div style={{display:"flex",gap:10}}><div style={{width:28,height:28,borderRadius:1,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(200,169,110,.1)",border:"1px solid "+C.border,color:C.gold}}>◆</div><div style={{padding:"14px 18px",background:"rgba(255,255,255,.03)",border:"1px solid "+C.border,borderRadius:1,display:"flex",gap:6,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:"50%",background:C.gold,animation:"pulse 1.2s infinite",animationDelay:`${i*.2}s`}}/>)}</div></div>)}
            <div ref={endRef}/>
          </div>
          <div style={{padding:"10px 14px",borderTop:"1px solid "+C.border}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {QUICK.map(q=><button key={q} className="btn-ghost" style={{padding:"4px 10px",fontSize:9,textTransform:"none",letterSpacing:".02em"}} onClick={()=>send(q)} disabled={loading}>{q}</button>)}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input className="app-input" placeholder="Ask about your finances…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} disabled={loading}/>
              <button className="btn-primary" style={{padding:"11px 18px",flexShrink:0}} onClick={()=>send()} disabled={loading||!input.trim()}>{loading?<span className="spinner"/>:"→"}</button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12,overflowY:"auto"}}>
          <div className="card" style={{padding:18}}>
            <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:14}}>Financial Snapshot</div>
            {[{label:"Monthly Income",value:fmt(75000),color:C.green},{label:"Monthly Expenses",value:fmt(32000),color:C.text0},{label:"Net Savings",value:fmt(43000),color:C.gold},{label:"Savings Rate",value:"57.3%",color:C.blue}].map(s=>(
              <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid "+C.border}}>
                <span style={{color:C.text3,fontSize:11,fontFamily:C.mono}}>{s.label}</span>
                <span style={{color:s.color,fontSize:14,fontFamily:C.serif}}>{s.value}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:18}}>
            <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:14}}>Top Categories</div>
            {CAT_DATA.slice(0,5).map(c=>{const total=CAT_DATA.reduce((a,x)=>a+x.value,0);return(
              <div key={c.name} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:4}}>
                  <span style={{color:C.text2,display:"flex",alignItems:"center",gap:5}}><span style={{width:5,height:5,borderRadius:"50%",background:c.color,display:"inline-block"}}/>{c.name}</span>
                  <span style={{color:C.text1,fontFamily:C.mono}}>{((c.value/total)*100).toFixed(0)}%</span>
                </div>
                <div style={{height:3,background:C.border,borderRadius:1,overflow:"hidden"}}><div style={{height:"100%",width:`${(c.value/total)*100}%`,background:c.color,borderRadius:1}}/></div>
              </div>
            );})}
          </div>
          <div className="card" style={{padding:18}}>
            <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:12}}>AI Tips</div>
            {["Your Food spending is 11% above average.","You qualify for a ₹5L home loan.","Savings rate is excellent at 57%.","Consider SIP of ₹15,000/month."].map((tip,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:10,alignItems:"flex-start"}}>
                <span style={{color:C.gold,fontSize:11,flexShrink:0,marginTop:1}}>◆</span>
                <span style={{color:C.text2,fontSize:11,fontFamily:C.mono,lineHeight:1.6}}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


export { AIInsights };