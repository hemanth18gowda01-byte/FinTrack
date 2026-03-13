def get_loan_suggestions(income, expenses):
    """
    FIXED: was calling fake external API (https://loan-api.com/eligibility) which does not exist.
    Now uses local rule-based calculation — no external dependency needed.
    """
    if not income or not expenses:
        return {"error": "income and expenses are required"}

    income = float(income)
    expenses = float(expenses)
    savings = income - expenses
    max_emi = savings * 0.4        # standard 40% EMI rule
    eligible_loan = max_emi * 180  # approx 15-year loan at ~8.5% interest

    suggestions = []

    if eligible_loan >= 2_000_000:
        suggestions.append({
            "type": "Home Loan",
            "max_amount": round(eligible_loan),
            "max_emi": round(max_emi),
            "rate": "8.5% p.a.",
            "tenure": "Up to 20 years",
            "eligibility": "High"
        })

    if eligible_loan >= 500_000:
        suggestions.append({
            "type": "Car Loan",
            "max_amount": round(min(eligible_loan * 0.3, 1_500_000)),
            "max_emi": round(max_emi * 0.4),
            "rate": "9.5% p.a.",
            "tenure": "Up to 7 years",
            "eligibility": "High" if eligible_loan >= 800_000 else "Medium"
        })

    if eligible_loan >= 100_000:
        suggestions.append({
            "type": "Personal Loan",
            "max_amount": round(min(savings * 12, 500_000)),
            "max_emi": round(max_emi * 0.25),
            "rate": "12-14% p.a.",
            "tenure": "Up to 5 years",
            "eligibility": "High"
        })

    return {
        "monthly_income": income,
        "monthly_expenses": expenses,
        "monthly_savings": savings,
        "max_affordable_emi": round(max_emi),
        "loan_suggestions": suggestions
    }
