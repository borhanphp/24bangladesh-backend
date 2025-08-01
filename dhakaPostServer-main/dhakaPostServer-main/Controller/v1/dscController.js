const puppeteer = require("puppeteer");

async function getDSC(req, res) {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36"
    );

    await page.goto("https://www.dsebd.org/latest_share_price_scroll_l.php", {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    await page.waitForFunction(
      () => {
        const el = document.querySelector("marquee");
        return el && el.innerText && el.innerText.length > 50;
      },
      { timeout: 20000 }
    );

    const data = await page.evaluate(() => {
      const marquee = document.querySelector("marquee");
      if (!marquee) return { error: "No marquee element found" };
      return { rawText: marquee.innerText };
    });

    await browser.close();

    // For now, return the raw text for debugging
    res.json(data);
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({ error: "Failed to fetch DSE data" });
  }
}

module.exports = {
  getDSC,
};
