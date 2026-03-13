import os
from cryptography.fernet import Fernet

FERNET_KEY = os.getenv("FERNET_KEY")

# FIXED: validate key at startup with a clear error message
# instead of crashing with a cryptic TypeError
if not FERNET_KEY:
    raise RuntimeError(
        "FERNET_KEY is not set in environment variables. "
        "Run: python -c \"from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())\" "
        "and add it to your .env file."
    )

cipher = Fernet(FERNET_KEY.encode() if isinstance(FERNET_KEY, str) else FERNET_KEY)


def encrypt_data(data: str) -> str:
    return cipher.encrypt(data.encode()).decode()


def decrypt_data(data: str) -> str:
    return cipher.decrypt(data.encode()).decode()
