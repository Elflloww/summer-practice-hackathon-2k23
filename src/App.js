import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  //Stores the data in local storage to show even if the tab is closed the re-opened
  const [mfaPairs, setMfaPairs] = useState(
    JSON.parse(localStorage.getItem("mfaPairs")) || []
  );
  const [mfaName, setMfaName] = useState("");
  const [mfaCode, setMfaCode] = useState("");

  useEffect(() => {
    if (mfaPairs?.length) {
      localStorage.setItem("mfaPairs", JSON.stringify(mfaPairs));
    }
  }, [mfaPairs]);

  useEffect(() => {
    // Generate new MFA codes for all pairs every 30 seconds
    const interval = setInterval(() => {
      setMfaPairs((prevPairs) =>
        prevPairs.map((pair) => ({ ...pair, code: generateCode() }))
      );
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Function to generate a random 6-digit code
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  // Function to add a new MFA name-code pair
  const addMFA = (e) => {
    e.preventDefault();

    if (!mfaName || !mfaCode) {
      return;
    }

    const newPair = { name: mfaName, code: parseInt(mfaCode, 10) };
    setMfaPairs([...mfaPairs, newPair]);
    setMfaName("");
    setMfaCode("");
  };

  // Function to delete an existing MFA name-code pair
  const deleteMFA = (index) => {
    setMfaPairs((prevPairs) => prevPairs.filter((_, i) => i !== index));
  };

  return (
    <div className="main-container">
      <h1>MFA Code Manager</h1>

      <form onSubmit={addMFA} className="form">
        <label htmlFor="mfaName">Name: </label>
        <input
          type="text"
          className="form-input"
          id="mfaName"
          placeholder="Please enter your name"
          value={mfaName}
          onChange={(e) => setMfaName(e.target.value)}
          required
        />
        <label htmlFor="mfaCode">Code:</label>
        <input
          className="form-input"
          type="text"
          id="mfaCode"
          pattern="[0-9]{6}"
          placeholder="Please enter a 6-digit code"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
        />
        <button type="submit" className="button">
          ADD MFA
        </button>
      </form>

      <h2>MFA Name-Code Pairs:</h2>
      <ul className="list">
        {mfaPairs.map((pair, index) => (
          <li key={index} className="name-code-pairs">
            <strong>{pair.name}:</strong> {pair.code}{" "}
            <button onClick={() => deleteMFA(index)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
