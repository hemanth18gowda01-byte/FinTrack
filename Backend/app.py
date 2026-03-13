import os
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS          # FIXED: added CORS so frontend can call the API
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from dotenv import load_dotenv

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_caching import Cache

from services.stock_service import get_stock_suggestions
from services.loan_service import get_loan_suggestions
from services.insurance_service import get_insurance_plans
from services.ai_service import generate_ai_insight

from utils.encryption import encrypt_data, decrypt_data
from utils.transaction_hash import generate_hash


load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
MONGO_URI = os.getenv("MONGO_URI")


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY

# FIXED: enable CORS for all routes so the HTML frontend is not blocked
CORS(app)

jwt = JWTManager(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

cache = Cache(config={"CACHE_TYPE": "SimpleCache"})
cache.init_app(app)

# FIXED: wrap DB connection in try/except for a clear startup error
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.server_info()  # force connection check
    db = client["finance_db"]
    transactions_collection = db["transactions"]
    users_collection = db["users"]
except Exception as e:
    raise RuntimeError(f"Cannot connect to MongoDB: {e}")


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})


# --------------------------------------------------
# Google Login
# --------------------------------------------------

@app.route("/login-google", methods=["POST"])
def login_google():
    data = request.json
    google_user_id = data.get("google_id")
    email = data.get("email")
    name = data.get("name")

    if not google_user_id:
        return jsonify({"error": "invalid login"}), 400

    try:
        existing_user = users_collection.find_one({"google_id": google_user_id})
        if not existing_user:
            users_collection.insert_one({
                "google_id": google_user_id,
                "email": email,
                "name": name
            })
    except PyMongoError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    access_token = create_access_token(identity=google_user_id)
    return jsonify({"token": access_token})


# --------------------------------------------------
# Sync Transactions
# --------------------------------------------------

@app.route("/sync-transactions", methods=["POST"])
@jwt_required()
@limiter.limit("10 per minute")
def sync_transactions():
    user_id = get_jwt_identity()
    transactions = request.json
    inserted = 0

    for txn in transactions:
        try:
            txn_hash = generate_hash(txn)
            exists = transactions_collection.find_one({"transaction_hash": txn_hash})
            if exists:
                continue

            encrypted_amount = encrypt_data(str(txn["amount"]))
            encrypted_merchant = encrypt_data(txn["merchant"])

            transactions_collection.insert_one({
                "user_id": user_id,
                "encrypted_amount": encrypted_amount,
                "encrypted_merchant": encrypted_merchant,
                "type": txn["type"],
                "category": txn.get("category", "other"),
                "date": txn["date"],
                "transaction_hash": txn_hash
            })
            inserted += 1

        except PyMongoError as e:
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        except Exception as e:
            return jsonify({"error": f"Failed to process transaction: {str(e)}"}), 400

    return jsonify({"message": "transactions synced", "inserted": inserted})


# --------------------------------------------------
# Fetch Transactions
# --------------------------------------------------

@app.route("/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    result = []

    try:
        txns = list(transactions_collection.find({"user_id": user_id}))
        for t in txns:
            try:
                result.append({
                    "amount": float(decrypt_data(t["encrypted_amount"])),
                    "merchant": decrypt_data(t["encrypted_merchant"]),
                    "type": t["type"],
                    "category": t["category"],
                    "date": t["date"]
                })
            except Exception:
                # Skip corrupted records instead of crashing
                continue

    except PyMongoError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    return jsonify(result)


# --------------------------------------------------
# AI Insights
# --------------------------------------------------

@app.route("/ai-insights", methods=["POST"])
@jwt_required()
def ai_insights():
    user_id = get_jwt_identity()
    question = request.json.get("question", "Give me a financial health summary")
    parsed_transactions = []

    try:
        txns = list(transactions_collection.find({"user_id": user_id}))
        for t in txns:
            try:
                parsed_transactions.append({
                    "amount": float(decrypt_data(t["encrypted_amount"])),
                    "merchant": decrypt_data(t["encrypted_merchant"]),
                    "type": t["type"],
                    "category": t["category"],
                    "date": t["date"]
                })
            except Exception:
                continue

    except PyMongoError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    try:
        result = generate_ai_insight(parsed_transactions, question)
    except Exception as e:
        return jsonify({"error": f"AI service error: {str(e)}"}), 502

    return jsonify(result)


# --------------------------------------------------
# Stock Suggestions
# --------------------------------------------------

@app.route("/stock-suggestions", methods=["GET"])
@cache.cached(timeout=3600)
def stock_suggestions():
    try:
        data = get_stock_suggestions()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"Stock service error: {str(e)}"}), 502


# --------------------------------------------------
# Loan Suggestions
# --------------------------------------------------
def get_loan_suggestions(income, expenses):

    savings = income - expenses

    if savings < 10000:
        return {
            "recommended_loan": "Small Personal Loan",
            "bank": "SBI",
            "interest_rate": 11.2,
            "max_amount": 100000
        }

    elif savings < 30000:
        return {
            "recommended_loan": "Car Loan",
            "bank": "ICICI Bank",
            "interest_rate": 9.1,
            "max_amount": 700000
        }

    else:
        return {
            "recommended_loan": "Home Loan",
            "bank": "HDFC Bank",
            "interest_rate": 8.4,
            "max_amount": 5000000
        }

@app.route("/loan-suggestions", methods=["POST"])
@jwt_required()
def loan_suggestions():
    data = request.json
    income = data.get("income")
    expenses = data.get("expenses")

    if not income or not expenses:
        return jsonify({"error": "income and expenses are required"}), 400

    result = get_loan_suggestions(income, expenses)
    return jsonify(result)


# --------------------------------------------------
# Insurance Suggestions
# --------------------------------------------------
def get_insurance_plans(age, income):

    plans = []

    if age < 30:
        plans.append({
            "provider": "LIC",
            "plan": "Term Life Insurance",
            "coverage": 5000000,
            "monthly_premium": 850
        })

    if income > 50000:
        plans.append({
            "provider": "HDFC Ergo",
            "plan": "Health Insurance",
            "coverage": 1000000,
            "monthly_premium": 720
        })

    plans.append({
        "provider": "ICICI Lombard",
        "plan": "Vehicle Insurance",
        "coverage": 700000,
        "monthly_premium": 2100
    })

    return plans

@app.route("/insurance-suggestions", methods=["POST"])
@jwt_required()
def insurance_suggestions():
    data = request.json
    age = data.get("age")
    income = data.get("income")

    if not age or not income:
        return jsonify({"error": "age and income are required"}), 400

    result = get_insurance_plans(age, income)
    return jsonify(result)


# --------------------------------------------------
# Run server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
