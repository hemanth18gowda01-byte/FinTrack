import yfinance as yf

def get_stock_suggestions():

    symbols = ["TCS.NS","INFY.NS","HDFCBANK.NS"]

    results = []

    for s in symbols:

        stock = yf.Ticker(s)

        data = stock.history(period="1mo")

        current_price = data["Close"].iloc[-1]
        avg_price = data["Close"].mean()

        trend = "Bullish" if current_price > avg_price else "Bearish"

        results.append({
            "symbol": s,
            "price": float(current_price),
            "trend": trend
        })

    return results