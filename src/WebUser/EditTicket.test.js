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

const EditTicketSuccess = async (driver, bookingCode) => {
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
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Sửa vé')]")), 5000);
        await cancelOption.click();

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        await driver.wait(until.elementIsVisible(actionContain), 5000);
        
        await driver.sleep(2000);
        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));
        await acceptPolicy.click();

        // Click on "Tiếp tục" button
        let continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();

        await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and b[contains(text(),'Điểm trả')]]"), 10000)).click();
        
        // Find the label element that contains the text "BX Bến Tre"
        const label = await driver.wait(until.elementLocated(By.xpath("//label[span[contains(text(), 'BX Bến Tre')]]")), 20000);

        // Find the input element within the label
        const input = await label.findElement(By.css('input[type="radio"]'));

        // Click the input element
        await input.click();

        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();

        //Click on "Xác nhận sửa vé" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Xác nhận sửa vé')]")), 5000);
        await continueBtn.click();

        //CLick on "Đóng" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Đóng')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500);
        expect(true).toBe(true)
    }
    catch (error) {
        // Find the second child of an element with a class that contains "directBtn"
        const closeForm = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'directBtn')]/child::*[2]")), 5000);
        await closeForm.click();
        console.log(error)
        throw (error)
    }
}

const EditWithoutChangeInfor = async (driver, bookingCode) => {
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

        //Click on "Sửa vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Sửa vé')]")), 5000);
        await cancelOption.click();

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        await driver.wait(until.elementIsVisible(actionContain), 5000);
        await driver.sleep(2000);

        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));
        await driver.wait(until.elementIsVisible(acceptPolicy), 5000);
        await acceptPolicy.click();

        // Click on "Tiếp tục" button
        let continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();

        await driver.sleep(1000);
        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();

        const errorMessage = await driver.wait(until.elementLocated(By.xpath("//i[contains(text(), 'Bạn chưa thay đổi điểm đi hoặc đón')]")), 5000);
        await driver.wait(until.elementIsVisible(errorMessage), 5000);
        // Find the second child of an element with a class that contains "directBtn"
        const closeForm = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'directBtn')]/child::*[2]")), 5000);
        await closeForm.click();
        await driver.sleep(500);
        expect(true).toBe(true)
    }
    catch (error) {
        // Find the second child of an element with a class that contains "directBtn"
        const closeForm = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'directBtn')]/child::*[2]")), 5000);
        await closeForm.click();
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

        await driver.sleep(1000);

        //Click on "Sửa vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Sửa vé')]")), 5000);
        // Get the class attribute of the cancelOption element
        const classAttribute = await cancelOption.getAttribute('class');

        // Check if the class attribute contains "disable"
        const isDisabled = classAttribute.includes('disable');
        if (isDisabled) {
            expect(true).toBe(true)
        } else {
            expect(false).toBe(true)
        }
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Edit Ticket test', function () {
    jest.setTimeout(30000);
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await LoginAndNavToTicketHistory(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Sửa vé hợp lệ', async () => await EditTicketSuccess(driver, 'BFHHDQ'));
    it('Không thay đổi thông tin vé', async () => await EditWithoutChangeInfor(driver, '6RP9Y0'));
    it('Vé không thỏa điều kiện sửa vé', async () => await BookingNotMeetRequire(driver, 'CK0J3D'));
});