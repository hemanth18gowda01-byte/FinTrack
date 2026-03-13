import { useState, useEffect, useCallback } from "react";
import { C } from "./constants/theme";
import { useToast } from "./hooks/useToast";
import { Toasts } from "./components/Toasts";
import { Sidebar } from "./components/Sidebar";
import { LoginScreen } from "./pages/LoginScreen";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { AIInsights } from "./pages/AIInsights";
import { LoanPlanner } from "./pages/LoanPlanner";
import { EMICalculator } from "./pages/EMICalculator";
import { StocksInvest } from "./pages/StocksInvest";
import { InsurancePlanner } from "./pages/InsurancePlanner";
import { SmartInvest } from "./pages/SmartInvest";
import { Settings } from "./pages/Settings";
import "./styles/global.css";

export default function App() {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [page,  setPage]  = useState("dashboard");
  const toast = useToast();

  const handleLogin  = useCallback((u, t) => { setUser(u); setToken(t); }, []);
  const handleLogout = useCallback(() => {
    setUser(null); setToken(null); setPage("dashboard");
    toast.show("Signed out", "info");
  }, []);

  if (!user || !token) {
    return (
      <>
        <Toasts toasts={toast.toasts} />
        <LoginScreen onLogin={handleLogin} toast={toast} />
      </>
    );
  }

  const pages = {
    dashboard:    <Dashboard      token={token} toast={toast} />,
    transactions: <Transactions   token={token} toast={toast} />,
    ai:           <AIInsights     token={token} toast={toast} />,
    loan:         <LoanPlanner    token={token} toast={toast} />,
    emi:          <EMICalculator  token={token} toast={toast} />,
    stocks:       <StocksInvest   token={token} toast={toast} />,
    insurance:    <InsurancePlanner token={token} toast={toast} />,
    invest:       <SmartInvest    token={token} toast={toast} />,
    settings:     <Settings       token={token} toast={toast} />,
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:C.bg,color:C.text0,fontFamily:C.sans}}>
      <Toasts toasts={toast.toasts} />
      <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main style={{flex:1,overflowY:"auto"}} className="fade-in">
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}