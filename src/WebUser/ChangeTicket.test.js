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

const ChangeSeatSuccess = async (driver, bookingCode, newSeat) => {
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
        await driver.sleep(500)


        //Click on "Đổi vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Đổi vé')]")), 5000);
        await cancelOption.click();
        await driver.sleep(500)

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        
        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));
        await driver.wait(until.elementIsVisible(acceptPolicy), 10000);
        await acceptPolicy.click();
        await driver.sleep(500)

        // Click on "Tiếp tục" button
        let continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tiếp tục')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500)
        
        //Click on tickets to change
        const checkAll = await driver.wait(until.elementLocated(By.css('input[type="checkbox"][name="all"]')), 5000);
        await checkAll.click();
        await driver.sleep(500)

        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        await driver.sleep(500)

        for (const seat of newSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await driver.sleep(500)
            await seatButton.click();
        }

        //Click on "Tiếp tục" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tiếp tục')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500)

        //Click on "Tiếp tục" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Xác nhận đổi vé')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500)

        //Click on "Đóng" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Đóng')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500);
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

const ChangeTripSuccess = async (driver, bookingCode, newSeat) => {
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
        await driver.sleep(500)

        //Click on "Đổi vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Đổi vé')]")), 5000);
        await cancelOption.click();
        await driver.sleep(500)

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        
        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));
        await driver.wait(until.elementIsVisible(acceptPolicy), 10000);
        await acceptPolicy.click();
        await driver.sleep(500)

        // Click on "Tiếp tục" button
        let continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tiếp tục')]")),5000);
        await continueBtn.click();
        await driver.sleep(500)
        
        //Click on tickets to change
        const checkAll = await driver.wait(until.elementLocated(By.css('input[type="checkbox"][name="all"]')), 5000);
        await checkAll.click();
        await driver.sleep(500)

        //Click on 'Đổi chuyến'
        const changeTrip = await driver.wait(until.elementLocated(By.xpath("//input[@name='changeTrip']")), 5000);
        await changeTrip.click();
        await driver.sleep(500)

        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        await driver.sleep(500)

        //Get first trip
        const firstTrip = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'searchResult')]")), 5000);

        // Click on "Chọn chuyến" button
        const selectNewTrip = await firstTrip.findElement(By.xpath("//a[contains(text(), 'Chọn chuyến')]"));
        await selectNewTrip.click();
        await driver.sleep(500)

        // Choose seat
        for (const seat of newSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
            await driver.sleep(500)
        }

        await driver.sleep(2000);

        //Click on "Tiếp tục" button
        continueBtn = await firstTrip.findElement(By.xpath(".//button[contains(text(), 'Tiếp tục')]"));
        await driver.wait(until.elementIsVisible(continueBtn), 5000);
        await continueBtn.click();
        await driver.sleep(500)

        //Click on "Tiếp tục" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Xác nhận đổi vé')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500)

        //Click on "Đóng" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Đóng')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500);
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
        await driver.sleep(500)

        //Click on "Đổi vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Đổi vé')]")), 5000);
        // Get the class attribute of the cancelOption element
        const classAttribute = await cancelOption.getAttribute('class');
        await driver.sleep(500)

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

const ChangeSeatButNotEnoughSeat = async (driver, bookingCode, newSeat) => {
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
        await driver.sleep(500)

        //Click on "Đổi vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Đổi vé')]")), 5000);
        await cancelOption.click();
        await driver.sleep(500)

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        
        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));
        await driver.wait(until.elementIsVisible(acceptPolicy), 10000);
        await acceptPolicy.click();
        await driver.sleep(500)

        // Click on "Tiếp tục" button
        let continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        await driver.sleep(500)
        
        //Click on tickets to change
        const checkAll = await driver.wait(until.elementLocated(By.css('input[type="checkbox"][name="all"]')), 5000);
        await checkAll.click();
        await driver.sleep(500)


        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        await driver.sleep(500)


        for (const seat of newSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
            await driver.sleep(500)
        }

        //Click on "Tiếp tục" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tiếp tục')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500)

        const errorMessage = await driver.wait(until.elementLocated(By.xpath("//i[contains(text(), 'Vui lòng chọn đủ số ghế')]")), 5000);
        await driver.wait(until.elementIsVisible(errorMessage), 5000);

        const closeForm = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'directBtn')]/child::*[2]")), 5000);
        await closeForm.click();
        await driver.sleep(500);

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

const ChangeTripButNotEnoughSeat = async (driver, bookingCode, newSeat) => {
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
        await driver.sleep(500)

        //Click on "Đổi vé" option
        const cancelOption = await driver.wait(until.elementLocated(By.xpath("//li[contains(text(), 'Đổi vé')]")), 5000);
        await cancelOption.click();
        await driver.sleep(500)

        // Locate the component containing the checkbox
        const actionContain = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'action_content')]")), 5000);
        
        // Locate the checkbox within the component
        const acceptPolicy = await actionContain.findElement(By.css('input[type="checkbox"]'));
        await driver.wait(until.elementIsVisible(acceptPolicy), 10000);
        await acceptPolicy.click();
        await driver.sleep(500)

        // Click on "Tiếp tục" button
        let continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        await driver.sleep(500)
        
        //Click on tickets to change
        const checkAll = await driver.wait(until.elementLocated(By.css('input[type="checkbox"][name="all"]')), 5000);
        await checkAll.click();
        await driver.sleep(500)

        //Click on 'Đổi chuyến'
        const changeTrip = await driver.wait(until.elementLocated(By.xpath("//input[@name='changeTrip']")), 5000);
        await changeTrip.click();
        await driver.sleep(500)
 
        // Click on "Tiếp tục" button
        continueBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Tiếp tục')]"));
        await continueBtn.click();
        await driver.sleep(500)
 
        //Get first trip
        const firstTrip = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'searchResult')]")), 5000);
 
        // Click on "Chọn chuyến" button
        const selectNewTrip = await firstTrip.findElement(By.xpath("//a[contains(text(), 'Chọn chuyến')]"));
        await selectNewTrip.click();
        await driver.sleep(500)

        for (const seat of newSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
            await driver.sleep(500)
        }

        //Click on "Tiếp tục" button
        continueBtn = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tiếp tục')]")), 5000);
        await continueBtn.click();
        await driver.sleep(500)

        const errorMessage = await driver.wait(until.elementLocated(By.xpath("//i[contains(text(), 'Vui lòng chọn đủ số ghế')]")), 5000);
        await driver.wait(until.elementIsVisible(errorMessage), 5000);

        const closeForm = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'directBtn')]/child::*[2]")), 5000);
        await closeForm.click();
        await driver.sleep(500);

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

describe('Change Ticket test', function () {
    jest.setTimeout(30000);
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await LoginAndNavToTicketHistory(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });
    it('Đổi chỗ hợp lệ', async () => await ChangeSeatSuccess(driver, '2XLEN1', ['A07', 'A10']));
    it('Đổi chuyến hợp lệ', async () => await ChangeTripSuccess(driver, 'BFHHDQ', ['B18', 'B19']));
    it('Vé không đạt điều kiện đổi vé', async () => await BookingNotMeetRequire(driver, 'VQ1XDX'))
    it('Đổi chỗ nhưng chọn chưa đủ số ghế', async () => await ChangeSeatButNotEnoughSeat(driver, 'D09493', ['B03']));
    it('Đổi chuyến nhưng chọn chưa đủ số ghế', async () => await ChangeTripButNotEnoughSeat(driver, 'D09493', ['B03']));
});