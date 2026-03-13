import { useState, useEffect } from "react";
import { C, fmt } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { MOCK_TXN } from "../constants/mockData";

function InsurancePlanner({token, toast}) {
  const [txs, setTxs] = useState(MOCK_TXN);

  useEffect(() => {
    if (token === DEMO_TOKEN) return;
    api.getTransactions(token).then(t => { if (Array.isArray(t) && t.length) setTxs(t); }).catch(() => {});
  }, [token]);

  // Derive financials from transactions
  const totalIncome   = txs.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = txs.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const savings       = totalIncome - totalExpenses;
  const savingsPct    = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // Safe-to-spend on insurance: 10–15% of savings is a standard guideline
  const insuranceBudget = Math.round(savings * 0.12);
  const existingHealth  = txs.filter(t => t.category === "Healthcare").reduce((s, t) => s + t.amount, 0);

  const PLANS = [
    {
      type: "Health Insurance",
      icon: "♡",
      color: "#e05252",
      tag: "RECOMMENDED",
      plans: [
        { name: "Basic Health Cover",    premium: 500,  cover: "3L",   features: ["Hospitalisation","Day care","Ambulance cover"],                              affordable: insuranceBudget >= 500  },
        { name: "Family Floater Plan",   premium: 1200, cover: "10L",  features: ["Family of 4","Pre-existing (3yr wait)","Cashless at 6000+ hospitals"],       affordable: insuranceBudget >= 1200 },
        { name: "Super Top-Up Plan",     premium: 800,  cover: "20L",  features: ["Above deductible ₹3L","Critical illness add-on","Maternity cover"],         affordable: insuranceBudget >= 800  },
        { name: "Critical Illness Cover",premium: 1500, cover: "25L",  features: ["40 illnesses covered","Lump-sum payout","Cancer, Heart, Stroke"],            affordable: insuranceBudget >= 1500 },
      ]
    },
    {
      type: "Term Life Insurance",
      icon: "◈",
      color: "#5b8fd4",
      tag: "ESSENTIAL",
      plans: [
        { name: "Basic Term Plan",       premium: 600,  cover: "50L",  features: ["Pure protection","30yr term","Tax benefit u/s 80C"],                         affordable: insuranceBudget >= 600  },
        { name: "Return of Premium",     premium: 1800, cover: "1Cr",  features: ["Premiums refunded on survival","Accidental death rider","Waiver of premium"], affordable: insuranceBudget >= 1800 },
      ]
    },
    {
      type: "Vehicle Insurance",
      icon: "◉",
      color: "#c8a96e",
      tag: "MANDATORY",
      plans: [
        { name: "Third-Party Only",      premium: 300,  cover: "As per law", features: ["Legal mandate","Liability cover","Zero own-damage"],                   affordable: insuranceBudget >= 300  },
        { name: "Comprehensive Plan",    premium: 900,  cover: "Market value",features: ["Own damage","Natural calamity","Theft protection"],                    affordable: insuranceBudget >= 900  },
      ]
    },
    {
      type: "Personal Accident",
      icon: "✦",
      color: "#4caf78",
      tag: "SMART ADD-ON",
      plans: [
        { name: "PA Basic",              premium: 200,  cover: "5L",   features: ["Accidental death","Permanent disability","Hospital cash"],                    affordable: insuranceBudget >= 200  },
        { name: "PA Comprehensive",      premium: 550,  cover: "15L",  features: ["Temporary disability","Income protection","Education benefit for kids"],      affordable: insuranceBudget >= 550  },
      ]
    },
  ];

  const afforadablePlans = PLANS.flatMap(g => g.plans.filter(p => p.affordable));
  const totalAffordablePremium = afforadablePlans.reduce((s, p) => s + p.premium, 0);
  const coverageScore = Math.min(100, Math.round((insuranceBudget / 3500) * 100));

  const scoreColor = coverageScore >= 70 ? C.green : coverageScore >= 40 ? C.gold : C.red;
  const scoreLabel = coverageScore >= 70 ? "Well Protected" : coverageScore >= 40 ? "Partially Covered" : "Under-Insured";

  return (
    <div style={{padding:"28px 30px", display:"flex", flexDirection:"column", gap:22}}>

      {/* Header */}
      <div className="fade-up">
        <div style={{fontSize:9, color:C.gold, letterSpacing:".2em", fontFamily:C.mono, marginBottom:8}}>INSURANCE PLANNER · POWERED BY YOUR TRANSACTIONS</div>
        <h1 style={{fontFamily:C.serif, fontSize:30, fontWeight:400, color:C.text0, lineHeight:1.1}}>
          Insurance <em style={{fontStyle:"italic", color:C.gold}}>Affordability</em>
        </h1>
      </div>

      {/* KPI Row */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14}}>
        {[
          {label:"Monthly Income",      value:`₹${(totalIncome/1000).toFixed(1)}K`,    sub:"from transactions",    color:C.green},
          {label:"Monthly Expenses",    value:`₹${(totalExpenses/1000).toFixed(1)}K`,  sub:"total outflow",         color:C.red},
          {label:"Net Savings",         value:`₹${(savings/1000).toFixed(1)}K`,        sub:`${savingsPct}% of income`, color:C.gold},
          {label:"Insurance Budget",    value:`₹${(insuranceBudget/1000).toFixed(1)}K`,sub:"12% of savings / mo",  color:C.blue},
        ].map((kpi, i) => (
          <div key={kpi.label} className="card fade-up" style={{padding:"18px 20px", animationDelay:`${i*60}ms`}}>
            <div style={{fontSize:8, color:C.text3, letterSpacing:".12em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:10}}>{kpi.label}</div>
            <div style={{fontSize:26, color:kpi.color, fontFamily:C.serif, fontWeight:400, lineHeight:1, marginBottom:6}}>{kpi.value}</div>
            <div style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Coverage Score + Breakdown */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:16}}>

        {/* Score Gauge */}
        <div className="card fade-up" style={{padding:"26px 28px", animationDelay:"80ms", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16}}>
          <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase"}}>Coverage Score</div>
          <div style={{position:"relative", width:140, height:140}}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="56" fill="none" stroke={C.border} strokeWidth="10"/>
              <circle cx="70" cy="70" r="56" fill="none" stroke={scoreColor} strokeWidth="10"
                strokeDasharray={`${2*Math.PI*56 * coverageScore/100} ${2*Math.PI*56}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                style={{transition:"stroke-dasharray 1s ease"}}
              />
            </svg>
            <div style={{position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
              <div style={{fontSize:32, color:scoreColor, fontFamily:C.serif, fontWeight:400, lineHeight:1}}>{coverageScore}</div>
              <div style={{fontSize:8, color:C.text3, fontFamily:C.mono, letterSpacing:".1em"}}>/ 100</div>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:14, color:scoreColor, fontFamily:C.mono, marginBottom:4}}>{scoreLabel}</div>
            <div style={{fontSize:10, color:C.text3, fontFamily:C.mono}}>{afforadablePlans.length} plans within budget</div>
          </div>
        </div>

        {/* Savings Breakdown */}
        <div className="card fade-up" style={{padding:"24px 26px", animationDelay:"130ms"}}>
          <div style={{fontSize:9, color:C.text2, letterSpacing:".15em", fontFamily:C.mono, textTransform:"uppercase", marginBottom:20}}>How Your Savings Break Down</div>
          {[
            {label:"Existing Healthcare Spend", amount:existingHealth, pct: totalIncome>0?Math.round((existingHealth/totalIncome)*100):0, color:C.red,   note:"pharmacy & clinic visits"},
            {label:"Recommended Insurance",     amount:insuranceBudget, pct:12,                                                                           color:C.gold, note:"12% of savings — ideal allocation"},
            {label:"Remaining Free Savings",    amount:Math.max(0, savings - insuranceBudget), pct: totalIncome>0?Math.round(((savings-insuranceBudget)/totalIncome)*100):0, color:C.green, note:"for investments & emergencies"},
          ].map((row, i) => (
            <div key={row.label} style={{marginBottom:16}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
                <div>
                  <div style={{fontSize:12, color:C.text1}}>{row.label}</div>
                  <div style={{fontSize:9, color:C.text3, fontFamily:C.mono, marginTop:2}}>{row.note}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:15, color:row.color, fontFamily:C.serif}}>₹{row.amount.toLocaleString("en-IN")}</div>
                  <div style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>{row.pct}% of income</div>
                </div>
              </div>
              <div style={{height:4, background:C.border, borderRadius:2}}>
                <div style={{height:"100%", width:`${Math.min(row.pct*2,100)}%`, background:row.color, borderRadius:2, opacity:.85, transition:"width 1s ease"}}/>
              </div>
            </div>
          ))}

          <div style={{marginTop:20, padding:"14px 16px", background:"rgba(200,169,110,.06)", border:"1px solid rgba(200,169,110,.2)", borderRadius:2}}>
            <div style={{fontSize:9, color:C.gold, fontFamily:C.mono, letterSpacing:".12em", marginBottom:6}}>◆ SMART INSIGHT</div>
            <div style={{fontSize:11, color:C.text2, fontFamily:C.mono, lineHeight:1.7}}>
              With ₹{savings.toLocaleString("en-IN")} monthly savings, you can comfortably allocate
              ₹{insuranceBudget.toLocaleString("en-IN")}/mo for insurance premiums — covering health,
              term life & personal accident with ₹{Math.max(0,savings-totalAffordablePremium).toLocaleString("en-IN")} surplus.
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Plan Cards */}
      {PLANS.map((group, gi) => (
        <div key={group.type} className="fade-up" style={{animationDelay:`${200 + gi*80}ms`}}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:14}}>
            <span style={{fontSize:16, color:group.color}}>{group.icon}</span>
            <div style={{fontSize:9, color:group.color, letterSpacing:".18em", fontFamily:C.mono, textTransform:"uppercase"}}>{group.type}</div>
            <span style={{background:`${group.color}18`, color:group.color, fontSize:8, padding:"2px 7px", borderRadius:8, fontFamily:C.mono, letterSpacing:".1em"}}>{group.tag}</span>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14}}>
            {group.plans.map((plan, pi) => (
              <div key={plan.name} className="card" style={{
                padding:"20px 22px",
                border: plan.affordable ? `1px solid ${group.color}40` : `1px solid ${C.border}`,
                opacity: plan.affordable ? 1 : 0.45,
                position:"relative",
                overflow:"hidden"
              }}>
                {plan.affordable && (
                  <div style={{position:"absolute", top:0, right:0, background:group.color, color:"#08090a", fontSize:7, fontFamily:C.mono, letterSpacing:".1em", padding:"3px 9px"}}>AFFORDABLE</div>
                )}
                {!plan.affordable && (
                  <div style={{position:"absolute", top:0, right:0, background:C.bg3, color:C.text3, fontSize:7, fontFamily:C.mono, letterSpacing:".1em", padding:"3px 9px"}}>OUT OF BUDGET</div>
                )}

                <div style={{marginBottom:12}}>
                  <div style={{fontSize:14, color:C.text0, fontWeight:500, marginBottom:4}}>{plan.name}</div>
                  <div style={{display:"flex", alignItems:"baseline", gap:6}}>
                    <span style={{fontSize:22, color:group.color, fontFamily:C.serif, fontWeight:400}}>₹{plan.premium}</span>
                    <span style={{fontSize:9, color:C.text3, fontFamily:C.mono}}>/month</span>
                    <span style={{fontSize:10, color:C.text2, fontFamily:C.mono, marginLeft:"auto"}}>Cover: {plan.cover}</span>
                  </div>
                </div>

                <div style={{borderTop:`1px solid ${C.border}`, paddingTop:12, display:"flex", flexDirection:"column", gap:6}}>
                  {plan.features.map(f => (
                    <div key={f} style={{display:"flex", alignItems:"center", gap:7}}>
                      <span style={{color:group.color, fontSize:9}}>✓</span>
                      <span style={{fontSize:11, color:C.text2, fontFamily:C.mono}}>{f}</span>
                    </div>
                  ))}
                </div>

                {plan.affordable && (
                  <button
                    className="btn-gold"
                    style={{width:"100%", marginTop:14, padding:"9px", fontSize:10}}
                    onClick={() => toast.show(`${plan.name} — ₹${plan.premium}/mo added to plan`, "success")}
                  >
                    Add to My Plan →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div style={{padding:"14px 18px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:2, fontSize:9, color:C.text3, fontFamily:C.mono, lineHeight:1.8}}>
        ⚠ Premiums shown are indicative estimates for a 30-year individual in India. Actual premiums depend on age, health history, insurer & sum insured.
        Always consult a certified financial advisor before purchasing insurance. Data sourced from your transaction history.
      </div>
    </div>
  );
}


export { InsurancePlanner };