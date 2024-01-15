const { Builder, By, Key, until } = require('selenium-webdriver');

async function testLoginSucessDriver(driver, username, password) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3002/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password, Key.RETURN);

        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('trips');
          }, 10000);
        expect(true).toBe(true)
    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

async function testLoginUnDefinedNumber(driver) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3002/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys('kimm@gmail.com');
        await passwordInput.sendKeys('1234567', Key.RETURN);
        
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        // Wait for the login process to complete
        // Get the text of the first 'Toastify' element
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        // Check if the text "Account not found" is present
        expect(toastifyText).toContain('Account not found')
        
    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

async function testLoginWrongPassword(driver) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3002/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys('binh@gmail.com');
        await passwordInput.sendKeys('123456789', Key.RETURN);
       
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')));
        // Wait for the login process to complete
        // Get the text of the first 'Toastify' element
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        // Check if the text "Account not found" is present
        expect(toastifyText).toContain('Password is wrong')
    } catch (error) {
        console.error('An error occurred:', error); 
        throw error; 
    }
}

async function testLoginNotAuthorAccount(driver) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3002/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys('nnguyen@gmail.com');
        await passwordInput.sendKeys('1234567', Key.RETURN);
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        // Wait for the login process to complete
        // Get the text of the first 'Toastify' element
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        // Check if the text "Account not found" is present
        expect(toastifyText).toContain('Bạn không có quyền truy cập')
    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}


describe('Login Test Staff', function() {
    jest.setTimeout(30000);
    let driver;

    beforeEach(async () => {
      driver = await new Builder().forBrowser('chrome').build();
    });
  
    afterEach(async () => {
      await driver.quit();
    });
  
    it('Đăng nhập thành công tài khoản driver', async () => await testLoginSucessDriver(driver, 'binh@gmail.com', '123456'));
    
    it('Nhập email chưa có tài khoản', async () => testLoginUnDefinedNumber(driver));
    
    it('Nhập sai mật khẩu', async () => testLoginWrongPassword(driver));

    it('Nhập tài khoản không có quyền truy cập', async () => testLoginNotAuthorAccount(driver));
  });