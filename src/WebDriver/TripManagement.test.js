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

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const reset = async (driver) => {
    try {
        driver.get('http://localhost:3002/#/trips')
        await driver.navigate().refresh();
    }   
    catch (error) {
        console.log(error)
        throw (error)
    }

}

const ConfirmCheckedin = async (driver, date, time, seat) => {
    try{
        //Choose a trip 
        const trip = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${date}')]//ancestor::tr//td[contains(text(), '${time}')]//ancestor::tr//td[i[contains(text(), 'Chi tiết')]]`)), 5000);
        await trip.click();

        //Wait until url contain "detail"
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('detail');
        }, 10000);

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        await driver.wait(until.stalenessOf(loadingElement), 5000);

        if (seat.includes('B')) {
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();
        }

        //Choose seat
        const seatElement = await driver.wait(until.elementLocated(By.xpath(`//button[@id='check-in-${seat}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", seatElement);
        await driver.sleep(1000)
        await seatElement.click();

        //Check if "Đã lên xe" is display
        const status = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${seat}']//b[contains(text(), 'Đã lên xe')]`)), 5000);
        expect(true).toBe(true)
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const UpdateBusState = async (driver, date, time, updateInfor) => {
    try{
        //Choose tab "Sắp diễn ra"
        await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Sắp diễn ra')]"), 5000)).click();

        //Choose trip
        const tripBus = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${date}')]//ancestor::tr//td[contains(text(), '${time}')]//ancestor::tr//td[i[contains(text(), 'Sẵn sàng')]]//*[contains(@id, 'bus-detail')]`)), 5000);
        //Get bus
        const bus = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${date}')]//ancestor::tr//td[contains(text(), '${time}')]//ancestor::tr/td[6]`)), 5000);
        const license = bus.getText();
        //Click to view detail bus infor
        await tripBus.click();
        await driver.sleep(2000)

        //Click on tab "Tình trạng"
        await driver.wait(until.elementLocated(By.xpath(`//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tình trạng xe')]`)), 5000).click();
        await driver.sleep(2000)

        //Click on button "Cập nhật"
        const updateButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'react-tabs__tab-panel--selected')]//button[contains(text(), 'Cập nhật thông tin')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", updateButton);
        await driver.sleep(1000)
        await updateButton.click();

        //Loop through element in updateInfor
        for (const [key, value] of Object.entries(updateInfor)) {
            const input = await driver.findElement(By.id(key));
            let inputValue = await input.getAttribute('value');
            let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
            await input.sendKeys(...backspaceSeries);
            await input.sendKeys(value);
        }
        // Click on the 'Cập nhật' button again
        await updateButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã cập nhật thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

describe('Trip management test', function () {
    jest.setTimeout(30000);
    const username = "thanh@gmail.com"
    const password = "@123456@"
    let driver;
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize(); // Maximize the window
        await LoginSucessStaff(driver, username, password)
    });
    afterAll(async () => {
      await driver.quit();
    });
    const busState = {
        brake: 'Tạm ổn',
        lighting: 'Tốt',
        tire: 'Tốt',
        steering: 'Tốt',
        mirror: 'Tốt',
        airCondition: 'Tốt',
        electric: 'Tốt',
        fuel: 'Tốt',
        overallState: 'Tốt'
    }
    it('Xác nhận hành khách lên xe', async () => await ConfirmCheckedin(driver, '14/01/2024', '16:00', 'A16'));
    it('Cập nhật trạng thái xe bus', async () => await UpdateBusState(driver,'16/01/2024', '15:00', busState));
});