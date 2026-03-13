const API_URL = "https://fintech-2-0.onrender.com";

export const api = {
  async loginGoogle(id_token) {
    const res = await fetch(`${API_URL}/login-google`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id_token}) });
    return res.json();
  },
  async getTransactions(token) {
    const res = await fetch(`${API_URL}/transactions`, { headers:{Authorization:`Bearer ${token}`} });
    return res.json();
  },
  async syncTransactions(token, transactions) {
    const res = await fetch(`${API_URL}/sync-transactions`, { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify(transactions) });
    return res.json();
  },
  async getLoanSuggestions(token, params="") {
    const res = await fetch(`${API_URL}/loan-suggestions${params}`, { headers:{Authorization:`Bearer ${token}`} });
    return res.json();
  },
  async calculateEMI(token, data) {
    const res = await fetch(`${API_URL}/emi-calculator`, { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify(data) });
    return res.json();
  },
  async getAIInsights(token, prompt) {
    const res = await fetch(`${API_URL}/ai-insights`, { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({prompt}) });
    return res.json();
  },
  async getStockPrices(token, tickers) {
    const res = await fetch(`${API_URL}/stock-prices?tickers=${tickers.join(",")}`, { headers:{Authorization:`Bearer ${token}`} });
    return res.json();
  },
  async getInsurancePlan(token) {
    const res = await fetch(`${API_URL}/insurance-plan`, { headers:{Authorization:`Bearer ${token}`} });
    return res.json();
  },
  async getInvestmentPlan(token, tenureYears=5, monthlyAmount=null) {
    const p = new URLSearchParams({tenure_years:tenureYears});
    if (monthlyAmount) p.set("monthly_amount", monthlyAmount);
    const res = await fetch(`${API_URL}/investment-plan?${p}`, { headers:{Authorization:`Bearer ${token}`} });
    return res.json();
  },
};

export const DEMO_TOKEN = "demo-jwt-token-2025";

// Yahoo Finance RapidAPI — used directly by StocksInvest page
// Sign up: https://rapidapi.com/apidojo/api/yahoo-finance1
export const YAHOO_KEY  = "YOUR_RAPIDAPI_KEY_HERE"; // <- replace with real key
export const YAHOO_HOST = "yahoo-finance15.p.rapidapi.com";
export const YAHOO_BASE = "https://yahoo-finance15.p.rapidapi.com/api/v1";
export const YAHOO_KEY_SET = YAHOO_KEY !== "YOUR_RAPIDAPI_KEY_HERE";

export async function yahooGet(path) {
  const res = await fetch(`${YAHOO_BASE}${path}`, {
    headers:{"x-rapidapi-key":YAHOO_KEY,"x-rapidapi-host":YAHOO_HOST}
  });
  if (!res.ok) throw new Error("Yahoo " + res.status);
  return res.json();
}