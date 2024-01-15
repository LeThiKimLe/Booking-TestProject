const { Builder, By, Key, until } = require('selenium-webdriver');
describe('Login Test Guest', function() {
    jest.setTimeout(30000);
    let driver;
    beforeEach(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });
  
    afterEach(async () => {
      await driver.quit();
    });
  
    it('Đăng nhập với tài khoản hợp lệ', async () => {
        // Set up the Selenium WebDriver
        try {
            // Navigate to the login page
            await driver.get('http://localhost:3000/login');
            // Find the username and password input fields
            const usernameInput = await driver.findElement(By.name('username'));
            const passwordInput = await driver.findElement(By.name('password'));
            let initialUrl = await driver.getCurrentUrl();
            // Enter the username and password
            await usernameInput.sendKeys('0333843255');
            await passwordInput.sendKeys('1234567');

            // Wait for the login process to complete
            const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
            await loginButton.click();
            let url;
            await driver.wait(async () => {
                url = await driver.getCurrentUrl();
                return url !== initialUrl;
            }, 5000);
            expect(url).toEqual('http://localhost:3000/');
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    });

    it('Nhập sai định dạng số điện thoại', async () => {
        // Set up the Selenium WebDriver
        try {
            // Navigate to the login page
            await driver.get('http://localhost:3000/login');

            // Find the username and password input fields
            const usernameInput = await driver.findElement(By.name('username'));
            const passwordInput = await driver.findElement(By.name('password'));

            // Enter the username and password
            await usernameInput.sendKeys('0333843255333');
            await passwordInput.sendKeys('1234567', Key.RETURN);
            // Wait for the login process to complete
            const errorElement = await driver.findElement(By.id('error-username'));
            const displayProperty = await errorElement.getCssValue('display');
            expect(displayProperty).not.toEqual('none');
        } catch (error) {
            console.error('An error occurred:', error);
            throw error;
        }
    });
    
    it('Để trống số điện thoại', async () => {
        // Set up the Selenium WebDriver
        try {
            // Navigate to the login page
            await driver.get('http://localhost:3000/login');
    
            // Find the username and password input fields
            const usernameInput = await driver.findElement(By.name('username'));
            const passwordInput = await driver.findElement(By.name('password'));
    
            // Enter the username and password
            await usernameInput.sendKeys('');
            await passwordInput.sendKeys('1234567', Key.RETURN);
    
            // Wait for the login process to complete
            const errorElement = await driver.findElement(By.id('error-username'));
            const displayProperty = await errorElement.getCssValue('display');
            expect(displayProperty).not.toEqual('none');
        } catch (error) {
            console.error('An error occurred:', error);  
            throw error;
        }
    });

    it('Nhập số điện thoại chưa đăng ký', async () => {
        {
            try {
                // Navigate to the login page
                await driver.get('http://localhost:3000/login');
        
                // Find the username and password input fields
                const usernameInput = await driver.findElement(By.name('username'));
                const passwordInput = await driver.findElement(By.name('password'));
        
                // Enter the username and password
                await usernameInput.sendKeys('0333843254');
                await passwordInput.sendKeys('1234567');
                const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
                await loginButton.click();
                const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
                await driver.wait(until.elementIsVisible(toastMessage));
                const toastText = await toastMessage.getText();
                // Check if the text "Account not found" is present
                expect(toastText).toContain('Account not found');
            } catch (error) {
                console.error('An error occurred:', error); 
                throw error;
            }
        }
    });

    it('Nhập mật khẩu ít hơn 6 kí tự', async () => {
        try {
            // Navigate to the login page
            await driver.get('http://localhost:3000/login');
    
            // Find the username and password input fields
            const usernameInput = await driver.findElement(By.name('username'));
            const passwordInput = await driver.findElement(By.name('password'));
    
            // Enter the username and password
            await usernameInput.sendKeys('0333843255');
            await passwordInput.sendKeys('1234');
            await driver.executeScript("arguments[0].focus();", usernameInput);
    
            // Wait for the login process to complete
            const errorMessage = await driver.findElement(By.id('error-password'));
            const displayProperty = await errorMessage.getCssValue('display');
            expect(displayProperty).not.toEqual('none');
        } catch (error) {
            console.error('An error occurred:', error); 
            throw error;
        }
    });
    
    it('Nhập sai mật khẩu', async () => {
        try {
            // Navigate to the login page
            await driver.get('http://localhost:3000/login');
    
            // Find the username and password input fields
            const usernameInput = await driver.findElement(By.name('username'));
            const passwordInput = await driver.findElement(By.name('password'));
    
            // Enter the username and password
            await usernameInput.sendKeys('0333843255');
            await passwordInput.sendKeys('1234567765');
            const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
            await loginButton.click();   
            const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
            await driver.wait(until.elementIsVisible(toastMessage));
            const toastText = await toastMessage.getText();
            expect(toastText).toContain('Password is wrong');
        } catch (error) {
            console.error('An error occurred:', error); 
            throw error;
        }
    });
  });