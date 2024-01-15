const { Builder, By, Key, until } = require('selenium-webdriver');

describe('Profile Update Test', function() {
  jest.setTimeout(30000);
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    await driver.quit();
  });

  it('Cập nhật thông tin cá nhân', async () => {
        // Navigate to the website
      await driver.get('http://localhost:3000/login');
      let initialUrl = await driver.getCurrentUrl();
      // Log in
      await driver.findElement(By.name('username')).sendKeys('0333843255');
      await driver.findElement(By.name('password')).sendKeys('1234567', Key.RETURN);
      const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
      await loginButton.click();
      let url
      await driver.wait(async () => {
          url = await driver.getCurrentUrl();
          return url === 'http://localhost:3000/';
          }, 5000);
      // Hover over the element with class 'userOption'
      // const userOption = await driver.findElement(By.css('.userOption'));
      const userOption = await driver.wait(until.elementLocated(By.css("[class*='userOption']")), 5000);
      await driver.actions().move({ origin: userOption }).perform();

      // Click on the element with class 'optionItem' that contains the text 'Thông tin tài khoản'
      const optionItem = await driver.findElement(By.xpath("//div[contains(@class, 'optionItem') and .//span[contains(text(), 'Thông tin tài khoản')]]"));
      await optionItem.click();

      // Check that the current URL contains 'account-infor'
      await driver.wait(until.urlContains('account-infor'), 5000);

      // Click on the 'Cập nhật' button
      const updateButton1 = await driver.findElement(By.xpath("//button[contains(text(), 'Cập nhật')]"));
      await updateButton1.click();
      // Enter new values for 'name' and 'email'
      const nameInput = await driver.wait(until.elementLocated(By.name('name')), 5000)
      const emailInput = await driver.wait(until.elementLocated(By.name('email')), 5000)

      await driver.wait(until.elementIsEnabled(nameInput), 6000);
      let inputValue = await nameInput.getAttribute('value');
      let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
      await nameInput.sendKeys(...backspaceSeries);
      await nameInput.sendKeys('Nguyễn Ánh');

      await driver.wait(until.elementIsEnabled(emailInput), 6000);
      inputValue = await emailInput.getAttribute('value');
      backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
      await emailInput.sendKeys(...backspaceSeries);
      await emailInput.sendKeys('lam@example.com');

      // Click on the 'Cập nhật' button again
      await updateButton1.click();

      // Check that the success message is displayed
      // Replace 'successMessage' with the actual id or selector of the success message element
      // Get the text of the first 'Toastify' element
      const toastMessage = await driver.wait(until.elementIsVisible(await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000)), 5000);
      const toastifyText = await toastMessage.getText();
      // Check if the text "Cập nhật thông tin thành công" is present
      expect(toastifyText).toContain('Cập nhật thông tin thành công');
      });
});