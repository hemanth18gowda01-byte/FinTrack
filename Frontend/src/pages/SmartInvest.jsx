import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { C, fmt } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { MOCK_TXN } from "../constants/mockData";

function SmartInvest({token, toast}) {
  const [txs, setTxs] = useState(MOCK_TXN);
  const [monthlyInvest, setMonthlyInvest] = useState(null);
  const [tenure, setTenure] = useState(5);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (token === DEMO_TOKEN) return;
    api.getTransactions(token).then(t => { if (Array.isArray(t) && t.length) setTxs(t); }).catch(() => {});
  }, [token]);

  // Derive from transactions
  const totalIncome   = txs.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txs.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const freeSavings   = totalIncome - totalExpenses;

  // Category breakdown
  const byCategory = {};
  txs.filter(t => t.type === "debit").forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  // Investable = savings after keeping 20% as emergency buffer
  const emergencyBuffer  = Math.round(freeSavings * 0.20);
  const investable       = Math.max(0, freeSavings - emergencyBuffer);

  // Investment allocation tiers
  const TIERS = [
    { label:"Conservative",  pct:0.30, color:"#4caf78",  icon:"◈", desc:"30% of investable surplus" },
    { label:"Moderate",      pct:0.50, color:"#c8a96e",  icon:"◆", desc:"50% of investable surplus" },
    { label:"Aggressive",    pct:0.80, color:"#5b8fd4",  icon:"◲", desc:"80% of investable surplus" },
  ];

  const INVESTMENT_OPTIONS = [
    {
      id:"sip_nifty",
      name:"Nifty 50 Index SIP",
      type:"Mutual Fund",
      rateMin:10, rateMax:14,
      riskLabel:"Low-Medium",
      riskColor:"#4caf78",
      icon:"📈",
      tags:["Diversified","Tax Efficient","ELSS available"],
      desc:"Tracks India's top 50 companies. Best for long-term wealth creation with minimal effort.",
      minAmount:500,
    },
    {
      id:"sip_midcap",
      name:"Midcap 150 SIP",
      type:"Mutual Fund",
      rateMin:13, rateMax:18,
      riskLabel:"Medium",
      riskColor:"#c8a96e",
      icon:"🚀",
      tags:["High Growth","5yr+ horizon","Volatile short-term"],
      desc:"Mid-size companies with higher growth potential. Suitable for 5+ year horizon.",
      minAmount:1000,
    },
    {
      id:"ppf",
      name:"PPF (Public Provident Fund)",
      type:"Government Scheme",
      rateMin:7.1, rateMax:7.1,
      riskLabel:"Zero Risk",
      riskColor:"#4caf78",
      icon:"🏛️",
      tags:["Tax-Free Returns","80C Deduction","15yr lock-in"],
      desc:"Government-backed, completely tax-free. Best for conservative investors seeking safety.",
      minAmount:500,
    },
    {
      id:"nps",
      name:"NPS (National Pension System)",
      type:"Pension",
      rateMin:8, rateMax:10,
      riskLabel:"Low-Medium",
      riskColor:"#4caf78",
      icon:"🎯",
      tags:["Retirement focus","Extra 50K deduction","Market-linked"],
      desc:"Great for retirement planning. Extra ₹50K tax deduction over 80C under 80CCD(1B).",
      minAmount:500,
    },
    {
      id:"stocks_bluechip",
      name:"Blue-chip Stocks (Direct)",
      type:"Direct Equity",
      rateMin:12, rateMax:20,
      riskLabel:"Medium-High",
      riskColor:"#e8a540",
      icon:"💹",
      tags:["Direct ownership","Dividend income","Research needed"],
      desc:"Reliance, HDFC, TCS, Infosys etc. Higher returns but requires active tracking.",
      minAmount:2000,
    },
    {
      id:"fd",
      name:"Fixed Deposit (Bank FD)",
      type:"Fixed Income",
      rateMin:6.5, rateMax:7.5,
      riskLabel:"Zero Risk",
      riskColor:"#4caf78",
      icon:"🏦",
      tags:["Guaranteed returns","Flexible tenure","Premature withdrawal"],
      desc:"Safe, predictable returns. Good for parking emergency fund or short-term goals.",
      minAmount:1000,
    },
    {
      id:"gold_sgb",
      name:"Sovereign Gold Bond (SGB)",
      type:"Gold",
      rateMin:8, rateMax:13,
      riskLabel:"Low",
      riskColor:"#c8a96e",
      icon:"🥇",
      tags:["Gold + 2.5% interest","No storage risk","Tax-free on maturity"],
      desc:"Best way to invest in gold. Earns 2.5% p.a. interest + gold appreciation. 8yr tenure.",
      minAmount:1000,
    },
    {
      id:"reits",
      name:"REITs (Real Estate)",
      type:"Real Estate",
      rateMin:7, rateMax:10,
      riskLabel:"Low-Medium",
      riskColor:"#c8a96e",
      icon:"🏢",
      tags:["Rental income","Quarterly dividends","Commercial RE"],
      desc:"Invest in commercial real estate without buying property. Listed on NSE/BSE.",
      minAmount:300,
    },
  ];

  // SIP future value: FV = P * [((1+r)^n - 1) / r] * (1+r)
  const calcSIP = (monthly, annualRate, years) => {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    return Math.round(monthly * (((Math.pow(1 + r, n) - 1) / r) * (1 + r)));
  };

  const amt = monthlyInvest !== null ? monthlyInvest : Math.round(investable * 0.5);
  const TENURES = [1, 3, 5, 10, 15, 20];

  // Growth chart data for selected plan or default
  const activePlan = selectedPlan ? INVESTMENT_OPTIONS.find(p => p.id === selectedPlan) : INVESTMENT_OPTIONS[0];
  const midRate = activePlan ? (activePlan.rateMin + activePlan.rateMax) / 2 : 12;

  const growthData = TENURES.map(yr => ({
    year: `${yr}yr`,
    invested: amt * yr * 12,
    value_low:  calcSIP(amt, activePlan ? activePlan.rateMin : 10, yr),
    value_mid:  calcSIP(amt, midRate, yr),
    value_high: calcSIP(amt, activePlan ? activePlan.rateMax : 14, yr),
  }));

  const tenureResult = growthData.find(d => d.year === `${tenure}yr`) || growthData[2];

  const gain = tenureResult.value_mid - tenureResult.invested;
  const multiplier = tenureResult.invested > 0 ? (tenureResult.value_mid / tenureResult.invested).toFixed(1) : 1;

  return (
    <div style={{padding:"28px 30px", display:"flex", flexDirection:"column", gap:22}}>

      {/* Header */}
      <div className="fade-up">
        <div style={{fontSize:9, color:C.gold, letterSpacing:".2em", fontFamily:C.mono, marginBottom:8}}>SMART INVEST · BUILT FROM YOUR SPENDING DATA</div>
        <h1 style={{fontFamily:C.serif, fontSize:30, fontWeight:400, color:C.text0, lineHeight:1.1}}>
          Investment <em style={{fontStyle:"italic", color:C.gold}}>Planner</em>
        </h1>
      </div>

      {/* Money Flow: Income → Expenses → Savings → Investable */}
      <div className="card fade-up" style={{padding:"22px 26px", animationDelay:"40ms"}}>
        <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:18}}>Your Monthly Money Flow</div>
        <div style={{display:"flex", alignItems:"center", gap:0, overflowX:"auto"}}>
          {[
            {label:"Income",         value:totalIncome,   color:C.green,  icon:"↓"},
            {label:"All Expenses",   value:-totalExpenses, color:C.red,   icon:"↑"},
            {label:"Free Savings",   value:freeSavings,   color:C.gold,   icon:"="},
            {label:"Emergency (20%)",value:-emergencyBuffer, color:"#888", icon:"-"},
            {label:"Investable",     value:investable,    color:C.blue,   icon:"✦"},
          ].map((item, i) => (
            <div key={item.label} style={{display:"flex", alignItems:"center"}}>
              <div style={{textAlign:"center", padding:"0 18px", minWidth:120}}>
                <div style={{fontSize:8, color:C.text3, fontFamily:C.mono, letterSpacing:".1em", textTransform:"uppercase", marginBottom:6}}>{item.label}</div>
                <div style={{fontSize:22, color:item.color, fontFamily:C.serif, fontWeight:400}}>
                  {item.value < 0 ? "-" : ""}₹{Math.abs(item.value/1000).toFixed(1)}K
                </div>
              </div>
              {i < 4 && <div style={{fontSize:18, color:C.text3, flexShrink:0}}>→</div>}
            </div>
          ))}
        </div>

        {/* Category bars */}
        <div style={{marginTop:20, borderTop:`1px solid ${C.border}`, paddingTop:16}}>
          <div style={{fontSize:8, color:C.text3, fontFamily:C.mono, letterSpacing:".1em", marginBottom:12}}>EXPENSE BREAKDOWN</div>
          <div style={{display:"flex", flexWrap:"wrap", gap:10}}>
            {Object.entries(byCategory).map(([cat, val]) => {
              const pct = totalExpenses > 0 ? Math.round((val / totalExpenses) * 100) : 0;
              const catColors = {Food:"#c8a96e", Shopping:"#e8d5b0", Transport:"#a08c5c", Utilities:"#7a6840", Entertainment:"#d4b483", Healthcare:"#f0e6d0"};
              const col = catColors[cat] || C.text2;
              return (
                <div key={cat} style={{display:"flex", alignItems:"center", gap:7, padding:"6px 12px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:2}}>
                  <div style={{width:6, height:6, borderRadius:"50%", background:col, flexShrink:0}}/>
                  <span style={{fontSize:10, color:C.text2, fontFamily:C.mono}}>{cat}</span>
                  <span style={{fontSize:11, color:col, fontFamily:C.mono, fontWeight:500}}>₹{(val/1000).toFixed(1)}K</span>
                  <span style={{fontSize:8, color:C.text3, fontFamily:C.mono}}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Allocation Tiers */}
      <div className="fade-up" style={{animationDelay:"80ms"}}>
        <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:14}}>How Much Should You Invest?</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14}}>
          {TIERS.map(tier => {
            const amt_t = Math.round(investable * tier.pct);
            return (
              <div
                key={tier.label}
                className="card"
                onClick={() => { setMonthlyInvest(amt_t); toast.show(`Set to ${tier.label}: ₹${amt_t.toLocaleString("en-IN")}/mo`, "success"); }}
                style={{padding:"20px 22px", cursor:"pointer", border:`1px solid ${monthlyInvest===amt_t ? tier.color+"60" : C.border}`, background: monthlyInvest===amt_t ? `${tier.color}08` : C.bg2, transition:"all .2s"}}
              >
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12}}>
                  <div style={{fontSize:8, color:tier.color, letterSpacing:".12em", fontFamily:C.mono, textTransform:"uppercase"}}>{tier.label}</div>
                  <span style={{fontSize:10, color:tier.color}}>{tier.icon}</span>
                </div>
                <div style={{fontSize:28, color:tier.color, fontFamily:C.serif, fontWeight:400, lineHeight:1, marginBottom:6}}>
                  ₹{(amt_t/1000).toFixed(1)}K
                </div>
                <div style={{fontSize:9, color:C.text3, fontFamily:C.mono, marginBottom:10}}>{tier.desc}</div>
                <div style={{height:3, background:C.border, borderRadius:2}}>
                  <div style={{height:"100%", width:`${tier.pct*100}%`, background:tier.color, borderRadius:2}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Amount Slider */}
      <div className="card fade-up" style={{padding:"22px 26px", animationDelay:"120ms"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
          <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase"}}>Monthly Investment Amount</div>
          <div style={{fontSize:24, color:C.gold, fontFamily:C.serif}}>₹{amt.toLocaleString("en-IN")}</div>
        </div>
        <input
          type="range"
          min={500}
          max={investable}
          step={500}
          value={amt}
          onChange={e => setMonthlyInvest(Number(e.target.value))}
          style={{width:"100%", accentColor:C.gold, cursor:"pointer"}}
        />
        <div style={{display:"flex", justifyContent:"space-between", marginTop:6}}>
          <span style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>₹500 min</span>
          <span style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>₹{(investable/1000).toFixed(0)}K max (investable)</span>
        </div>
      </div>

      {/* Investment Options Grid */}
      <div className="fade-up" style={{animationDelay:"140ms"}}>
        <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:14}}>Where to Invest — Pick One to Model Growth</div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14}}>
          {INVESTMENT_OPTIONS.map(opt => {
            const isSelected = selectedPlan === opt.id;
            const canAfford  = amt >= opt.minAmount;
            const fv5yr      = calcSIP(amt, (opt.rateMin + opt.rateMax) / 2, 5);
            const gain5yr    = fv5yr - (amt * 60);
            return (
              <div
                key={opt.id}
                className="card"
                onClick={() => { if (canAfford) { setSelectedPlan(opt.id); toast.show(`Modelling: ${opt.name}`, "success"); } }}
                style={{
                  padding:"20px 22px",
                  cursor: canAfford ? "pointer" : "not-allowed",
                  border: isSelected ? `1px solid ${C.gold}70` : `1px solid ${C.border}`,
                  background: isSelected ? "rgba(200,169,110,.07)" : C.bg2,
                  opacity: canAfford ? 1 : 0.5,
                  transition:"all .2s",
                  position:"relative",
                  overflow:"hidden"
                }}
              >
                {isSelected && (
                  <div style={{position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${C.gold},transparent)`}}/>
                )}
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10}}>
                  <div>
                    <div style={{fontSize:18, marginBottom:4}}>{opt.icon}</div>
                    <div style={{fontSize:13, color:C.text0, fontWeight:500, lineHeight:1.2}}>{opt.name}</div>
                    <div style={{fontSize:9, color:C.text3, fontFamily:C.mono, marginTop:3}}>{opt.type}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11, color:opt.riskColor, fontFamily:C.mono}}>{opt.riskLabel}</div>
                    <div style={{fontSize:10, color:C.text2, fontFamily:C.mono, marginTop:3}}>{opt.rateMin === opt.rateMax ? `${opt.rateMin}%` : `${opt.rateMin}–${opt.rateMax}%`} p.a.</div>
                  </div>
                </div>

                <div style={{fontSize:10, color:C.text3, fontFamily:C.mono, lineHeight:1.6, marginBottom:12}}>{opt.desc}</div>

                <div style={{display:"flex", flexWrap:"wrap", gap:4, marginBottom:12}}>
                  {opt.tags.map(tag => (
                    <span key={tag} style={{fontSize:8, color:C.gold, background:"rgba(200,169,110,.1)", padding:"2px 7px", borderRadius:8, fontFamily:C.mono}}>{tag}</span>
                  ))}
                </div>

                <div style={{borderTop:`1px solid ${C.border}`, paddingTop:10, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:8, color:C.text3, fontFamily:C.mono}}>5-YEAR GROWTH (₹{(amt/1000).toFixed(0)}K/mo)</div>
                    <div style={{fontSize:16, color:C.green, fontFamily:C.serif}}>₹{(fv5yr/1000).toFixed(1)}K</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:8, color:C.text3, fontFamily:C.mono}}>GAIN</div>
                    <div style={{fontSize:13, color:C.green, fontFamily:C.mono}}>+₹{(gain5yr/1000).toFixed(1)}K</div>
                  </div>
                </div>

                {!canAfford && (
                  <div style={{marginTop:8, fontSize:8, color:C.red, fontFamily:C.mono}}>Min ₹{opt.minAmount.toLocaleString("en-IN")}/mo required</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Growth Projection */}
      <div className="card fade-up" style={{padding:"26px 28px", animationDelay:"180ms"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20}}>
          <div>
            <div style={{fontSize:9, color:C.gold, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:6}}>◆ GROWTH PROJECTION · {activePlan.name}</div>
            <div style={{fontSize:13, color:C.text2, fontFamily:C.mono}}>Monthly SIP of ₹{amt.toLocaleString("en-IN")}</div>
          </div>
          <div style={{display:"flex", gap:6}}>
            {TENURES.map(yr => (
              <button
                key={yr}
                onClick={() => setTenure(yr)}
                style={{
                  padding:"5px 11px", fontSize:9, fontFamily:C.mono, border:`1px solid ${tenure===yr ? C.gold : C.border}`,
                  background: tenure===yr ? "rgba(200,169,110,.15)" : "transparent",
                  color: tenure===yr ? C.gold : C.text3,
                  cursor:"pointer", borderRadius:1, transition:"all .15s"
                }}
              >{yr}yr</button>
            ))}
          </div>
        </div>

        {/* Result Banner */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24}}>
          {[
            {label:"You Invest",     value:`₹${(tenureResult.invested/1000).toFixed(0)}K`,                    sub:`₹${amt.toLocaleString("en-IN")} × ${tenure*12} months`, color:C.text1},
            {label:"Expected Value", value:`₹${(tenureResult.value_mid/1000).toFixed(0)}K`,                   sub:`at ~${midRate.toFixed(1)}% p.a.`,                       color:C.green},
            {label:"Total Gain",     value:`+₹${(gain/1000).toFixed(0)}K`,                                    sub:"money working for you",                                 color:C.gold},
            {label:"Multiplier",     value:`${multiplier}×`,                                                   sub:"your money grows to",                                   color:C.blue},
          ].map(kpi => (
            <div key={kpi.label} style={{padding:"14px 16px", background:C.bg3, border:`1px solid ${C.border}`, borderRadius:2}}>
              <div style={{fontSize:8, color:C.text3, fontFamily:C.mono, letterSpacing:".1em", textTransform:"uppercase", marginBottom:8}}>{kpi.label}</div>
              <div style={{fontSize:22, color:kpi.color, fontFamily:C.serif, fontWeight:400, lineHeight:1, marginBottom:4}}>{kpi.value}</div>
              <div style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={growthData} margin={{top:10, right:10, left:0, bottom:0}}>
            <defs>
              <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.25}/>
                <stop offset="95%" stopColor={C.blue}  stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.green} stopOpacity={0.35}/>
                <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gradInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.gold}  stopOpacity={0.2}/>
                <stop offset="95%" stopColor={C.gold}  stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
            <XAxis dataKey="year" tick={{fill:C.text3, fontSize:10, fontFamily:"IBM Plex Mono"}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{fill:C.text3, fontSize:9, fontFamily:"IBM Plex Mono"}} axisLine={false} tickLine={false} width={60}/>
            <Tooltip
              contentStyle={{background:C.bg2, border:`1px solid ${C.border}`, borderRadius:2, fontFamily:"IBM Plex Mono", fontSize:11}}
              labelStyle={{color:C.gold}}
              formatter={(v, name) => [`₹${(v/1000).toFixed(1)}K`, name]}
            />
            <Area type="monotone" dataKey="value_high" name="Optimistic"   stroke={C.blue}  fill="url(#gradHigh)" strokeWidth={1.5} strokeDasharray="4 3"/>
            <Area type="monotone" dataKey="value_mid"  name="Expected"     stroke={C.green} fill="url(#gradMid)"  strokeWidth={2}/>
            <Area type="monotone" dataKey="value_low"  name="Conservative" stroke={C.gold}  fill="none"           strokeWidth={1.5} strokeDasharray="4 3"/>
            <Area type="monotone" dataKey="invested"   name="Amount Invested" stroke={C.text3} fill="url(#gradInv)" strokeWidth={1.5}/>
          </AreaChart>
        </ResponsiveContainer>

        <div style={{display:"flex", gap:16, marginTop:12, flexWrap:"wrap"}}>
          {[
            {color:C.green, label:"Expected growth"},
            {color:C.blue,  label:"Optimistic scenario"},
            {color:C.gold,  label:"Conservative scenario"},
            {color:C.text3, label:"Amount invested"},
          ].map(l => (
            <div key={l.label} style={{display:"flex", alignItems:"center", gap:5}}>
              <div style={{width:20, height:2, background:l.color}}/>
              <span style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Plans Comparison Table for chosen tenure */}
      <div className="card fade-up" style={{padding:"24px 26px", animationDelay:"200ms"}}>
        <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:18}}>
          Full Comparison — ₹{amt.toLocaleString("en-IN")}/mo over {tenure} Years
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontFamily:C.mono, fontSize:11}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`}}>
                {["Option","Type","Rate","You Invest","You Get","Gain","Risk"].map(h => (
                  <th key={h} style={{padding:"8px 12px", textAlign:"left", fontSize:8, color:C.text3, letterSpacing:".1em", fontWeight:400}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVESTMENT_OPTIONS.map((opt, i) => {
                const midR  = (opt.rateMin + opt.rateMax) / 2;
                const fv    = calcSIP(amt, midR, tenure);
                const inv   = amt * tenure * 12;
                const g     = fv - inv;
                const isAct = selectedPlan === opt.id;
                return (
                  <tr
                    key={opt.id}
                    onClick={() => { setSelectedPlan(opt.id); toast.show(`Modelling: ${opt.name}`, "success"); }}
                    style={{
                      borderBottom:`1px solid ${C.border}`,
                      background: isAct ? "rgba(200,169,110,.06)" : "transparent",
                      cursor:"pointer",
                      transition:"background .15s"
                    }}
                  >
                    <td style={{padding:"12px 12px", color:isAct ? C.gold : C.text1}}>
                      <span style={{marginRight:6}}>{opt.icon}</span>{opt.name}
                    </td>
                    <td style={{padding:"12px 12px", color:C.text3}}>{opt.type}</td>
                    <td style={{padding:"12px 12px", color:C.text2}}>{opt.rateMin === opt.rateMax ? `${opt.rateMin}%` : `${opt.rateMin}–${opt.rateMax}%`}</td>
                    <td style={{padding:"12px 12px", color:C.text2}}>₹{(inv/1000).toFixed(0)}K</td>
                    <td style={{padding:"12px 12px", color:C.green, fontWeight:500}}>₹{(fv/1000).toFixed(0)}K</td>
                    <td style={{padding:"12px 12px", color:C.gold}}>+₹{(g/1000).toFixed(0)}K</td>
                    <td style={{padding:"12px 12px"}}>
                      <span style={{fontSize:8, color:opt.riskColor, background:`${opt.riskColor}18`, padding:"2px 7px", borderRadius:8}}>{opt.riskLabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{padding:"14px 18px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:2, fontSize:9, color:C.text3, fontFamily:C.mono, lineHeight:1.8}}>
        ⚠ Projections are based on historical averages and are not guaranteed. Mutual fund investments are subject to market risks.
        Past performance is not indicative of future results. Consult a SEBI-registered financial advisor before investing.
      </div>
    </div>
  );
}


export { SmartInvest };
