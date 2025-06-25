<h1 align="center">🕷️ WebScrapeX</h1>
<p align="center">
  <em>A visually stunning MERN-based web scraper that extracts HTML, links, and images from any website in seconds.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MERN%20Stack-Ready-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Scraper-Built%20with%20Cheerio-blueviolet?style=for-the-badge" />
</p>

---

## 🌐 What is WebScrapeX?

**WebScrapeX** is a **modern web scraping platform** built on the MERN stack that allows users to enter a URL and instantly extract:

- 🔗 All hyperlinks (`<a href="...">`)
- 🖼️ All images (`<img src="...">`)
- 🧱 Raw HTML (`<html>...</html>`)

All via a beautifully designed, responsive UI.

Perfect for:
- Quick data extraction
- SEO & content audits
- Dev research
- Competitive analysis

---

## ✨ Features

- 🧠 **Enter any URL** — and let WebScrapeX fetch its content
- 🔍 **Preview Extracted Data** — view all links, images, and HTML cleanly
- 🖼️ **Grid-style Image Gallery** — all fetched images shown instantly
- 🧾 **Expandable HTML Viewer** — prettified raw HTML output
- 💅 **Sexy, responsive UI** — built with Tailwind CSS and React
- 🔐 **Optional user login** — for saving scraping history (beta)

---

## 🛠️ Tech Stack

| Layer       | Technology            |
|------------|------------------------|
| 🖥 Frontend | React.js, Tailwind CSS |
| 🧠 Backend  | Node.js, Express.js    |
| 🛢 DB       | MongoDB + Mongoose     |
| 🕸️ Scraper  | Cheerio, Axios         |
| 🔐 Auth     | JWT + bcrypt (optional) |

---

## ⚙️ Setup Instructions

### 🔧 Prerequisites

- Node.js (v14+)
- MongoDB installed or Atlas instance

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/webscrapex.git
cd webscrapex
````

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 🔑 Environment Variables (`/backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key (if using auth)
```

### 🚀 Run the App

```bash
# In backend folder
npm run dev

# In frontend folder
npm start
```

---

## 🧩 How It Works

1. User enters a URL into the frontend form
2. Backend uses `axios` to fetch the HTML and `cheerio` to parse it
3. Extracts:

   * All `<a>` tags (links)
   * All `<img>` tags (images)
   * The raw HTML body
4. Results are returned to the frontend
5. UI displays:

   * Gallery view for images
   * Collapsible HTML code block
   * Clickable external links

---

## 🖼 UI Preview

<p align="center">
  <img src="https://your-image-link.com/scraper-ui.png" width="800" alt="WebScrapeX UI preview" />
</p>

---

## 📂 Folder Structure

```
webscrapex/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── utils/scraper.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.js
```

---

## 🔥 Feature Roadmap

* 📁 Download results as JSON or CSV
* 💾 Save past scrapes to user dashboard
* 🧠 AI-enhanced scraping (summarization, keyword analysis)
* 🎯 Domain-specific scraping (e.g., blogs, ecommerce)
* 🧩 Chrome extension for 1-click scraping

---

## 🤝 Contributing

We ❤️ contributions!

1. Fork it
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more info.
