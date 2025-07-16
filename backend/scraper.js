const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { JSDOM } = require("jsdom");

// Convert relative URLs to absolute
function resolveUrl(base, src) {
  try {
    return new URL(src, base).href;
  } catch {
    return src;
  }
}

async function scrapeWebsite(targetUrl) {
  const options = new chrome.Options();
  options.addArguments("--headless", "--disable-gpu", "--no-sandbox");

  const driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

  try {
    await driver.get(targetUrl);
    const html = await driver.getPageSource();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const images = [];
    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        const absoluteUrl = resolveUrl(targetUrl, src);
        img.setAttribute("src", absoluteUrl);
        images.push(absoluteUrl);
      }
    });

    return {
      htmlContent: dom.serialize(),
      images,
    };
  } catch (error) {
    return {
      message: "Scraping failed",
      error: error.message,
    };
  } finally {
    await driver.quit();
  }
}

// CLI usage
if (require.main === module) {
  const targetUrl = process.argv[2];
  if (!targetUrl) {
    console.error(JSON.stringify({ message: "URL is required" }));
    process.exit(1);
  }

  scrapeWebsite(targetUrl)
    .then((result) => {
      console.log(JSON.stringify(result));
    })
    .catch((err) => {
      console.error(JSON.stringify({ message: err.message }));
    });
}
