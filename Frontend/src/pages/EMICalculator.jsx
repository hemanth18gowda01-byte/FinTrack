import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { C, fmt } from "../constants/theme";
import { api, DEMO_TOKEN } from "../api";
import { CornerAccents } from "../components/CornerAccents";
import { CustomTooltip } from "../components/CustomTooltip";

function EMICalculator({token, toast}) {
  const [form,setForm]=useState({loan_amount:300000,interest_rate:10.5,tenure:36});
  const [loading,setLoading]=useState(false);
  const localCalc = useCallback((f) => {
    const p = f.loan_amount;
    const r = (f.interest_rate / 100) / 12;
    const n = f.tenure;
    if (!p || !r || !n) return null;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emi * n;
    return { emi: Math.round(emi), total_repayment: Math.round(total), total_interest: Math.round(total - p) };
  }, []);
  const [result,setResult]=useState(()=>localCalc(form));
  useEffect(()=>{setResult(localCalc(form));},[form]);
  const callAPI=async()=>{setLoading(true);try{const data=await api.calculateEMI(token,{principal:form.loan_amount,annual_interest_rate:form.interest_rate,tenure_months:form.tenure});if(data&&!data.error){setResult({emi:data.emi_monthly,total_repayment:data.total_repayment,total_interest:data.total_interest});toast.show("EMI calculated via backend","success");}}catch(e){toast.show("Backend unavailable, showing local result","info");}setLoading(false);};
  const res=result;
  const scheduleData = res ? Array.from({ length: Math.min(form.tenure, 12) }, (_, i) => {
    const r = (form.interest_rate / 100) / 12;
    const bal = form.loan_amount * Math.pow(1 + r, i);
    return { month: `M${i + 1}`, principal: Math.round(res.emi - bal * r), interest: Math.round(bal * r) };
  }) : [];
  return (
    <div style={{padding:28,display:"flex",flexDirection:"column",gap:22}}>
      <div className="fade-up">
        <div style={{fontSize:9,color:C.gold,letterSpacing:".2em",fontFamily:C.mono,marginBottom:8}}>SMART CALCULATOR</div>
        <h1 style={{fontFamily:C.serif,fontSize:28,fontWeight:400,color:C.text0}}>EMI <em style={{fontStyle:"italic",color:C.gold}}>Calculator</em></h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div className="card fade-up" style={{padding:"24px 26px",animationDelay:"80ms"}}>
          <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:20}}>Loan Parameters</div>
          <div style={{display:"flex",flexDirection:"column",gap:22}}>
            {[{key:"loan_amount",label:"LOAN AMOUNT",min:50000,max:2000000,step:10000,display:fmt(form.loan_amount)},{key:"interest_rate",label:"INTEREST RATE",min:6,max:24,step:0.1,display:`${form.interest_rate}% p.a.`},{key:"tenure",label:"LOAN TENURE",min:6,max:120,step:6,display:`${form.tenure} months`}].map(({key,label,min,max,step,display})=>(
              <div key={key}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><label style={{color:C.text3,fontSize:10,fontFamily:C.mono,letterSpacing:".08em"}}>{label}</label><span style={{color:C.gold,fontSize:15,fontFamily:C.serif}}>{display}</span></div>
                <input type="range" min={min} max={max} step={step} value={form[key]} onChange={e=>setForm({...form,[key]:+e.target.value})}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:8,color:C.text3,fontFamily:C.mono}}>{key==="loan_amount"?"₹50K":key==="interest_rate"?"6%":"6 mo"}</span><span style={{fontSize:8,color:C.text3,fontFamily:C.mono}}>{key==="loan_amount"?"₹20L":key==="interest_rate"?"24%":"120 mo"}</span></div>
                <input className="app-input" type="number" step={step} style={{marginTop:8}} value={form[key]} onChange={e=>setForm({...form,[key]:+e.target.value})}/>
              </div>
            ))}
            <button className="btn-primary" onClick={callAPI} disabled={loading||token===DEMO_TOKEN}>{loading?<><span className="spinner"/> &nbsp;Calculating…</>:token===DEMO_TOKEN?"Live Calc Active (Demo)":"Calculate via Backend →"}</button>
          </div>
        </div>
        {res&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div className="card fade-up" style={{padding:"28px 26px",textAlign:"center",border:`1px solid rgba(200,169,110,.28)`,animationDelay:"120ms",position:"relative"}}>
              <CornerAccents/>
              <div style={{fontSize:9,color:C.text2,letterSpacing:".15em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:12}}>Monthly EMI</div>
              <div style={{fontSize:48,color:C.gold,fontFamily:C.serif,fontWeight:400,lineHeight:1}}>{fmt(res.emi)}</div>
              <div style={{fontSize:10,color:C.text3,fontFamily:C.mono,marginTop:10,letterSpacing:".06em"}}>per month · {form.tenure} months · {form.interest_rate}% p.a.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div className="card fade-up" style={{padding:"16px 18px",animationDelay:"160ms"}}><div style={{fontSize:8,color:C.text3,letterSpacing:".1em",fontFamily:C.mono,marginBottom:8}}>TOTAL REPAYMENT</div><div style={{fontSize:19,color:C.text0,fontFamily:C.serif}}>{fmt(res.total_repayment)}</div></div>
              <div className="card fade-up" style={{padding:"16px 18px",animationDelay:"200ms"}}><div style={{fontSize:8,color:C.text3,letterSpacing:".1em",fontFamily:C.mono,marginBottom:8}}>TOTAL INTEREST</div><div style={{fontSize:19,color:C.red,fontFamily:C.serif}}>{fmt(res.total_interest)}</div></div>
            </div>
            <div className="card fade-up" style={{padding:"18px 20px",animationDelay:"240ms"}}>
              <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:14}}>Principal vs Interest Split</div>
              <div style={{display:"flex",gap:16,alignItems:"center"}}>
                <PieChart width={110} height={110}>
                  <Pie data={[{value:form.loan_amount},{value:res.total_interest}]} cx={50} cy={50} innerRadius={28} outerRadius={50} paddingAngle={2} dataKey="value" startAngle={90} endAngle={450}>
                    <Cell fill={C.green} strokeWidth={0}/><Cell fill={C.red} strokeWidth={0}/>
                  </Pie>
                </PieChart>
                <div style={{flex:1}}>
                  {[{label:"Principal",value:fmt(form.loan_amount),color:C.green,pct:((form.loan_amount/res.total_repayment)*100).toFixed(0)},{label:"Interest",value:fmt(res.total_interest),color:C.red,pct:((res.total_interest/res.total_repayment)*100).toFixed(0)}].map(s=>(
                    <div key={s.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{color:C.text2,fontSize:11,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:"50%",background:s.color,display:"inline-block"}}/>{s.label}</span>
                      <div><span style={{color:s.color,fontSize:14,fontFamily:C.serif}}>{s.value}</span><span style={{color:C.text3,fontSize:9,fontFamily:C.mono,marginLeft:6}}>({s.pct}%)</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card fade-up" style={{padding:"16px 18px",animationDelay:"280ms"}}>
              <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:10}}>EMI vs Your Savings</div>
              <div style={{height:6,background:C.border,borderRadius:3}}><div style={{height:"100%",width:`${Math.min((res.emi/43000)*100,100)}%`,background:res.emi<=21500?C.green:C.red,borderRadius:3,transition:"width 1s ease"}}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <span style={{fontSize:9,color:C.text3,fontFamily:C.mono}}>EMI: {fmt(res.emi)}</span>
                <span className={res.emi<=21500?"tag tag-green":"tag tag-red"} style={{fontSize:8}}>{res.emi<=21500?"✓ Within budget":"✗ Exceeds limit"}</span>
                <span style={{fontSize:9,color:C.text3,fontFamily:C.mono}}>Savings: ₹43,000</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {scheduleData.length>0&&(
        <div className="card fade-up" style={{padding:"20px 22px",animationDelay:"320ms"}}>
          <div style={{fontSize:9,color:C.text2,letterSpacing:".12em",textTransform:"uppercase",fontFamily:C.mono,marginBottom:16}}>Repayment Breakdown (First 12 Months)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scheduleData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="2 4" stroke={C.border}/>
              <XAxis dataKey="month" tick={{fontSize:9,fill:C.text3,fontFamily:C.mono}} axisLine={{stroke:C.border}} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:C.text3,fontFamily:C.mono}} axisLine={false} tickLine={false} tickFormatter={v=>"₹"+Math.round(v/1000)+"k"}/>
              <Tooltip content={<CustomTooltip/>}/><Legend wrapperStyle={{fontSize:9,fontFamily:C.mono,color:C.text2}}/>
              <Bar dataKey="principal" name="Principal" stackId="a" fill={C.green} opacity={.8}/>
              <Bar dataKey="interest" name="Interest" stackId="a" fill={C.red} opacity={.75} radius={[2,2,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ── Stocks & Investments ── */
const YAHOO_KEY  = "YOUR_RAPIDAPI_KEY_HERE";
const YAHOO_HOST = "yahoo-finance15.p.rapidapi.com";
const YAHOO_BASE = "https://yahoo-finance15.p.rapidapi.com/api/v1";
async function yahooGet(path) {
  const res = await fetch(`${YAHOO_BASE}${path}`, {headers:{"x-rapidapi-key":YAHOO_KEY,"x-rapidapi-host":YAHOO_HOST}});
  if (!res.ok) throw new Error(`Yahoo ${res.status}`);
  return res.json();
}

const PROFILES = {
  conservative:{label:"Conservative",icon:"◉",color:"#4caf78",desc:"Large-cap Indian blue chips — steady dividends, low volatility",tickers:["RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","ITC.NS"]},
  moderate:    {label:"Moderate",    icon:"◈",color:"#c8a96e",desc:"Balanced mix of growth & stability — mid + large cap",       tickers:["WIPRO.NS","BAJFINANCE.NS","SBIN.NS","MARUTI.NS","TITAN.NS"]},
  aggressive:  {label:"Aggressive",  icon:"◭",color:"#e05252",desc:"High-growth small/mid cap — fintech & new-age sectors",      tickers:["ZOMATO.NS","NYKAA.NS","PAYTM.NS","DELHIVERY.NS","POLICYBZR.NS"]},
  global:      {label:"Global",      icon:"◆",color:"#5b8fd4",desc:"US mega-caps — global diversification from INR portfolio",    tickers:["AAPL","MSFT","GOOGL","AMZN","NVDA"]},
};

const MOCK_STOCKS = {
  "RELIANCE.NS": {symbol:"RELIANCE.NS",name:"Reliance Industries",   price:2847.60,change:+34.20,pct:+1.22,high:2860, low:2810, vol:"3.2M",cap:"₹19.2T",sector:"Energy",   currency:"₹"},
  "TCS.NS":      {symbol:"TCS.NS",     name:"Tata Consultancy Svcs", price:3921.15,change:-18.50,pct:-0.47,high:3945, low:3898, vol:"1.8M",cap:"₹14.3T",sector:"IT",       currency:"₹"},
  "HDFCBANK.NS": {symbol:"HDFCBANK.NS",name:"HDFC Bank",             price:1654.40,change:+12.80,pct:+0.78,high:1668, low:1641, vol:"5.1M",cap:"₹12.5T",sector:"Finance",  currency:"₹"},
  "INFY.NS":     {symbol:"INFY.NS",    name:"Infosys",               price:1482.25,change:+8.95, pct:+0.61,high:1490, low:1471, vol:"4.2M",cap:"₹6.1T", sector:"IT",       currency:"₹"},
  "ITC.NS":      {symbol:"ITC.NS",     name:"ITC Limited",           price:428.70, change:-2.30, pct:-0.53,high:433,  low:426,  vol:"8.9M",cap:"₹5.3T", sector:"FMCG",     currency:"₹"},
  "WIPRO.NS":    {symbol:"WIPRO.NS",   name:"Wipro",                 price:524.85, change:+6.40, pct:+1.23,high:528,  low:517,  vol:"2.7M",cap:"₹2.7T", sector:"IT",       currency:"₹"},
  "BAJFINANCE.NS":{symbol:"BAJFINANCE.NS",name:"Bajaj Finance",      price:7124.50,change:-88.30,pct:-1.22,high:7210, low:7090, vol:"0.9M",cap:"₹4.3T", sector:"Finance",  currency:"₹"},
  "SBIN.NS":     {symbol:"SBIN.NS",    name:"State Bank of India",   price:742.30, change:+9.10, pct:+1.24,high:748,  low:733,  vol:"12.4M",cap:"₹6.6T",sector:"Finance",  currency:"₹"},
  "MARUTI.NS":   {symbol:"MARUTI.NS",  name:"Maruti Suzuki",         price:12480.00,change:+145.00,pct:+1.17,high:12550,low:12330,vol:"0.6M",cap:"₹3.8T",sector:"Auto",    currency:"₹"},
  "TITAN.NS":    {symbol:"TITAN.NS",   name:"Titan Company",         price:3312.60,change:-22.40,pct:-0.67,high:3344, low:3298, vol:"1.1M",cap:"₹2.9T", sector:"Consumer", currency:"₹"},
  "ZOMATO.NS":   {symbol:"ZOMATO.NS",  name:"Zomato",                price:198.45, change:+4.80, pct:+2.48,high:201,  low:193,  vol:"18.2M",cap:"₹1.7T",sector:"Tech",     currency:"₹"},
  "NYKAA.NS":    {symbol:"NYKAA.NS",   name:"Nykaa (FSN E-Commerce)",price:182.60, change:-3.20, pct:-1.72,high:186,  low:181,  vol:"6.3M",cap:"₹520B", sector:"Tech",     currency:"₹"},
  "PAYTM.NS":    {symbol:"PAYTM.NS",   name:"Paytm (One97 Comm.)",   price:624.30, change:+18.90,pct:+3.12,high:632,  low:608,  vol:"9.8M",cap:"₹395B", sector:"Fintech",  currency:"₹"},
  "DELHIVERY.NS":{symbol:"DELHIVERY.NS",name:"Delhivery",            price:384.70, change:-5.60, pct:-1.44,high:392,  low:382,  vol:"3.4M",cap:"₹278B", sector:"Logistics",currency:"₹"},
  "POLICYBZR.NS":{symbol:"POLICYBZR.NS",name:"PB Fintech (Policybazaar)",price:1524.80,change:+42.30,pct:+2.86,high:1538,low:1498,vol:"1.2M",cap:"₹692B",sector:"Fintech", currency:"₹"},
  "AAPL": {symbol:"AAPL", name:"Apple Inc.",       price:189.30,change:+2.10, pct:+1.12,high:190.4,low:187.2,vol:"54M", cap:"$2.97T",sector:"Tech",   currency:"$"},
  "MSFT": {symbol:"MSFT", name:"Microsoft Corp.",  price:415.80,change:-3.20, pct:-0.76,high:419.1,low:413.5,vol:"21M", cap:"$3.08T",sector:"Tech",   currency:"$"},
  "GOOGL":{symbol:"GOOGL",name:"Alphabet Inc.",    price:175.40,change:+1.80, pct:+1.04,high:176.2,low:173.8,vol:"18M", cap:"$2.18T",sector:"Tech",   currency:"$"},
  "AMZN": {symbol:"AMZN", name:"Amazon.com",       price:192.60,change:+4.50, pct:+2.39,high:193.8,low:188.9,vol:"35M", cap:"$2.01T",sector:"Tech",   currency:"$"},
  "NVDA": {symbol:"NVDA", name:"NVIDIA Corp.",     price:875.40,change:+24.80,pct:+2.92,high:881.2,low:851.3,vol:"42M", cap:"$2.16T",sector:"Semicon",currency:"$"},
};

const SPARKS = {
  "RELIANCE.NS":[2780,2810,2795,2830,2818,2841,2847],"TCS.NS":[3960,3942,3930,3915,3928,3939,3921],
  "HDFCBANK.NS":[1630,1641,1648,1655,1650,1645,1654],"INFY.NS":[1465,1470,1475,1468,1478,1480,1482],
  "ITC.NS":[432,430,428,431,429,431,428],"WIPRO.NS":[510,514,518,521,519,522,524],
  "BAJFINANCE.NS":[7300,7250,7210,7180,7150,7190,7124],"SBIN.NS":[725,730,734,738,740,735,742],
  "MARUTI.NS":[12100,12200,12280,12350,12400,12430,12480],"TITAN.NS":[3380,3360,3340,3330,3318,3324,3312],
  "ZOMATO.NS":[183,186,190,192,194,196,198],"NYKAA.NS":[192,189,186,185,183,184,182],
  "PAYTM.NS":[590,598,605,612,618,614,624],"DELHIVERY.NS":[398,394,390,388,385,387,384],
  "POLICYBZR.NS":[1460,1475,1490,1500,1510,1518,1524],
  "AAPL":[182,184,186,187,188,188,189],"MSFT":[420,418,416,417,419,417,415],
  "GOOGL":[172,173,174,175,174,175,175],"AMZN":[184,186,188,190,191,192,192],"NVDA":[820,835,848,858,865,870,875],
};

// AI suggestions per profile (object form — renamed from AI_SUGGESTIONS array)
const AI_STOCK_SUGGESTIONS = {
  conservative:[
    {symbol:"HDFCBANK.NS",reason:"Strongest retail banking franchise, ~1.2% dividend yield, low NPA ratio.",signal:"BUY", confidence:88,target:"₹1,820",upside:"+10.1%"},
    {symbol:"ITC.NS",     reason:"Diversified FMCG-hotels play with consistent dividend payouts.",              signal:"HOLD",confidence:72,target:"₹450",  upside:"+5.0%"},
    {symbol:"RELIANCE.NS",reason:"Energy-to-retail-to-telecom conglomerate. Jio Financial spinoff catalyst.",  signal:"BUY", confidence:82,target:"₹3,200",upside:"+12.4%"},
  ],
  moderate:[
    {symbol:"BAJFINANCE.NS",reason:"India's best consumer NBFC. Dip below ₹7,200 is historically a bounce.",signal:"BUY", confidence:84,target:"₹8,400",upside:"+18.0%"},
    {symbol:"TITAN.NS",    reason:"Premium consumer brand with pricing power. Rising middle class tailwind.",  signal:"BUY", confidence:79,target:"₹3,650",upside:"+10.2%"},
    {symbol:"MARUTI.NS",   reason:"Hybrid lineup and rural demand make it undervalued at current levels.",     signal:"HOLD",confidence:68,target:"₹13,000",upside:"+4.2%"},
  ],
  aggressive:[
    {symbol:"ZOMATO.NS",   reason:"Turned EBITDA positive. Quick commerce (Blinkit) is a 10x opportunity.",  signal:"BUY", confidence:81,target:"₹240",  upside:"+21.0%"},
    {symbol:"PAYTM.NS",    reason:"Post-RBI turbulence repricing is overdone. Core payments business intact.", signal:"BUY", confidence:66,target:"₹750",  upside:"+20.2%"},
    {symbol:"POLICYBZR.NS",reason:"India insurance penetration 4% vs global 7%. Digital-first tailwind.",     signal:"BUY", confidence:74,target:"₹1,800",upside:"+18.1%"},
  ],
  global:[
    {symbol:"NVDA", reason:"AI infrastructure supercycle Year 2. Blackwell chip demand backlogged 12+ months.",signal:"BUY", confidence:91,target:"$980", upside:"+12.0%"},
    {symbol:"MSFT", reason:"Azure + Copilot + OpenAI partnership = most durable AI moat.",                    signal:"BUY", confidence:87,target:"$460", upside:"+10.7%"},
    {symbol:"AAPL", reason:"Services business growing 15% YoY with 40% margin. India manufacturing pivot.",   signal:"HOLD",confidence:76,target:"$205", upside:"+8.3%"},
  ],
};

const MOCK_NEWS = [
  {headline:"RBI holds repo rate at 6.5% — market expects cut in H2 2025",source:"Economic Times",time:"2h ago",tag:"Macro",positive:true},
  {headline:"SEBI tightens F&O regulations; weekly expiry contracts to reduce",source:"Mint",time:"4h ago",tag:"Regulation",positive:false},
  {headline:"Reliance Q3 results: Net profit up 9% to ₹21,804 Cr, beats estimates",source:"CNBC-TV18",time:"6h ago",tag:"Earnings",positive:true},
  {headline:"IT sector outlook: Infosys, TCS see recovery in BFSI vertical spending",source:"Business Standard",time:"8h ago",tag:"IT Sector",positive:true},
  {headline:"FII net buying crosses ₹12,000 Cr in Feb; Nifty heading for new high?",source:"Moneycontrol",time:"10h ago",tag:"FII Flow",positive:true},
  {headline:"Smallcap index correction: analysts advise caution at current valuations",source:"Livemint",time:"12h ago",tag:"Caution",positive:false},
];

const SECTOR_HEAT = [
  {sector:"IT / Tech",   pct:+1.8,stocks:["TCS.NS","INFY.NS","WIPRO.NS"]},
  {sector:"Banking",     pct:+0.9,stocks:["HDFCBANK.NS","SBIN.NS"]},
  {sector:"Energy",      pct:+1.2,stocks:["RELIANCE.NS"]},
  {sector:"Auto",        pct:+1.1,stocks:["MARUTI.NS"]},
  {sector:"Consumer",    pct:-0.6,stocks:["TITAN.NS","ITC.NS"]},
  {sector:"Finance",     pct:-1.2,stocks:["BAJFINANCE.NS"]},
  {sector:"New-Age Tech",pct:+2.5,stocks:["ZOMATO.NS","PAYTM.NS","POLICYBZR.NS"]},
  {sector:"Global Tech", pct:+1.6,stocks:["NVDA","MSFT","AAPL","GOOGL","AMZN"]},
];

const TOP_MOVERS = {
  gainers:[
    {symbol:"ZOMATO.NS",name:"Zomato",    pct:+2.48,price:"₹198.45"},
    {symbol:"PAYTM.NS", name:"Paytm",     pct:+3.12,price:"₹624.30"},
    {symbol:"NVDA",     name:"NVIDIA",    pct:+2.92,price:"$875.40"},
    {symbol:"POLICYBZR.NS",name:"Policybazaar",pct:+2.86,price:"₹1524.80"},
    {symbol:"AMZN",     name:"Amazon",    pct:+2.39,price:"$192.60"},
  ],
  losers:[
    {symbol:"BAJFINANCE.NS",name:"Bajaj Finance",pct:-1.22,price:"₹7124.50"},
    {symbol:"NYKAA.NS", name:"Nykaa",     pct:-1.72,price:"₹182.60"},
    {symbol:"DELHIVERY.NS",name:"Delhivery",pct:-1.44,price:"₹384.70"},
    {symbol:"MSFT",     name:"Microsoft", pct:-0.76,price:"$415.80"},
    {symbol:"TITAN.NS", name:"Titan",     pct:-0.67,price:"₹3312.60"},
  ],
};

export { EMICalculator };
