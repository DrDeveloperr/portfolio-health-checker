import React, { useState } from "react";

function App() {
  const [holdings, setHoldings] = useState("");
  const [portfolio, setPortfolio] = useState({});
  const [averageScore, setAverageScore] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    setPortfolio({});
    setAverageScore(null);

    try {
      console.log("🚀 Sending request to API...");
      const response = await fetch(`http://127.0.0.1:8000/health_score?holdings=${holdings}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 Received Data:", data);
      setPortfolio(data.portfolio);
      setAverageScore(data.average_health_score);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("⚠️ Unable to fetch portfolio health score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="bg-gray-950 shadow-2xl border border-gray-700 rounded-3xl p-8 max-w-lg w-full text-center">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-4">📊 Portfolio Health Checker</h1>
        <p className="text-gray-400 mb-6">Analyze the health of your portfolio with real-time data.</p>

        <div className="flex items-center space-x-3 mb-4">
          <input
            type="text"
            value={holdings}
            onChange={(e) => setHoldings(e.target.value)}
            placeholder="e.g., AAPL, TSLA, BTC"
            className="w-full p-3 border border-gray-600 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 shadow-md transition-all duration-200"
          />
          <button
            onClick={checkHealth}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-blue-500 transition duration-300 transform hover:scale-105"
          >
            Check
          </button>
        </div>

        {loading && <div className="mt-4 text-blue-400 text-lg animate-pulse">🔄 Analyzing Portfolio...</div>}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {averageScore !== null && (
          <div className="mt-6 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-blue-300">📈 Average Score: <span className="text-blue-500">{averageScore}</span></h2>
            <h3 className="text-gray-400 mt-3 font-medium">Individual Scores:</h3>
            <ul className="mt-3 space-y-2">
              {Object.entries(portfolio).map(([stock, score]) => (
                <li key={stock} className="text-lg text-white bg-gray-700 px-4 py-2 rounded-lg flex justify-between">
                  <span className="font-semibold">{stock}</span>
                  <span className="font-bold text-blue-400">{score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
