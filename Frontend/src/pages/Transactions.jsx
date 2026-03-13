import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { C, fmt, fmtDate } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { MOCK_TXN, MONTHLY_DATA, CAT_DATA } from "../constants/mockData";
import { CustomTooltip } from "../components/CustomTooltip";

function Transactions({token, toast}) {
  const [txs,setTxs]=useState(MOCK_TXN);
  const [search,setSearch]=useState("");
  const [typeFilter,setTypeFilter]=useState("all");
  const [loading,setLoading]=useState(false);
  useEffect(()=>{if(token===DEMO_TOKEN)return;setLoading(true);api.getTransactions(token).then(t=>{if(Array.isArray(t))setTxs(t);}).catch(()=>toast.show("Using demo data","info")).finally(()=>setLoading(false));},[token]);
  const filtered=useMemo(()=>txs.filter(t=>{const s=search.toLowerCase();return(!search||t.merchant.toLowerCase().includes(s)||(t.category||"").toLowerCase().includes(s))&&(typeFilter==="all"||t.type===typeFilter);}),[txs,search,typeFilter]);
  const income=txs.filter(t=>t.type==="credit").reduce((a,t)=>a+t.amount,0);
  const expenses=txs.filter(t=>t.type==="debit").reduce((a,t)=>a+t.amount,0);
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:20}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:8}}>ACTIVITY LOG</div>
        <h1 style={{fontFamily:C.serif,fontSize:28,fontWeight:400,color:C.text0}}>All <em style={{fontStyle:"italic",color:C.gold}}>Transactions</em></h1>
        <p style={{color:C.text3,fontFamily:C.mono,fontSize:10,marginTop:6,letterSpacing:".06em"}}>{txs.length} records · Income {fmt(income)} · Expenses {fmt(expenses)}</p>
      </div>
      <div className="card fade-up" style={{padding:14,display:"flex",gap:10,flexWrap:"wrap",animationDelay:"80ms"}}>
        <input className="app-input" style={{flex:"1 1 200px"}} placeholder="🔍  Search merchant or category…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="app-input" style={{flex:"1 1 140px",maxWidth:180}} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
          <option value="all">All Types</option><option value="credit">Income Only</option><option value="debit">Debit Only</option>
        </select>
      </div>
      <div className="card fade-up" style={{animationDelay:"140ms"}}>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"10px 20px",borderBottom:"1px solid "+C.border,color:C.text3,fontSize:9,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>
          {["Merchant","Category","Date","Type","Amount"].map(h=><span key={h}>{h}</span>)}
        </div>
        {loading&&[1,2,3].map(i=>(<div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"14px 20px",borderBottom:"1px solid "+C.border,gap:12}}>{[180,80,90,60,80].map((w,j)=><div key={j} className="shimmer" style={{height:14,width:w}}/>)}</div>))}
        {!loading&&filtered.length===0&&<div style={{padding:40,textAlign:"center",color:C.text3,fontFamily:C.mono,fontSize:12}}>No transactions match your filters.</div>}
        {filtered.map((tx,i)=>(
          <div key={tx.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"13px 20px",borderBottom:i<filtered.length-1?"1px solid "+C.border:"none",alignItems:"center",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(200,169,110,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:13,color:tx.type==="credit"?C.green:C.text2}}>{tx.type==="credit"?"↑":"↓"}</span><span style={{color:C.text1,fontSize:13}}>{tx.merchant}</span></div>
            <span className={`tag ${tx.category==="Income"?"tag-green":"tag-gold"}`} style={{width:"fit-content"}}>{tx.category||"—"}</span>
            <span style={{color:C.text3,fontSize:11,fontFamily:C.mono}}>{fmtDate(tx.date)}</span>
            <span className={tx.type==="credit"?"tag tag-green":"tag tag-red"}>{tx.type==="credit"?"CREDIT":"DEBIT"}</span>
            <span style={{color:tx.type==="credit"?C.green:C.text0,fontSize:15,fontFamily:C.serif}}>{tx.type==="credit"?"+":"-"}{fmt(tx.amount)}</span>
          </div>
        ))}
      </div>
      <div className="card fade-up" style={{padding:"20px 22px",animationDelay:"200ms"}}>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:16}}>Monthly Spending Trend</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="2 4" stroke={C.border}/>
            <XAxis dataKey="month" tick={{fontSize:9,fill:C.text3,fontFamily:C.mono}} axisLine={{stroke:C.border}} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:C.text3,fontFamily:C.mono}} axisLine={false} tickLine={false} tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/>
            <Tooltip content={<CustomTooltip/>}/><Legend wrapperStyle={{fontSize:9,fontFamily:C.mono,color:C.text2}}/>
            <Bar dataKey="income" name="Income" fill={C.green} radius={[2,2,0,0]} opacity={.75}/>
            <Bar dataKey="expenses" name="Expenses" fill={C.gold} radius={[2,2,0,0]} opacity={.75}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── AI Insights ── */
const AI_DEMOS = {
  spending:"Based on your transactions, Shopping leads at ₹5,540, followed by Food at ₹3,630. These two categories account for 56% of monthly expenses. Setting a ₹4,000 shopping cap and ₹3,000 food cap saves ₹2,170/month.",
  saving:  "Your savings rate of 57.3% is exceptional — 2.8× the recommended 20%. With ₹43,000 saved monthly, you'll build a 6-month emergency fund (₹2,58,000) in just 6 months.",
  cut:     "Three quick wins:\n1. Share Netflix (₹649) with family — saves ₹400/month.\n2. Reduce food delivery (₹830 total) by cooking twice a week — saves ₹300.\n3. Off-peak BESCOM usage reduces electricity by 15%.",
  loan:    "Profile: income ₹75,000, expenses ₹32,000, savings ₹43,000 — you can afford EMI up to ₹21,500/month. This qualifies you for loans up to ₹5,00,000 at 10.5% over 5 years with EMI ₹10,800.",
  plan:    "3-Step Savings Plan:\n1. Emergency Fund: ₹2,50,000 target → ₹20,000/month → ready in 12 months.\n2. Investments: ₹15,000/month into index funds (projected 12% p.a.).\n3. Short-term RD: ₹8,000/month for goals under 2 years.\n\nEstimated 3-year corpus: ₹8,50,000+",
};

export { Transactions };