const puppeteer = require("puppeteer");

// Test function to check if Puppeteer is working
async function testPuppeteer(req, res) {
  let browser = null;
  
  try {
    // console.log("Testing Puppeteer installation...");
    
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto("https://www.google.com", { waitUntil: "domcontentloaded" });
    
    const title = await page.title();
    
    await browser.close();
    
    res.json({
      success: true,
      message: "Puppeteer is working correctly",
      title: title,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Puppeteer test error:", error.message);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError.message);
      }
    }
    
    res.status(500).json({
      success: false,
      error: "Puppeteer test failed",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

async function getDSC(req, res) {
  let browser = null;
  
  try {
    // console.log("Starting DSC scraping...");
    
    // More robust browser launch configuration
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
      timeout: 30000
    });

    // console.log("Browser launched successfully");

    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // console.log("Navigating to DSE website...");
    
    // Navigate to the page with better error handling
    const response = await page.goto("https://www.dsebd.org/latest_share_price_scroll_l.php", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
    }

    // console.log("Page loaded, waiting for content...");

    // Wait for the page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Try multiple selectors to find the marquee content
    const data = await page.evaluate(() => {
      // Try different selectors
      const selectors = [
        "marquee",
        ".marquee",
        "#marquee",
        "[class*='marquee']",
        "[id*='marquee']"
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && element.innerText && element.innerText.trim().length > 10) {
          return { 
            rawText: element.innerText.trim(),
            selector: selector,
            success: true 
          };
        }
      }

      // If no marquee found, try to get any text content
      const bodyText = document.body.innerText;
      if (bodyText && bodyText.length > 50) {
        return { 
          rawText: bodyText.substring(0, 500) + "...",
          selector: "body",
          success: false,
          note: "No marquee found, returning body text"
        };
      }

      return { 
        error: "No content found",
        success: false 
      };
    });

    // console.log("Data extracted:", data.success ? "Success" : "Partial success");

    await browser.close();
    browser = null;

    res.json({
      success: true,
      ...data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
  //   console.error("DSC Scraping error:", error.message);
  //   console.error("Error stack:", error.stack);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError.message);
      }
    }

    res.status(500).json({ 
      success: false,
      error: "Failed to fetch DSE data",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = {
  getDSC,
  testPuppeteer,
};
