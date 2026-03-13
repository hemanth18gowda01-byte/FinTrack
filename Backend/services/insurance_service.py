def get_insurance_plans(age, income):
    """
    FIXED: was calling fake external API (https://insurance-api.com/plans) which does not exist.
    Now returns rule-based insurance plan recommendations based on age and income.
    """
    if not age or not income:
        return {"error": "age and income are required"}

    age = int(age)
    income = float(income)
    monthly_budget = income * 0.12  # recommend 12% of income for insurance

    plans = []

    # Health insurance — everyone needs it
    if age <= 35:
        plans.append({
            "type": "Health Insurance",
            "name": "Basic Health Cover",
            "monthly_premium": 300,
            "cover": "3 Lakh",
            "recommended": True,
            "affordable": monthly_budget >= 300
        })
        plans.append({
            "type": "Health Insurance",
            "name": "Family Floater",
            "monthly_premium": 1200,
            "cover": "10 Lakh",
            "recommended": True,
            "affordable": monthly_budget >= 1200
        })
    else:
        plans.append({
            "type": "Health Insurance",
            "name": "Senior Health Cover",
            "monthly_premium": 2500,
            "cover": "15 Lakh",
            "recommended": True,
            "affordable": monthly_budget >= 2500
        })

    # Term life — recommended below 50
    if age < 50:
        plans.append({
            "type": "Term Life Insurance",
            "name": "Pure Term Plan",
            "monthly_premium": 600,
            "cover": "50 Lakh",
            "recommended": True,
            "affordable": monthly_budget >= 600
        })

    # Critical illness — for 30+
    if age >= 30:
        plans.append({
            "type": "Critical Illness",
            "name": "Critical Illness Cover",
            "monthly_premium": 1500,
            "cover": "25 Lakh",
            "recommended": age >= 35,
            "affordable": monthly_budget >= 1500
        })

    # Personal accident — everyone
    plans.append({
        "type": "Personal Accident",
        "name": "PA Comprehensive",
        "monthly_premium": 550,
        "cover": "15 Lakh",
        "recommended": True,
        "affordable": monthly_budget >= 550
    })

    return {
        "age": age,
        "monthly_income": income,
        "recommended_insurance_budget": round(monthly_budget),
        "plans": plans
    }
