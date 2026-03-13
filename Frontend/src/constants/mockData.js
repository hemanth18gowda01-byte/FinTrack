export const MOCK_TXN = [
  {id:1,  merchant:"Salary Credit",      amount:75000, type:"credit", date:"2025-03-01", category:"Income"},
  {id:2,  merchant:"Amazon Purchase",    amount:2340,  type:"debit",  date:"2025-03-02", category:"Shopping"},
  {id:3,  merchant:"Swiggy",             amount:480,   type:"debit",  date:"2025-03-03", category:"Food"},
  {id:4,  merchant:"Ola Cab",            amount:220,   type:"debit",  date:"2025-03-04", category:"Transport"},
  {id:5,  merchant:"Netflix",            amount:649,   type:"debit",  date:"2025-03-05", category:"Entertainment"},
  {id:6,  merchant:"BESCOM Electricity", amount:1200,  type:"debit",  date:"2025-03-06", category:"Utilities"},
  {id:7,  merchant:"Zomato",             amount:350,   type:"debit",  date:"2025-03-07", category:"Food"},
  {id:8,  merchant:"Airtel Recharge",    amount:399,   type:"debit",  date:"2025-03-08", category:"Utilities"},
  {id:9,  merchant:"Freelance Income",   amount:12000, type:"credit", date:"2025-03-10", category:"Income"},
  {id:10, merchant:"Flipkart Order",     amount:3200,  type:"debit",  date:"2025-03-11", category:"Shopping"},
  {id:11, merchant:"DMart Groceries",    amount:2800,  type:"debit",  date:"2025-03-12", category:"Food"},
  {id:12, merchant:"Apollo Pharmacy",    amount:640,   type:"debit",  date:"2025-03-13", category:"Healthcare"},
];

export const MOCK_LOAN = {
  monthly_income:75000, monthly_expenses:32000, monthly_savings:43000,
  affordable_emi:21500, recommended_loan:500000,
  suggestions:[
    {name:"Home Renovation Loan", amount:500000, emi:10800, interest_rate:10.5, tenure:60, affordable:true},
    {name:"Personal Loan",        amount:300000, emi:6700,  interest_rate:11.0, tenure:48, affordable:true},
    {name:"Education Loan",       amount:800000, emi:17200, interest_rate:9.5,  tenure:60, affordable:true},
  ],
};

export const MONTHLY_DATA = [
  {month:"Oct", income:72000, expenses:38000},
  {month:"Nov", income:75000, expenses:41000},
  {month:"Dec", income:82000, expenses:52000},
  {month:"Jan", income:75000, expenses:35000},
  {month:"Feb", income:75000, expenses:29000},
  {month:"Mar", income:87000, expenses:32000},
];

export const DAILY_DATA = [
  {day:"Mar 1",  income:75000, expenses:0,    food:0,    shopping:0,    transport:0,   others:0},
  {day:"Mar 2",  income:0,     expenses:2340, food:0,    shopping:2340, transport:0,   others:0},
  {day:"Mar 3",  income:0,     expenses:480,  food:480,  shopping:0,    transport:0,   others:0},
  {day:"Mar 4",  income:0,     expenses:220,  food:0,    shopping:0,    transport:220, others:0},
  {day:"Mar 5",  income:0,     expenses:649,  food:0,    shopping:0,    transport:0,   others:649},
  {day:"Mar 6",  income:0,     expenses:1200, food:0,    shopping:0,    transport:0,   others:1200},
  {day:"Mar 7",  income:0,     expenses:350,  food:350,  shopping:0,    transport:0,   others:0},
  {day:"Mar 8",  income:0,     expenses:399,  food:0,    shopping:0,    transport:0,   others:399},
  {day:"Mar 9",  income:0,     expenses:0,    food:0,    shopping:0,    transport:0,   others:0},
  {day:"Mar 10", income:12000, expenses:0,    food:0,    shopping:0,    transport:0,   others:0},
  {day:"Mar 11", income:0,     expenses:3200, food:0,    shopping:3200, transport:0,   others:0},
  {day:"Mar 12", income:0,     expenses:2800, food:2800, shopping:0,    transport:0,   others:0},
  {day:"Mar 13", income:0,     expenses:640,  food:0,    shopping:0,    transport:0,   others:640},
  {day:"Mar 14", income:0,     expenses:0,    food:0,    shopping:0,    transport:0,   others:0},
];

export const CAT_DATA = [
  {name:"Food",          value:3630, budget:3000, color:"#c8a96e"},
  {name:"Shopping",      value:5540, budget:4000, color:"#e8d5b0"},
  {name:"Transport",     value:220,  budget:500,  color:"#a08c5c"},
  {name:"Utilities",     value:1599, budget:1500, color:"#7a6840"},
  {name:"Entertainment", value:649,  budget:600,  color:"#d4b483"},
  {name:"Healthcare",    value:640,  budget:800,  color:"#f0e6d0"},
];

export const MOCK_STOCKS = {
  "RELIANCE.NS":{symbol:"RELIANCE.NS",name:"Reliance Industries",      price:2847.60,change:+34.20,pct:+1.22,high:2860, low:2810, vol:"3.2M", cap:"₹19.2T",sector:"Energy",   currency:"₹"},
  "TCS.NS":     {symbol:"TCS.NS",     name:"Tata Consultancy Svcs",    price:3921.15,change:-18.50,pct:-0.47,high:3945, low:3898, vol:"1.8M", cap:"₹14.3T",sector:"IT",       currency:"₹"},
  "HDFCBANK.NS":{symbol:"HDFCBANK.NS",name:"HDFC Bank",                price:1654.40,change:+12.80,pct:+0.78,high:1668, low:1641, vol:"5.1M", cap:"₹12.5T",sector:"Finance",  currency:"₹"},
  "INFY.NS":    {symbol:"INFY.NS",    name:"Infosys",                  price:1482.25,change:+8.95, pct:+0.61,high:1490, low:1471, vol:"4.2M", cap:"₹6.1T", sector:"IT",       currency:"₹"},
  "ITC.NS":     {symbol:"ITC.NS",     name:"ITC Limited",              price:428.70, change:-2.30, pct:-0.53,high:433,  low:426,  vol:"8.9M", cap:"₹5.3T", sector:"FMCG",     currency:"₹"},
  "WIPRO.NS":   {symbol:"WIPRO.NS",   name:"Wipro",                    price:524.85, change:+6.40, pct:+1.23,high:528,  low:517,  vol:"2.7M", cap:"₹2.7T", sector:"IT",       currency:"₹"},
  "BAJFINANCE.NS":{symbol:"BAJFINANCE.NS",name:"Bajaj Finance",        price:7124.50,change:-88.30,pct:-1.22,high:7210, low:7090, vol:"0.9M", cap:"₹4.3T", sector:"Finance",  currency:"₹"},
  "SBIN.NS":    {symbol:"SBIN.NS",    name:"State Bank of India",      price:742.30, change:+9.10, pct:+1.24,high:748,  low:733,  vol:"12.4M",cap:"₹6.6T", sector:"Finance",  currency:"₹"},
  "MARUTI.NS":  {symbol:"MARUTI.NS",  name:"Maruti Suzuki",            price:12480,  change:+145,  pct:+1.17,high:12550,low:12330,vol:"0.6M", cap:"₹3.8T", sector:"Auto",     currency:"₹"},
  "TITAN.NS":   {symbol:"TITAN.NS",   name:"Titan Company",            price:3312.60,change:-22.40,pct:-0.67,high:3344, low:3298, vol:"1.1M", cap:"₹2.9T", sector:"Consumer", currency:"₹"},
  "ZOMATO.NS":  {symbol:"ZOMATO.NS",  name:"Zomato",                   price:198.45, change:+4.80, pct:+2.48,high:201,  low:193,  vol:"18.2M",cap:"₹1.7T", sector:"Tech",     currency:"₹"},
  "NYKAA.NS":   {symbol:"NYKAA.NS",   name:"Nykaa (FSN E-Commerce)",   price:182.60, change:-3.20, pct:-1.72,high:186,  low:181,  vol:"6.3M", cap:"₹520B", sector:"Tech",     currency:"₹"},
  "PAYTM.NS":   {symbol:"PAYTM.NS",   name:"Paytm (One97 Comm.)",      price:624.30, change:+18.90,pct:+3.12,high:632,  low:608,  vol:"9.8M", cap:"₹395B", sector:"Fintech",  currency:"₹"},
  "DELHIVERY.NS":{symbol:"DELHIVERY.NS",name:"Delhivery",              price:384.70, change:-5.60, pct:-1.44,high:392,  low:382,  vol:"3.4M", cap:"₹278B", sector:"Logistics",currency:"₹"},
  "POLICYBZR.NS":{symbol:"POLICYBZR.NS",name:"PB Fintech (Policybazaar)",price:1524.80,change:+42.30,pct:+2.86,high:1538,low:1498,vol:"1.2M",cap:"₹692B", sector:"Fintech",  currency:"₹"},
  "AAPL":{symbol:"AAPL",name:"Apple Inc.",      price:189.30,change:+2.10, pct:+1.12,high:190.4,low:187.2,vol:"54M", cap:"$2.97T",sector:"Tech",   currency:"$"},
  "MSFT":{symbol:"MSFT",name:"Microsoft Corp.", price:415.80,change:-3.20, pct:-0.76,high:419.1,low:413.5,vol:"21M", cap:"$3.08T",sector:"Tech",   currency:"$"},
  "GOOGL":{symbol:"GOOGL",name:"Alphabet Inc.", price:175.40,change:+1.80, pct:+1.04,high:176.2,low:173.8,vol:"18M", cap:"$2.18T",sector:"Tech",   currency:"$"},
  "AMZN":{symbol:"AMZN",name:"Amazon.com",      price:192.60,change:+4.50, pct:+2.39,high:193.8,low:188.9,vol:"35M", cap:"$2.01T",sector:"Tech",   currency:"$"},
  "NVDA":{symbol:"NVDA",name:"NVIDIA Corp.",    price:875.40,change:+24.80,pct:+2.92,high:881.2,low:851.3,vol:"42M", cap:"$2.16T",sector:"Semicon",currency:"$"},
};

export const SPARKS = {
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

export const PROFILES = {
  conservative:{label:"Conservative",icon:"◉",color:"#4caf78",desc:"Large-cap Indian blue chips — steady dividends, low volatility",tickers:["RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","ITC.NS"]},
  moderate:    {label:"Moderate",    icon:"◈",color:"#c8a96e",desc:"Balanced mix of growth & stability — mid + large cap",        tickers:["WIPRO.NS","BAJFINANCE.NS","SBIN.NS","MARUTI.NS","TITAN.NS"]},
  aggressive:  {label:"Aggressive",  icon:"◭",color:"#e05252",desc:"High-growth small/mid cap — fintech & new-age sectors",        tickers:["ZOMATO.NS","NYKAA.NS","PAYTM.NS","DELHIVERY.NS","POLICYBZR.NS"]},
  global:      {label:"Global",      icon:"◆",color:"#5b8fd4",desc:"US mega-caps — global diversification from INR portfolio",     tickers:["AAPL","MSFT","GOOGL","AMZN","NVDA"]},
};

export const AI_STOCK_SUGGESTIONS = {
  conservative:[
    {symbol:"HDFCBANK.NS",reason:"Strongest retail banking franchise, ~1.2% dividend yield, low NPA ratio.",signal:"BUY", confidence:88,target:"₹1,820",upside:"+10.1%"},
    {symbol:"ITC.NS",     reason:"Diversified FMCG-hotels play with consistent dividend payouts.",             signal:"HOLD",confidence:72,target:"₹450",  upside:"+5.0%"},
    {symbol:"RELIANCE.NS",reason:"Energy-to-retail-to-telecom conglomerate. Jio Financial spinoff catalyst.", signal:"BUY", confidence:82,target:"₹3,200",upside:"+12.4%"},
  ],
  moderate:[
    {symbol:"BAJFINANCE.NS",reason:"India's best consumer NBFC. Dip below ₹7,200 is historically a bounce.",signal:"BUY", confidence:84,target:"₹8,400",upside:"+18.0%"},
    {symbol:"TITAN.NS",    reason:"Premium consumer brand with pricing power. Rising middle class tailwind.", signal:"BUY", confidence:79,target:"₹3,650",upside:"+10.2%"},
    {symbol:"MARUTI.NS",   reason:"Hybrid lineup and rural demand make it undervalued at current levels.",    signal:"HOLD",confidence:68,target:"₹13,000",upside:"+4.2%"},
  ],
  aggressive:[
    {symbol:"ZOMATO.NS",   reason:"Turned EBITDA positive. Quick commerce (Blinkit) is a 10x opportunity.", signal:"BUY", confidence:81,target:"₹240",  upside:"+21.0%"},
    {symbol:"PAYTM.NS",    reason:"Post-RBI turbulence repricing overdone. Core payments business intact.",   signal:"BUY", confidence:66,target:"₹750",  upside:"+20.2%"},
    {symbol:"POLICYBZR.NS",reason:"India insurance penetration 4% vs global 7%. Digital-first tailwind.",    signal:"BUY", confidence:74,target:"₹1,800",upside:"+18.1%"},
  ],
  global:[
    {symbol:"NVDA", reason:"AI infrastructure supercycle Year 2. Blackwell chip demand backlogged 12+ months.",signal:"BUY",confidence:91,target:"$980",upside:"+12.0%"},
    {symbol:"MSFT", reason:"Azure + Copilot + OpenAI partnership = most durable AI moat.",                   signal:"BUY",confidence:87,target:"$460",upside:"+10.7%"},
    {symbol:"AAPL", reason:"Services business growing 15% YoY with 40% margin. India manufacturing pivot.",  signal:"HOLD",confidence:76,target:"$205",upside:"+8.3%"},
  ],
};

export const MOCK_NEWS = [
  {headline:"RBI holds repo rate at 6.5% — market expects cut in H2 2025",            source:"Economic Times",    time:"2h ago",  tag:"Macro",      positive:true},
  {headline:"SEBI tightens F&O regulations; weekly expiry contracts to reduce",        source:"Mint",             time:"4h ago",  tag:"Regulation", positive:false},
  {headline:"Reliance Q3 results: Net profit up 9% to ₹21,804 Cr, beats estimates",   source:"CNBC-TV18",        time:"6h ago",  tag:"Earnings",   positive:true},
  {headline:"IT sector outlook: Infosys, TCS see recovery in BFSI vertical spending", source:"Business Standard", time:"8h ago",  tag:"IT Sector",  positive:true},
  {headline:"FII net buying crosses ₹12,000 Cr in Feb; Nifty heading for new high?",  source:"Moneycontrol",     time:"10h ago", tag:"FII Flow",   positive:true},
  {headline:"Smallcap index correction: analysts advise caution at current valuations",source:"Livemint",         time:"12h ago", tag:"Caution",    positive:false},
];

export const SECTOR_HEAT = [
  {sector:"IT / Tech",    pct:+1.8, stocks:["TCS.NS","INFY.NS","WIPRO.NS"]},
  {sector:"Banking",      pct:+0.9, stocks:["HDFCBANK.NS","SBIN.NS"]},
  {sector:"Energy",       pct:+1.2, stocks:["RELIANCE.NS"]},
  {sector:"Auto",         pct:+1.1, stocks:["MARUTI.NS"]},
  {sector:"Consumer",     pct:-0.6, stocks:["TITAN.NS","ITC.NS"]},
  {sector:"Finance",      pct:-1.2, stocks:["BAJFINANCE.NS"]},
  {sector:"New-Age Tech", pct:+2.5, stocks:["ZOMATO.NS","PAYTM.NS","POLICYBZR.NS"]},
  {sector:"Global Tech",  pct:+1.6, stocks:["NVDA","MSFT","AAPL","GOOGL","AMZN"]},
];

export const TOP_MOVERS = {
  gainers:[
    {symbol:"ZOMATO.NS",   name:"Zomato",       pct:+2.48, price:"₹198.45"},
    {symbol:"PAYTM.NS",    name:"Paytm",        pct:+3.12, price:"₹624.30"},
    {symbol:"NVDA",        name:"NVIDIA",       pct:+2.92, price:"$875.40"},
    {symbol:"POLICYBZR.NS",name:"Policybazaar", pct:+2.86, price:"₹1524.80"},
    {symbol:"AMZN",        name:"Amazon",       pct:+2.39, price:"$192.60"},
  ],
  losers:[
    {symbol:"BAJFINANCE.NS",name:"Bajaj Finance",pct:-1.22, price:"₹7124.50"},
    {symbol:"NYKAA.NS",    name:"Nykaa",        pct:-1.72, price:"₹182.60"},
    {symbol:"DELHIVERY.NS",name:"Delhivery",    pct:-1.44, price:"₹384.70"},
    {symbol:"MSFT",        name:"Microsoft",    pct:-0.76, price:"$415.80"},
    {symbol:"TITAN.NS",    name:"Titan",        pct:-0.67, price:"₹3312.60"},
  ],
};