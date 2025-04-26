import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"

  // Handle login or registration
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = authMode === "login" ? "/login" : "/register";

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (authMode === "login") {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          alert("Login successful!");
        } else {
          alert("Registration successful! You can now log in.");
        }
      } else {
        alert(data.message || "Authentication failed!");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle scraping
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);

    try {
      const response = await fetch("http://localhost:5000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to scrape the URL");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while scraping the URL");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    alert("Logged out successfully!");
  };

  return (
    <div className="App">
      {!token ? (
        <div className="auth-container">
          <h1>{authMode === "login" ? "Login" : "Register"}</h1>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button type="submit">
              {authMode === "login" ? "Login" : "Register"}
            </button>
          </form>
          <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
            {authMode === "login" ? "Switch to Register" : "Switch to Login"}
          </button>
        </div>
      ) : (
        <div className="scraper-container">
          <h1>Web Scraper</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a URL to scrape"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Scraping..." : "Scrape"}
            </button>
          </form>
          <button onClick={handleLogout}>Logout</button>

          {loading && <p>Loading...</p>}

          {output && (
            <div id="output">
              <h2>Scraped Content:</h2>

              {output.images?.length > 0 && (
                <div className="images">
                  <h3>Images:</h3>
                  {output.images.map((image, index) => (
                    <img key={index} src={image} alt={`scraped-image-${index}`} />
                  ))}
                </div>
              )}

              {output.htmlContent && (
                <div className="html-content">
                  <h3>HTML Content:</h3>
                  <textarea readOnly value={output.htmlContent}></textarea>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
