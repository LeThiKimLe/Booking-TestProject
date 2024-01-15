// Import necessary dependencies and test utilities
const { Builder, By, Key, until } = require('selenium-webdriver');

async function LoginSucessStaff(driver, username, password) {
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
        await driver.sleep(500)

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const ChangeInfor = async (driver) => {
    try{
        await driver.sleep(500)
        // Click on class "avatar"
        const avatar = await driver.wait(until.elementLocated(By.className('avatar')), 5000);
        await avatar.click();
        await driver.sleep(500)
        //Click on a tag "Đổi mật khẩu"
        const changeInfor = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Thông tin tài khoản')]")), 5000);
        await changeInfor.click();
        //Wait for url contain "change-password"
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('infor');
        }, 10000);

        await driver.sleep(2000)
        // Click on the 'Cập nhật' button
        const updateButton1 = await driver.findElement(By.xpath("//button[contains(text(), 'Cập nhật')]"));
        //Scroll to element
        await driver.executeScript("arguments[0].scrollIntoView(true);", updateButton1);
        await driver.sleep(1000)
        await updateButton1.click();
        // Enter new values for 'name' and 'email'
        const telInput = await driver.wait(until.elementLocated(By.name('tel')), 5000)
        const addressInput = await driver.wait(until.elementLocated(By.name('address')), 5000)

        await driver.wait(until.elementIsEnabled(telInput), 6000);
        let inputValue = await telInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await telInput.sendKeys(...backspaceSeries);
        await telInput.sendKeys('0990573829');

        await driver.wait(until.elementIsEnabled(addressInput), 6000);
        inputValue = await addressInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await addressInput.sendKeys(...backspaceSeries);
        await addressInput.sendKeys('Đình Phong Phú, Quận 9, Thành phố Hồ Chí Minh');

        // Click on the 'Cập nhật' button again
        await updateButton1.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Sửa thông tin thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Profile test', function () {
    jest.setTimeout(30000);
    const username = "binh@gmail.com"
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
    it('Đổi thông tin số điện thoại và địa chỉ', async () => await ChangeInfor(driver));
});