// Import necessary dependencies and test utilities
const { Builder, By, Key, until } = require('selenium-webdriver');
const convertDateFormat = (dateIn) => {
    // Define the date
    const date = new Date(dateIn);

    // Function to get the ordinal suffix of a number
    function getOrdinalSuffix(n) {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    }

    // Format the date
    const formattedDate = `${date.toLocaleString('en-US', { weekday: 'long' })}, ${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}${getOrdinalSuffix(date.getDate())}, ${date.getFullYear()}`;

    return formattedDate // Outputs: "Wednesday, January 11th, 2023"
}

async function LoginSucessStaff(driver, username, password) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3001/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password, Key.RETURN);

        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('booking');
          }, 10000);

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const ChangePassSuccess = async (driver, username, oldPassword, newPassword) => {
    try{

        await driver.sleep(500)
        // Click on class "avatar"
        const avatar = await driver.wait(until.elementLocated(By.className('avatar')), 5000);
        await avatar.click();
        await driver.sleep(500)
        //Click on a tag "Đổi mật khẩu"
        const changePass = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Đổi mật khẩu')]")), 5000);
        await changePass.click();
        //Wait for url contain "change-password"
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('change-password');
        }, 10000);

        const oldPass = await driver.wait(until.elementLocated(By.name('oldpass')), 5000)
        const newPass = await driver.wait(until.elementLocated(By.name('newpass')), 5000)
        const rePass = await driver.wait(until.elementLocated(By.name('repass')), 5000)

        await oldPass.sendKeys(oldPassword);
        await newPass.sendKeys(newPassword);
        await rePass.sendKeys(newPassword);

        const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Xác nhận')]"));
        await updateButton.click();

        //navigate to login page
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url.includes('login');
        }, 15000);

        await driver.sleep(3000)
        //login with new password
        // Find the username and password input fields
        const newUsernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const newPasswordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);
        await newUsernameInput.sendKeys(username);
        await newPasswordInput.sendKeys(newPassword);
        // Wait for the login process to complete
        const newLoginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
        await newLoginButton.click();

        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url.includes('booking');
        }, 10000);

        expect(true).toBe(true);
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const WrongOldPassword = async (driver, oldPassword, newPassword) => {
    try{
        await driver.sleep(500)
        // Click on class "avatar"
        const avatar = await driver.wait(until.elementLocated(By.className('avatar')), 5000);
        await avatar.click();
        await driver.sleep(500)
        //Click on a tag "Đổi mật khẩu"
        const changePass = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Đổi mật khẩu')]")), 5000);
        await changePass.click();
        //Wait for url contain "change-password"
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('change-password');
        }, 10000);

        const oldPass = await driver.wait(until.elementLocated(By.name('oldpass')), 5000)
        const newPass = await driver.wait(until.elementLocated(By.name('newpass')), 5000)
        const rePass = await driver.wait(until.elementLocated(By.name('repass')), 5000)

        await oldPass.sendKeys(newPassword);
        await newPass.sendKeys(newPassword);
        await rePass.sendKeys(newPassword);

        const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Xác nhận')]"));
        await updateButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 10000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Mật khẩu cũ không đúng');        
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Change password test', function () {
    jest.setTimeout(30000);
    const username = "thom@gmail.com"
    const password = "123456"
    let driver;
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize(); // Maximize the window
        await LoginSucessStaff(driver, username, password)
    });
    afterAll(async () => {
      await driver.quit();
    });
    it('Đổi mật khẩu hợp lệ', async () => await ChangePassSuccess(driver, username, password, '123456'));
    it('Đổi mật khẩu nhưng điền sai mật khẩu cũ', async () => await WrongOldPassword(driver, password, '123456789' ));
});