// Import necessary dependencies and test utilities
const { Builder, By, Key, until } = require('selenium-webdriver');

const LoginAndNavToChangePassword = async (driver, username, password) => {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3000/login');

        // Find the username and password input fields
        const usernameInput = await driver.findElement(By.name('username'));
        const passwordInput = await driver.findElement(By.name('password'));
        let initialUrl = await driver.getCurrentUrl();
        // Enter the username and password
        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);

        // Wait for the login process to complete
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
        await loginButton.click();

        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url !== initialUrl;
        }, 5000);

        // Hover over the element with class 'userOption'
        // const userOption = await driver.findElement(By.css('.userOption'));
        const userOption = await driver.wait(until.elementLocated(By.css("[class*='userOption']")), 5000);
        await driver.actions().move({ origin: userOption }).perform();

        // Click on the element with class 'optionItem' that contains the text 'Đổi mật khẩu'
        const optionItem = await driver.findElement(By.xpath("//div[contains(@class, 'optionItem') and .//span[contains(text(), 'Đổi mật khẩu')]]"));
        await optionItem.click();

        // Check that the current URL contains 'change-password'
        await driver.wait(until.urlContains('change-password'), 5000);
    }
    catch (error) {
        // Find the second child of an element with a class that contains "directBtn"
        console.log(error)
        throw (error)
    }

}

const ChangePasswordSuccess = async (driver, username, oldPassword, newPassword) => {
    try {
        const oldPass = await driver.wait(until.elementLocated(By.name('oldpass')), 5000)
        const newPass = await driver.wait(until.elementLocated(By.name('newpass')), 5000)
        const rePass = await driver.wait(until.elementLocated(By.name('repass')), 5000)

        await oldPass.sendKeys(oldPassword);
        await newPass.sendKeys(newPassword);
        await rePass.sendKeys(newPassword);

        const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Xác nhận')]"));
        await updateButton.click();

        //navigate to login page
        let initialUrl = 'http://localhost:3000/login'
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url === initialUrl;
        }, 10000);

        //login with new password
        // Find the username and password input fields
        const newUsernameInput = await driver.findElement(By.name('username'));
        const newPasswordInput = await driver.findElement(By.name('password'));
        await newUsernameInput.sendKeys(username);
        await newPasswordInput.sendKeys(newPassword);
        // Wait for the login process to complete
        const newLoginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
        await newLoginButton.click();

        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url !== initialUrl;
        }, 5000);
        expect(true).toBe(true);
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        // Hover over the element with class 'userOption'
        // const userOption = await driver.findElement(By.css('.userOption'));
        const userOption = await driver.wait(until.elementLocated(By.css("[class*='userOption']")), 5000);
        await driver.actions().move({ origin: userOption }).perform();

        // Click on the element with class 'optionItem' that contains the text 'Đổi mật khẩu'
        const optionItem = await driver.findElement(By.xpath("//div[contains(@class, 'optionItem') and .//span[contains(text(), 'Đổi mật khẩu')]]"));
        await optionItem.click();

        // Check that the current URL contains 'change-password'
        await driver.wait(until.urlContains('change-password'), 5000);
    }
}

const WrongOldPass = async (driver, newPassword) => {
    try {
        const oldPass = await driver.wait(until.elementLocated(By.name('oldpass')), 5000)
        const newPass = await driver.wait(until.elementLocated(By.name('newpass')), 5000)
        const rePass = await driver.wait(until.elementLocated(By.name('repass')), 5000)

        await oldPass.sendKeys(newPassword);
        await newPass.sendKeys(newPassword);
        await rePass.sendKeys(newPassword);

        const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Xác nhận')]"));
        await updateButton.click();

        const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
        await driver.wait(until.elementIsVisible(toastMessage), 5000);
        const toastText = await toastMessage.getText();
        expect(toastText).toContain('Sai mật khẩu cũ');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Change password test', function () {
    jest.setTimeout(30000);
    let driver;
    const username = '09090909091'
    const password = '123456789'

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await LoginAndNavToChangePassword(driver, username, password);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Đổi mật khẩu thành công', async () => await ChangePasswordSuccess(driver, username, password, '123456789'));
    it('Nhập sai mật khẩu cũ', async () => await WrongOldPass(driver, '123456789000'));
});