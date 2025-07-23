const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

(async function basicUITest() {
  // Configure Chrome options (headless mode for CI)
  let options = new chrome.Options();
  options.addArguments("--headless"); // Runs Chrome in headless mode
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // Load your web app (ensure app is running on port 3000 in GitHub Actions)
    await driver.get("http://localhost:3000");

    // Wait until the title contains "React" (customize to your actual title)
    await driver.wait(until.titleContains("React"), 10005);

    // Wait for app to load (adjust selector as needed)
    await driver.wait(
      until.elementLocated(By.css("input[type='text']")),
      10000
    );

    // Find and fill input
    const searchInput = await driver.findElement(By.css("input[type='text']"));
    await searchInput.sendKeys("test");

    // Click submit/search button
    const button = await driver.findElement(
      By.css("button[type='submit'], button")
    );
    await button.click();

    // Wait for result to appear
    await driver.wait(until.elementLocated(By.css(".App-intro strong")), 5000);
    const result = await driver
      .findElement(By.css(".App-intro strong"))
      .getText();
    console.log("Search result:", result);

    if (!result || result.length < 1) {
      throw new Error("Empty result after search");
    }
  } catch (err) {
    console.error("Selenium test failed:", err);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();
