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
    await driver.wait(until.titleContains("React"), 10000);

    // Optional: check for some element on screen
    let header = await driver.findElement(By.css("h1")).getText();
    console.log("Header Text:", header);
  } catch (err) {
    console.error("Selenium test failed:", err);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();
