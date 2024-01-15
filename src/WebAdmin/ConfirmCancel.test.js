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

async function LoginSucessStaff(driver) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3001/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys('thom@gmail.com');
        await passwordInput.sendKeys('123456', Key.RETURN);

        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('booking');
          }, 10000);
        
        await driver.sleep(3000)

        //Hover on sidebar
        const sidebar = await driver.wait(until.elementLocated(By.css("[class*='sidebar']")), 5000);
        await driver.actions().move({ origin: sidebar }).perform();

        //Click on a tag "Duyệt hủy vé"
        const searchTicket = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Duyệt hủy vé')]")), 5000);
        await searchTicket.click();

        const someElementOutsideSidebar = await driver.findElement(By.className('container-lg'));
        await driver.actions().move({origin: someElementOutsideSidebar}).perform();

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const ConfirmCancelTicket = async (driver, requestId) => {
    try{
        // Click on div with class "accordion-item" that contains b tag with text "#" + requestId
        const accordionItem = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${requestId}']`)), 5000);
        await accordionItem.click();

        await driver.sleep(5000)
        //Click on button "Xác nhận hủy vé"
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${requestId}']//button[contains(text(), 'Xác nhận hủy vé')]`)), 5000);
        //scroll to view the button
        await driver.executeScript("arguments[0].scrollIntoView(true);", confirmButton);
        await driver.sleep(1000)
        await driver.wait(until.elementIsVisible(confirmButton), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Hủy vé thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const DenyCancelTicket = async (driver, requestId) => {
    try{
        // Click on div with class "accordion-item" that contains b tag with text "#" + requestId
        const accordionItem = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${requestId}']`)), 5000);
        await accordionItem.click();

        await driver.sleep(5000)

        //Click on button "Từ chối yêu cầu"
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${requestId}']//button[contains(text(), 'Từ chối yêu cầu')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", confirmButton);
        await driver.sleep(1000)
        await driver.wait(until.elementIsVisible(confirmButton), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã hủy yêu cầu');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}



describe('Confirm cancel tickets request test', function () {
    jest.setTimeout(30000);
    let driver;
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize(); // Maximize the window
        await LoginSucessStaff(driver)
    });
    afterAll(async () => {
      await driver.quit();
    });
    it('Chấp nhận hủy vé', async () => await ConfirmCancelTicket(driver, '18'));
    it('Từ chối yêu cầu hủy vé', async () => await DenyCancelTicket(driver, '19'));
});