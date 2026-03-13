import os
import requests

AI_API_KEY = os.getenv("AI_API_KEY")

# Gemini 1.5 Flash — fast, free-tier friendly
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"gemini-1.5-flash:generateContent?key={AI_API_KEY}"
)


def analyze_financial_profile(transactions):
    income = 0
    expenses = 0
    for txn in transactions:
        if txn["type"] == "credit":
            income += txn["amount"]
        if txn["type"] == "debit":
            expenses += txn["amount"]
    savings = income - expenses
    emi_affordable = savings * 0.4
    return {
        "income": income,
        "expenses": expenses,
        "savings": savings,
        "affordable_emi": emi_affordable
    }


def build_ai_prompt(financial_profile, transactions, question):
    # Cap to last 20 transactions to avoid exceeding context limit
    recent = transactions[-20:]
    prompt = f"""
You are a friendly personal finance advisor for an Indian user.

User financial summary:
- Monthly Income:   INR {financial_profile['income']:,.0f}
- Monthly Expenses: INR {financial_profile['expenses']:,.0f}
- Net Savings:      INR {financial_profile['savings']:,.0f}
- Affordable EMI:   INR {financial_profile['affordable_emi']:,.0f}

Recent transactions (last {len(recent)}):
{recent}

User question:
{question}

Reply in 3-5 clear bullet points. Be specific with numbers. Keep it simple and practical.
"""
    return prompt


def call_gemini(prompt):
    """
    FIXED: was calling OpenAI (api.openai.com) — now correctly calls Gemini.
    Endpoint: generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
    Body:     { "contents": [{ "parts": [{ "text": "..." }] }] }
    Response: data["candidates"][0]["content"]["parts"][0]["text"]
    """
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "maxOutputTokens": 512,
            "temperature": 0.7
        }
    }
    try:
        response = requests.post(
            GEMINI_URL,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except requests.exceptions.RequestException as e:
        raise Exception(f"Gemini API request failed: {str(e)}")
    except (KeyError, IndexError):
        raise Exception("Unexpected Gemini response format")


def generate_ai_insight(transactions, question):
    profile = analyze_financial_profile(transactions)
    prompt = build_ai_prompt(profile, transactions, question)
    answer = call_gemini(prompt)
    return {
        "financial_profile": profile,
        "insight": answer
    }
