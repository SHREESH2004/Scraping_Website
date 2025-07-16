const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configdotenv = require("dotenv");
configdotenv.config();
const app = express();
const port = 5000;

const JWT_SECRET = process.env.JWT_SECRET;
const users = [];

app.use(cors());
app.use(bodyParser.json());
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

const scraperScriptPath = path.join(__dirname, "scraper.js");

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Registration route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  res.json({ message: "User registered successfully" });
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Scrape route (now uses scraper.js instead of Python)
app.post("/scrape", authenticate, (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ message: "Invalid or missing URL" });
  }

  const command = `node "${scraperScriptPath}" "${url}"`;
  console.log("🔍 Running command:", command);

  exec(
    command,
    { maxBuffer: 1024 * 1024 * 10 },
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Error executing scraper:", err);
        return res.status(500).json({
          message: "Error executing scraper",
          error: stderr || err.message,
        });
      }

      try {
        const scrapedData = JSON.parse(stdout);
        res.json(scrapedData);
      } catch (parseError) {
        console.error("❌ Error parsing JSON:", parseError);
        return res.status(500).json({
          message: "Error parsing data",
          error: parseError.message,
        });
      }
    }
  );
});

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
