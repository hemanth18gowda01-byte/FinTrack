import { useState, useEffect } from "react";
import { C, fmt } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { MOCK_LOAN } from "../constants/mockData";
import { StatCard } from "../components/StatCard";

function LoanPlanner({token, toast}) {
  const [loan,setLoan]=useState(MOCK_LOAN);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{if(token===DEMO_TOKEN)return;setLoading(true);api.getLoanSuggestions(token).then(l=>{if(l&&!l.error)setLoan(l);}).catch(()=>toast.show("Using demo loan data","info")).finally(()=>setLoading(false));},[token]);
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:22}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:8}}>CREDIT INTELLIGENCE</div>
        <h1 style={{fontFamily:C.serif,fontSize:28,fontWeight:400,color:C.text0}}>Loan <em style={{fontStyle:"italic",color:C.gold}}>Planner</em></h1>
        <p style={{color:C.text3,fontFamily:C.mono,fontSize:10,marginTop:6,letterSpacing:".06em"}}>AI-generated loan eligibility based on your real financial profile</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        {loading?[1,2,3,4].map(i=>(<div key={i} className="card" style={{padding:"18px 20px"}}><div className="shimmer" style={{height:9,width:80,marginBottom:12}}/><div className="shimmer" style={{height:20,width:110}}/></div>)):
          [{label:"Monthly Income",value:fmt(loan.monthly_income||0),color:C.green},{label:"Monthly Expenses",value:fmt(loan.monthly_expenses||0),color:C.text0},{label:"Monthly Savings",value:fmt(loan.monthly_savings||0),color:C.gold},{label:"Affordable EMI",value:fmt(loan.affordable_emi||0),color:C.blue,sub:"Max recommended"}]
          .map((s,i)=><StatCard key={s.label} label={s.label} value={s.value} color={s.color} sub={s.sub} delay={i*60}/>)
        }
      </div>
      <div className="card fade-up" style={{padding:"20px 22px",animationDelay:"180ms"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono}}>Loan Affordability Meter</span>
          <span style={{color:C.gold,fontSize:14,fontFamily:C.serif}}>{fmt(loan.recommended_loan||0)} recommended</span>
        </div>
        <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:"72%",background:`linear-gradient(90deg,${C.green},${C.gold})`,borderRadius:4,transition:"width 1.5s ease"}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
          <span style={{fontSize:9,color:C.text3,fontFamily:C.mono}}>₹0</span>
          <span style={{fontSize:9,color:C.gold,fontFamily:C.mono}}>72% utilized</span>
          <span style={{fontSize:9,color:C.text3,fontFamily:C.mono}}>₹7,00,000 max</span>
        </div>
      </div>
      <div>
        <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:14}}>Suggested Loan Products</div>
        {loading?[1,2,3].map(i=><div key={i} className="card shimmer" style={{height:100,marginBottom:10}}/>):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {(loan.suggestions||[]).map((l,i)=>(
              <div key={i} className="card fade-up" style={{padding:"20px 22px",animationDelay:`${(i+3)*80}ms`}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:14,alignItems:"start"}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                      <h3 style={{fontFamily:C.serif,fontSize:17,fontWeight:400,color:C.text0}}>{l.name}</h3>
                      <span className={l.affordable?"tag tag-green":"tag tag-red"}>{l.affordable?"✓ Affordable":"✗ Over limit"}</span>
                    </div>
                    <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                      {[{label:"Loan Amount",value:fmt(l.amount)},{label:"Monthly EMI",value:fmt(l.emi),color:C.gold},{label:"Interest Rate",value:`${l.interest_rate}%`},{label:"Tenure",value:`${l.tenure} months`}].map(s=>(
                        <div key={s.label}><div style={{fontSize:8,color:C.text3,letterSpacing:".1em",fontFamily:C.mono,marginBottom:4}}>{s.label.toUpperCase()}</div><div style={{fontSize:15,color:s.color||C.text1,fontFamily:C.serif}}>{s.value}</div></div>
                      ))}
                    </div>
                  </div>
                  <button className="btn-primary" style={{padding:"10px 18px",alignSelf:"center"}}>Apply →</button>
                </div>
                <div style={{marginTop:14,display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:9,color:C.text3,fontFamily:C.mono,whiteSpace:"nowrap"}}>EMI burden:</span>
                  <div style={{flex:1,height:4,background:C.border,borderRadius:2}}><div style={{height:"100%",width:`${Math.min((l.emi/(loan.monthly_savings||1))*100,100)}%`,background:l.affordable?C.green:C.red,borderRadius:2}}/></div>
                  <span style={{fontSize:9,color:C.text3,fontFamily:C.mono,whiteSpace:"nowrap"}}>{((l.emi/(loan.monthly_savings||1))*100).toFixed(0)}% of savings</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export { LoanPlanner };
