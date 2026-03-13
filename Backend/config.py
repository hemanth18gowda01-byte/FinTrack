import os

# Load environment variables from .env file (for development)
from dotenv import load_dotenv
load_dotenv()

# JWT and Fernet secrets should be kept outside of source control in production
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me")
FERNET_KEY = os.getenv("FERNET_KEY")  # must be 32 url-safe base64-encoded bytes

if not FERNET_KEY:
    # fall back to a generated key but warn (not for prod)
    from cryptography.fernet import Fernet
    FERNET_KEY = Fernet.generate_key().decode()

# use an Atlas connection string here; it usually begins with
# "mongodb+srv://<user>:<pass>@clustername..." and may include options
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "expenseDB")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "transactions")