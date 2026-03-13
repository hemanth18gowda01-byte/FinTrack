import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { C, fmt, fmtDate } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { MOCK_TXN, MOCK_LOAN, MONTHLY_DATA, DAILY_DATA, CAT_DATA } from "../constants/mockData";
import { StatCard } from "../components/StatCard";
import { CustomTooltip } from "../components/CustomTooltip";

function SpendingBudgetCard() {
  const [hovered, setHovered] = useState(null);
  const totalSpent  = CAT_DATA.reduce((a,c)=>a+c.value,0);
  const totalBudget = CAT_DATA.reduce((a,c)=>a+c.budget,0);
  const totalExcess = CAT_DATA.reduce((a,c)=>a+Math.max(0,c.value-c.budget),0);
  const overCount   = CAT_DATA.filter(c=>c.value>c.budget).length;
  const active = hovered !== null ? CAT_DATA[hovered] : null;

  return (
    <div className="card fade-up" style={{padding:"20px 22px",animationDelay:"260ms"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>Spending by Category</div>
        {totalExcess > 0
          ? <div style={{textAlign:"right"}}><div style={{fontSize:8,color:C.red,fontFamily:C.mono}}>OVER BUDGET</div><div style={{fontSize:14,color:C.red,fontFamily:C.serif,lineHeight:1.1}}>+{fmt(totalExcess)}</div></div>
          : <span className="tag tag-green" style={{fontSize:8}}>✓ On Track</span>
        }
      </div>
      <div style={{position:"relative",display:"flex",justifyContent:"center",marginBottom:14}}>
        <PieChart width={210} height={210}>
          <Pie data={CAT_DATA.map(c=>({name:c.name,value:c.budget,color:c.color}))} cx={100} cy={100} innerRadius={42} outerRadius={60} paddingAngle={2} dataKey="value" isAnimationActive={false}>
            {CAT_DATA.map((c,i) => <Cell key={i} fill={c.color} opacity={0.28} strokeWidth={0}/>)}
          </Pie>
          <Pie data={CAT_DATA} cx={100} cy={100} innerRadius={64} outerRadius={90} paddingAngle={2} dataKey="value"
            onMouseEnter={(_,i)=>setHovered(i)} onMouseLeave={()=>setHovered(null)}>
            {CAT_DATA.map((c,i) => (
              <Cell key={i} fill={c.value>c.budget?C.red:c.color} opacity={hovered===null||hovered===i?1:0.35}
                strokeWidth={hovered===i?2:0} stroke={hovered===i?C.goldL:"none"} style={{cursor:"pointer"}}/>
            ))}
          </Pie>
        </PieChart>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
          {active ? (
            <>
              <div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:3}}>{active.name.toUpperCase()}</div>
              <div style={{fontSize:17,fontFamily:C.serif,color:active.value>active.budget?C.red:C.gold,lineHeight:1}}>{fmt(active.value)}</div>
              {active.value>active.budget
                ? <div style={{fontSize:9,color:C.red,fontFamily:C.mono,marginTop:3}}>+{fmt(active.value-active.budget)} over</div>
                : <div style={{fontSize:9,color:C.green,fontFamily:C.mono,marginTop:3}}>-{fmt(active.budget-active.value)} left</div>
              }
            </>
          ) : (
            <>
              <div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".08em",marginBottom:3}}>TOTAL SPENT</div>
              <div style={{fontSize:17,fontFamily:C.serif,color:totalSpent>totalBudget?C.red:C.gold,lineHeight:1}}>{fmt(totalSpent)}</div>
              <div style={{fontSize:8,color:C.text3,fontFamily:C.mono,marginTop:3}}>of {fmt(totalBudget)}</div>
            </>
          )}
        </div>
      </div>
      <div style={{marginBottom:12,padding:"8px 11px",background:"rgba(200,169,110,.04)",border:"1px solid "+C.border,borderRadius:1}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:9,color:C.text3,fontFamily:C.mono,letterSpacing:".08em"}}>BUDGET UTILISATION</span>
          <span style={{fontSize:9,fontFamily:C.mono,color:totalSpent>totalBudget?C.red:C.green}}>{fmt(totalSpent)} / {fmt(totalBudget)}</span>
        </div>
        <div style={{height:4,background:C.border,borderRadius:3,overflow:"hidden",position:"relative"}}>
          <div style={{height:"100%",width:`${Math.min((totalSpent/totalBudget)*100,100)}%`,background:totalSpent>totalBudget?`linear-gradient(90deg,${C.gold},${C.red})`:`linear-gradient(90deg,${C.green},${C.gold})`,borderRadius:3,transition:"width 1s ease"}}/>
        </div>
        {overCount>0 && <div style={{fontSize:8,color:C.red,fontFamily:C.mono,marginTop:4,letterSpacing:".06em"}}>↑ {overCount} {overCount===1?"category":"categories"} exceeded budget limit</div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {CAT_DATA.map((c,i) => {
          const pct=Math.min((c.value/c.budget)*100,100);
          const isOver=c.value>c.budget;
          return (
            <div key={c.name} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
              style={{cursor:"default",padding:"5px 6px",borderRadius:1,background:hovered===i?"rgba(200,169,110,.04)":"transparent",transition:"background .15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <span style={{display:"flex",alignItems:"center",gap:5,color:hovered===i?C.text0:C.text1,fontSize:11,transition:"color .15s"}}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:isOver?C.red:c.color,display:"inline-block",flexShrink:0}}/>
                  {c.name}
                </span>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  {isOver
                    ? <span style={{fontSize:9,color:C.red,fontFamily:C.mono,background:"rgba(224,82,82,.1)",border:"1px solid rgba(224,82,82,.2)",padding:"1px 6px",borderRadius:1}}>+{fmt(c.value-c.budget)} over</span>
                    : <span style={{fontSize:9,color:C.green,fontFamily:C.mono,background:"rgba(76,175,120,.07)",border:"1px solid rgba(76,175,120,.14)",padding:"1px 6px",borderRadius:1}}>-{fmt(c.budget-c.value)} left</span>
                  }
                  <span style={{fontSize:11,color:isOver?C.red:C.text1,fontFamily:C.mono,minWidth:50,textAlign:"right"}}>{fmt(c.value)}</span>
                </div>
              </div>
              <div style={{position:"relative",height:4,background:C.border,borderRadius:2}}>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:"100%",background:`${c.color}22`,borderRadius:2}}/>
                <div style={{position:"absolute",top:0,left:0,height:"100%",width:`${pct}%`,background:isOver?C.red:pct>=80?C.gold:C.green,borderRadius:2,transition:"width .9s ease"}}/>
                {isOver && <div style={{position:"absolute",top:-4,left:"calc(100% - 1px)",width:2,height:12,background:C.red,borderRadius:1,opacity:.8}}/>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                <span style={{fontSize:8,color:isOver?C.red:C.text3,fontFamily:C.mono}}>{Math.round((c.value/c.budget)*100)}% used</span>
                <span style={{fontSize:8,color:C.text3,fontFamily:C.mono}}>cap {fmt(c.budget)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Trend Chart ── */
function TrendChart() {
  const [view, setView] = useState("monthly");
  const [activeCat, setActiveCat] = useState("all");
  const dailyCategories = [
    {key:"all",label:"All Spend",color:C.gold},{key:"food",label:"Food",color:"#c8a96e"},
    {key:"shopping",label:"Shopping",color:"#e8d5b0"},{key:"transport",label:"Transport",color:"#a08c5c"},{key:"others",label:"Others",color:"#7a6840"},
  ];
  const dailyDisplayData = DAILY_DATA.map(d => ({...d, spend:activeCat==="all"?d.expenses:d[activeCat]}));
  const totalSpent  = DAILY_DATA.reduce((a,d)=>a+d.expenses,0);
  const spendDays   = DAILY_DATA.filter(d=>d.expenses>0).length;
  const avgDaily    = Math.round(totalSpent/spendDays);
  const peakDay     = DAILY_DATA.reduce((a,d)=>d.expenses>a.expenses?d:a,DAILY_DATA[0]);

  return (
    <div className="card fade-up" style={{padding:"20px 22px",animationDelay:"200ms"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>
          {view==="monthly"?"6-Month Income vs Expenses":"Daily Spending — March 2025"}
        </div>
        <div style={{display:"flex",gap:2,background:"rgba(200,169,110,.06)",border:"1px solid "+C.border,borderRadius:2,padding:2}}>
          {[{id:"monthly",label:"Monthly"},{id:"daily",label:"Daily"}].map(t => (
            <button key={t.id} onClick={()=>setView(t.id)} style={{padding:"4px 12px",borderRadius:1,border:"none",cursor:"pointer",fontFamily:C.mono,fontSize:9,letterSpacing:".08em",textTransform:"uppercase",background:view===t.id?C.gold:"transparent",color:view===t.id?"#08090a":C.text3,transition:"all .18s"}}>{t.label}</button>
          ))}
        </div>
      </div>
      {view==="monthly" && (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY_DATA}>
            <defs>
              <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.green} stopOpacity={0.15}/><stop offset="95%" stopColor={C.green} stopOpacity={0}/></linearGradient>
              <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.15}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke={C.border}/>
            <XAxis dataKey="month" tick={{fontSize:9,fill:C.text3,fontFamily:C.mono}} axisLine={{stroke:C.border}} tickLine={false}/>
            <YAxis tick={{fontSize:9,fill:C.text3,fontFamily:C.mono}} axisLine={false} tickLine={false} tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="income" name="Income" stroke={C.green} strokeWidth={1.5} fill="url(#gI)" dot={{r:2.5,fill:C.green}}/>
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke={C.gold} strokeWidth={1.5} fill="url(#gE)" dot={{r:2.5,fill:C.gold}}/>
          </AreaChart>
        </ResponsiveContainer>
      )}
      {view==="daily" && (
        <div>
          <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
            {[{label:"Total Spent",value:fmt(totalSpent),color:C.text1},{label:"Avg/Spend Day",value:fmt(avgDaily),color:C.gold},{label:"Peak Day",value:peakDay.day,color:C.red},{label:"Active Days",value:`${spendDays}/14`,color:C.green}].map(s=>(
              <div key={s.label} style={{padding:"6px 11px",background:"rgba(200,169,110,.05)",border:"1px solid "+C.border,borderRadius:1}}>
                <div style={{fontSize:8,color:C.text3,fontFamily:C.mono,letterSpacing:".1em",marginBottom:3}}>{s.label.toUpperCase()}</div>
                <div style={{fontSize:13,color:s.color,fontFamily:C.serif}}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
            {dailyCategories.map(cat=>(
              <button key={cat.key} onClick={()=>setActiveCat(cat.key)} style={{padding:"3px 10px",borderRadius:1,border:`1px solid ${activeCat===cat.key?cat.color:C.border}`,background:activeCat===cat.key?`${cat.color}18`:"transparent",color:activeCat===cat.key?cat.color:C.text3,fontFamily:C.mono,fontSize:9,letterSpacing:".07em",textTransform:"uppercase",cursor:"pointer",transition:"all .15s"}}>{cat.label}</button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyDisplayData} barCategoryGap="28%">
              <CartesianGrid strokeDasharray="2 4" stroke={C.border} vertical={false}/>
              <XAxis dataKey="day" tick={{fontSize:8,fill:C.text3,fontFamily:C.mono}} axisLine={{stroke:C.border}} tickLine={false} tickFormatter={d=>d.split(" ")[1]}/>
              <YAxis tick={{fontSize:8,fill:C.text3,fontFamily:C.mono}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?"₹"+Math.round(v/1000)+"k":"₹"+v} width={36}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="spend" name="Spent" radius={[2,2,0,0]} fill={dailyCategories.find(c=>c.key===activeCat)?.color||C.gold} opacity={0.85}/>
              <Bar dataKey="income" name="Income" radius={[2,2,0,0]} fill={C.green} opacity={0.5}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({token, toast}) {
  const [txs,  setTxs]  = useState(MOCK_TXN);
  const [loan, setLoan] = useState(MOCK_LOAN);
  useEffect(() => {
    if (token===DEMO_TOKEN) return;
    Promise.all([api.getTransactions(token),api.getLoanSuggestions(token)])
      .then(([t,l])=>{if(Array.isArray(t))setTxs(t);if(l&&!l.error)setLoan(l);toast.show("Data synced","success");})
      .catch(()=>toast.show("Using demo data","info"));
  },[token]);
  const totalIncome   = txs.filter(t=>t.type==="credit").reduce((a,t)=>a+t.amount,0);
  const totalExpenses = txs.filter(t=>t.type==="debit" ).reduce((a,t)=>a+t.amount,0);
  const savings       = totalIncome - totalExpenses;
  const savingsRate   = totalIncome>0?((savings/totalIncome)*100).toFixed(1):0;
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:24}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:8}}>{new Date().toLocaleDateString("en-IN",{weekday:"long",month:"long",day:"numeric",year:"numeric"}).toUpperCase()}</div>
        <h1 style={{fontFamily:C.serif,fontSize:30,fontWeight:400,color:C.text0,lineHeight:1.1}}>Financial <em style={{fontStyle:"italic",color:C.gold}}>Overview</em></h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        <StatCard label="Total Income"     value={fmt(totalIncome)}              color={C.green} icon="↑" delay={0}/>
        <StatCard label="Total Expenses"   value={fmt(totalExpenses)}            color={C.text0} icon="↓" delay={60}/>
        <StatCard label="Net Savings"      value={fmt(savings)}                  color={C.gold}  icon="◈" sub={`${savingsRate}% savings rate`} delay={120}/>
        <StatCard label="Recommended Loan" value={fmt(loan.recommended_loan||0)} color={C.blue}  icon="◉" delay={180}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:14}}>
        <TrendChart/>
        <SpendingBudgetCard/>
      </div>
      <div className="card fade-up" style={{animationDelay:"320ms"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid "+C.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>Recent Transactions</span>
          <span className="tag tag-gold">{txs.length} total</span>
        </div>
        {txs.slice(0,5).map((tx,i)=>(
          <div key={tx.id} style={{display:"grid",gridTemplateColumns:"1fr auto",padding:"12px 20px",borderBottom:i<4?"1px solid "+C.border:"none",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(200,169,110,.03)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:32,height:32,borderRadius:1,background:"rgba(200,169,110,.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:tx.type==="credit"?C.green:C.text2,flexShrink:0}}>{tx.type==="credit"?"↑":"↓"}</div>
              <div>
                <div style={{color:C.text1,fontSize:13}}>{tx.merchant}</div>
                <div style={{color:C.text3,fontSize:10,fontFamily:C.mono,marginTop:2}}>{tx.category} · {fmtDate(tx.date)}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span className={tx.type==="credit"?"tag tag-green":"tag tag-red"}>{tx.type==="credit"?"CREDIT":"DEBIT"}</span>
              <span style={{color:tx.type==="credit"?C.green:C.text0,fontSize:15,fontFamily:C.serif}}>{tx.type==="credit"?"+":"-"}{fmt(tx.amount)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="card fade-up" style={{padding:"20px 22px",animationDelay:"380ms"}}>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:16}}>Loan Profile Snapshot</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
          {[{label:"Monthly Income",value:fmt(loan.monthly_income||0)},{label:"Monthly Expenses",value:fmt(loan.monthly_expenses||0)},{label:"Monthly Savings",value:fmt(loan.monthly_savings||0),color:C.green},{label:"Max Affordable EMI",value:fmt(loan.affordable_emi||0),color:C.gold}].map(s=>(
            <div key={s.label} style={{padding:"12px 14px",background:C.bg3,borderRadius:1,border:"1px solid "+C.border}}>
              <div style={{fontSize:8,color:C.text3,letterSpacing:".1em",fontFamily:C.mono,marginBottom:8}}>{s.label.toUpperCase()}</div>
              <div style={{fontSize:17,color:s.color||C.text0,fontFamily:C.serif}}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export { Dashboard, TrendChart, SpendingBudgetCard };
