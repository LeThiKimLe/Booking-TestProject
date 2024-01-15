// Import necessary dependencies and test utilities
const { Builder, By, Key, until } = require('selenium-webdriver');

const LoginAndNavToTicketHistory = async (driver) => {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3000/login');

        // Find the username and password input fields
        const usernameInput = await driver.findElement(By.name('username'));
        const passwordInput = await driver.findElement(By.name('password'));
        let initialUrl = await driver.getCurrentUrl();
        // Enter the username and password
        await usernameInput.sendKeys('0333843255');
        await passwordInput.sendKeys(1234567);

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

        // Click on the element with class 'optionItem' that contains the text 'Lịch sử đặt vé'
        const optionItem = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'optionItem') and .//span[contains(text(), 'Lịch sử đặt vé')]]")), 5000);
        await optionItem.click();

        // Check that the current URL contains 'ticket-history'
        await driver.wait(until.urlContains('ticket-history'), 5000);
        const tableHistory = await driver.wait(until.elementLocated(By.xpath("//table[contains(@class, 'tableHistory')]/tbody")), 20000);
        await driver.wait(until.elementIsVisible(tableHistory), 5000);
        await driver.sleep(2000); 
    }
    catch (error) {
        // Find the second child of an element with a class that contains "directBtn"
        console.log(error)
        throw (error)
    }

}

const CancelTicketSuccess = async (driver, bookingCode) => {
    try {
        // Find the tr element that contains the booking code
        const tr = await driver.wait(until.elementLocated(By.xpath(`//tr[td[contains(text(), '${bookingCode}')]]`)), 5000);

        // Find the input element within the tr and click it
        const checkbox = await tr.findElement(By.css('input[type="radio"]'));
        await checkbox.click();
        await driver.sleep(2000); 
        
        //Click button "Hành động"
        const actionButton = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'actionBtn')]")), 5000);
        await actionButton.click();

        //Click on "Hủy vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Hủy vé')]")), 5000);
        await cancelOption.click();

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        
        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));

        // Scroll the checkbox into view within the component
        await driver.executeScript("arguments[0].scrollIntoView(true);", acceptPolicy);

        // Wait for the checkbox to be clickable and then click it
        await driver.wait(until.elementIsVisible(acceptPolicy), 10000);
        await acceptPolicy.click();

        // Click on "Tiếp tục" button
        let continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        
        //Click on tickets to cancel
        const checkAll = await driver.wait(until.elementLocated(By.css('input[type="checkbox"][name="all"]')), 5000);
        await checkAll.click();

        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();

        //Click on "Xác nhận hủy vé" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Xác nhận hủy vé')]")), 5000);
        await continueBtn.click();

        //CLick on "Đóng" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Đóng')]")), 5000);
        await continueBtn.click();
        expect(true).toBe(true);
    }
    catch (error) {
        const closeForm = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'directBtn')]/child::*[2]")), 5000);
        await closeForm.click();
        await driver.sleep(500);
        console.log(error)
        throw (error)
    }
}

const BookingNotMeetRequire = async (driver, bookingCode) => {
    try {
        // Find the tr element that contains the booking code
        const tr = await driver.wait(until.elementLocated(By.xpath(`//tr[td[contains(text(), '${bookingCode}')]]`)), 5000);

        // Find the input element within the tr and click it
        const checkbox = await tr.findElement(By.css('input[type="radio"]'));
        await checkbox.click();
        await driver.sleep(2000); 
        
        //Click button "Hành động"
        const actionButton = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'actionBtn')]")), 5000);
        await actionButton.click();

        //Click on "Hủy vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Hủy vé')]")), 5000);
        // Get the class attribute of the cancelOption element
        const classAttribute = await cancelOption.getAttribute('class');

        // Check if the class attribute contains "disable"
        const isDisabled = classAttribute.includes('disable');
        if (isDisabled) {
            expect(true).toBe(true);
        } else {
            expect(false).toBe(true);
        }
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Cancel Ticket test', function () {
    jest.setTimeout(30000);
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await LoginAndNavToTicketHistory(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });
    it('Hủy vé thành công', async () => await CancelTicketSuccess(driver, 'L062AK'));
    it('Vé không thỏa điều kiện hủy vé', async () => await BookingNotMeetRequire(driver, 'P5F81L'));
});