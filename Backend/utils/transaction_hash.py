import hashlib

def generate_hash(txn):

    raw = f"{txn['amount']}{txn['merchant']}{txn['date']}"

    return hashlib.sha256(raw.encode()).hexdigest()