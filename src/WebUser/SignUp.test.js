const { Builder, By, Key, until } = require('selenium-webdriver');

describe('Sign Up Test', () => {
    jest.setTimeout(30000);
    let driver;

    beforeEach(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async () => {
        await driver.quit();
    });

    it('Đăng ký tài khoản hợp lệ', async () => {
        try {
            // Step 1: Locate to login page and click tab "Đăng ký"
            await driver.get('http://localhost:3000/login');
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Đăng ký')]"), 5000)).click();

            // Step 2: Enter tel into input named "tel"
            await driver.findElement(By.name('telnum')).sendKeys('0202020202');

            // Step 3: Click button "Nhận mã OTP"
            await driver.findElement(By.xpath("//button[contains(text(), 'Nhận mã OTP')]")).click();

            // Step 4: Enter code "123456" into input named "otp"
            await driver.findElement(By.name('otp')).sendKeys('123456');

            // Step 5: Click button "Xác thực mã OTP"
            await driver.findElement(By.xpath("//button[contains(text(), 'Xác thực mã OTP')]")).click();

            // Step 6: Fill out data into inputs named "name", "email", "password", "repass"
            await driver.findElement(By.name('name')).sendKeys('Kim Nguyễn An');
            await driver.findElement(By.name('email')).sendKeys('kimmmea@gmail.com');
            await driver.findElement(By.name('password')).sendKeys('1234567');
            await driver.findElement(By.name('repass')).sendKeys('1234567');

            // Step 7: Click button "Hoàn tất đăng ký"
            await driver.findElement(By.xpath("//button[contains(text(), 'Hoàn tất đăng ký')]")).click();

            // Check whether active tab is "Đăng nhập" or not
            let selectedTab;
            await driver.wait(async () => {
                selectedTab = await driver.findElement(By.css('.react-tabs__tab--selected')).getText();
                return selectedTab.includes("Đăng nhập");
            }, 5000);
            expect(selectedTab).toContain("Đăng nhập");
        } catch (error) {
            console.error('Sign-up test failed:', error);
            throw error;
        }
    });

    it('Đăng ký số đã có tài khoản', async () => {
        try {
            // Step 1: Locate to login page and click tab "Đăng ký"
            await driver.get('http://localhost:3000/login');
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Đăng ký')]"), 5000)).click();

            // Step 2: Enter tel into input named "tel"
            await driver.findElement(By.name('telnum')).sendKeys('0333843255');

            // Step 3: Click button "Nhận mã OTP"
            await driver.findElement(By.xpath("//button[contains(text(), 'Nhận mã OTP')]")).click();

            // Step 4: Check show error message
            const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 10000);
            const toastText = await toastMessage.getText();
            // Check if the text "Account not found" is present
            expect(toastText).toContain('Tài khoản đã tồn tại');
        } catch (error) {
            console.error('Fail', error);
            throw error;
        }
    });

    it('Đăng ký số điện thoại không tồn tại', async () => {
        try {
            // Step 1: Locate to login page and click tab "Đăng ký"
            await driver.get('http://localhost:3000/login');
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Đăng ký')]"), 5000)).click();

            // Step 2: Enter tel into input named "tel"
            await driver.findElement(By.name('telnum')).sendKeys('0333843254');

            // Step 3: Click button "Nhận mã OTP"
            await driver.findElement(By.xpath("//button[contains(text(), 'Nhận mã OTP')]")).click();

            // Step 4: Check show error message
            const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 10000);
            const toastText = await toastMessage.getText();
            // Check if the text "Account not found" is present
            expect(toastText).toContain('Số điện thoại không tồn tại');
        } catch (error) {
            console.error('Fail', error);
            throw error;
        }
    });
});