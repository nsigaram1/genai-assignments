/**
 * Collection of default prompts for different use cases (ICE POT Format)
 */
export const DEFAULT_PROMPTS = {
 
  /**
   * Selenium Java Page Object Prompt (No Test Class)
   */
  SELENIUM_JAVA_PAGE_ONLY: `
    Instructions:
    - Generate ONLY a Selenium Java Page Object Class (no test code).
    - Add JavaDoc for methods & class.
    - Use Selenium 2.30+ compatible imports.
    - Use meaningful method names.
    - Do NOT include explanations or test code.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`java
    package com.testleaf.pages;

    /**
     * Page Object for Component Page
     */
    public class ComponentPage {
        // Add methods as per the DOM
    }
    \`\`\`

    Persona:
    - Audience: Automation engineer focusing on maintainable POM structure.

    Output Format:
    - A single Java class inside a \`\`\`java\`\`\` block.

    Tone:
    - Clean, maintainable, enterprise-ready.
  `,

  /**
   * Playwright TypeScript Page Object Prompt (No Test Class)
   */
  PLAYWRIGHT_TYPESCRIPT_PAGE_ONLY: `
    Instructions:
    - Generate ONLY a TypeScript Playwright Page Object class (no test or feature code).
    - Use the Playwright Page type from the 'playwright' package.
    - Use async methods and await every browser interaction.
    - Prefer resilient locators such as getByRole, getByLabel, and getByText; use CSS selectors only when needed for the DOM.
    - Do not add arbitrary sleeps; rely on Playwright's built-in waiting behavior.
    - Use meaningful method names and include concise TSDoc for the class and public methods.
    - Do NOT include explanations or test code.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`
    URL: \${pageUrl}

    Example:
    \`\`\`typescript
    import { Page } from 'playwright';

    export class ComponentPage {
      constructor(private readonly page: Page) {}

      async open(): Promise<void> {
        await this.page.goto('\${pageUrl}');
      }
    }
    \`\`\`

    Output Format:
    - A single TypeScript class inside a \`\`\`typescript\`\`\` block.

    Tone:
    - Clean, maintainable, executable, and enterprise-ready.
  `,

  /**
   * Cucumber Feature File Only Prompt
   */
  CUCUMBER_ONLY: `
    Instructions:
    - Generate ONLY a Cucumber (.feature) file.
    - Use Scenario Outline with Examples table.
    - Make sure every step is relevant to the provided DOM.
    - Do not combine multiple actions into one step.
    - Use South India realistic dataset (names, addresses, pin codes, mobile numbers).
    - Use dropdown values only from provided DOM.
    - Generate multiple scenarios if applicable.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`

    Example:
    \`\`\`gherkin
    Feature: Login to OpenTaps

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
      | "testuser" | "testpass"|
      | "admin"    | "admin123"|
    \`\`\`

    Persona:
    - Audience: BDD testers who only need feature files.

    Output Format:
    - Only valid Gherkin in a \`\`\`gherkin\`\`\` block.

    Tone:
    - Clear, structured, executable.
  `,

  /**
   * Cucumber with Step Definitions
   */
  CUCUMBER_WITH_SELENIUM_JAVA_STEPS: `
    Instructions:
    - Generate BOTH:
      1. A Cucumber .feature file.
      2. A Java step definition class for selenium.
    - Do NOT include Page Object code.
    - Step defs must include WebDriver setup, explicit waits, and actual Selenium code.
    - Use Scenario Outline with Examples table (South India realistic data).

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`
    URL: \${pageUrl}

    Example:
    \`\`\`gherkin
    Feature: Login to OpenTaps

    Scenario Outline: Successful login with valid credentials
      Given I open the login page
      When I type "<username>" into the Username field
      And I type "<password>" into the Password field
      And I click the Login button
      Then I should be logged in successfully

    Examples:
      | username   | password  |
\      | "admin"    | "admin123"|
    \`\`\`

    \`\`\`java
    package com.leaftaps.stepdefs;

    import io.cucumber.java.en.*;
    import org.openqa.selenium.*;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.support.ui.*;

    public class LoginStepDefinitions {
        private WebDriver driver;
        private WebDriverWait wait;

        @io.cucumber.java.Before
        public void setUp() {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            driver.manage().window().maximize();
        }

        @io.cucumber.java.After
        public void tearDown() {
            if (driver != null) driver.quit();
        }

        @Given("I open the login page")
        public void openLoginPage() {
            driver.get("\${pageUrl}");
        }

        @When("I type {string} into the Username field")
        public void enterUsername(String username) {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
            el.sendKeys(username);
        }

        @When("I type {string} into the Password field")
        public void enterPassword(String password) {
            WebElement el = wait.until(ExpectedConditions.elementToBeClickable(By.id("password")));
            el.sendKeys(password);
        }

        @When("I click the Login button")
        public void clickLogin() {
            driver.findElement(By.xpath("//button[contains(text(),'Login')]")).click();
        }

        @Then("I should be logged in successfully")
        public void verifyLogin() {
            WebElement success = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("success")));
            assert success.isDisplayed();
        }
    }
    \`\`\`

    Persona:
    - Audience: QA engineers working with Cucumber & Selenium.

    Output Format:
    - Gherkin in \`\`\`gherkin\`\`\` block + Java code in \`\`\`java\`\`\` block.

    Tone:
    - Professional, executable, structured.
  `,

  /**
   * Cucumber with Playwright TypeScript Step Definitions
   */
  CUCUMBER_WITH_PLAYWRIGHT_TYPESCRIPT_STEPS: `
    Instructions:
    - Generate BOTH:
      1. A Cucumber .feature file.
      2. A TypeScript Cucumber step-definition file using Playwright.
    - Do NOT include Page Object code.
    - Use @cucumber/cucumber hooks (Before and After) to launch Chromium, create a page, and close the browser.
    - Use Playwright Page APIs with async/await and resilient locators such as getByRole and getByLabel.
    - Use Playwright's built-in auto-waiting; do not add arbitrary sleeps.
    - Include required imports and a typed World/context strategy so the step definitions are coherent TypeScript.
    - Use Scenario Outline with an Examples table and South India realistic test data where relevant.

    Context:
    DOM:
    \`\`\`html
    \${domContent}
    \`\`\`
    URL: \${pageUrl}

    Example:
    \`\`\`gherkin
    Feature: Login

    Scenario: Successful login
      Given I open the login page
      When I enter valid credentials
      Then I should see the account page
    \`\`\`

    \`\`\`typescript
    import { After, Before, Given, setWorldConstructor, World } from '@cucumber/cucumber';
    import { chromium, type Browser, type Page } from 'playwright';

    class PlaywrightWorld extends World {
      browser?: Browser;
      page?: Page;
    }

    setWorldConstructor(PlaywrightWorld);

    Before(async function (this: PlaywrightWorld) {
      this.browser = await chromium.launch();
      this.page = await this.browser.newPage();
    });

    After(async function (this: PlaywrightWorld) {
      await this.browser?.close();
    });

    Given('I open the login page', async function (this: PlaywrightWorld) {
      if (!this.page) throw new Error('Playwright page is not initialized');
      await this.page.goto('\${pageUrl}');
    });
    \`\`\`

    Persona:
    - Audience: QA engineers using Cucumber with Playwright and TypeScript.

    Output Format:
    - Gherkin in a \`\`\`gherkin\`\`\` block and TypeScript step definitions in a \`\`\`typescript\`\`\` block.

    Tone:
    - Professional, executable, and structured.
  `
};

/**
 * Helper function to escape code blocks in prompts
 */
function escapeCodeBlocks(text) {
  return text.replace(/```/g, '\\`\\`\\`');
}

/**
 * Function to fill template variables in a prompt
 */
export function getPrompt(promptKey, variables = {}) {
  let prompt = DEFAULT_PROMPTS[promptKey];
  if (!prompt) {
    throw new Error(`Prompt not found: ${promptKey}`);
  }

  Object.entries(variables).forEach(([k, v]) => {
    const regex = new RegExp(`\\$\\{${k}\\}`, 'g');
    prompt = prompt.replace(regex, v);
  });

  return prompt.trim();
}

export const CODE_GENERATOR_TYPES = {
  SELENIUM_JAVA_PAGE_ONLY: 'Selenium-Java-Page-Only',
  CUCUMBER_ONLY: 'Cucumber-Only',
  CUCUMBER_WITH_SELENIUM_JAVA_STEPS: 'Cucumber-With-Selenium-Java-Steps',
};
