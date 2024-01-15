// Import necessary dependencies and test utilities
const { format, parse } = require('date-fns');

const { Builder, By, Key, until } = require('selenium-webdriver');

const reset = async (driver) => {  
    try {
        driver.get('http://localhost:3001/#/schedule-manage/schedule')
        await driver.navigate().refresh();
    }   
    catch (error) {
        console.log(error)
        throw (error)
    }
}

async function LoginSucessAdmin(driver) {
    try {
        // Navigate to the login page
        await driver.get('http://localhost:3001/login');

        // Find the username and password input fields
        const usernameInput = await driver.wait(until.elementLocated(By.name('username')), 5000);
        const passwordInput = await driver.wait(until.elementLocated(By.name('password')), 5000);

        // Enter the username and password
        await usernameInput.sendKeys('nnguyen@gmail.com');
        await passwordInput.sendKeys('1234567', Key.RETURN);

        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('dashboard');
        }, 10000);

        //Hover on sidebar
        const sidebar = await driver.wait(until.elementLocated(By.css("[class*='sidebar']")), 5000);
        await driver.actions().move({ origin: sidebar }).perform();

        //Click on a tag "Điều hành xe"
        const employeeMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Điều hành xe')]")), 5000);
        await employeeMng.click();

        await driver.sleep(2000)

        //Click on a tag "Lịch trình xe"
        const BusMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Lịch trình xe')]")), 5000);
        await BusMng.click();

        const someElementOutsideSidebar = await driver.findElement(By.className('container-lg'));
        await driver.actions().move({origin: someElementOutsideSidebar}).perform();

        await driver.sleep(1000)

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const ScheduleTrip = async (driver, route, subRoute, date, timespan, note) => {
    try {
        //Select route
        const routeSelect = await driver.wait(until.elementLocated(By.xpath("//select[@id='route-select']")), 5000);
        await routeSelect.click();
        const routeOption = await driver.wait(until.elementLocated(By.xpath(`//option[text()='${route}']`)), 5000);
        await routeOption.click();
        await driver.sleep(500)

        //Choose date
        const datePickerElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'react-datepicker')]//input")), 5000);
        let inputValue = await datePickerElement.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await datePickerElement.sendKeys(...backspaceSeries);
        await datePickerElement.sendKeys(date);

        //Click choose subroute
        const radioButton = await driver.findElement(By.xpath(`//label[text()='${subRoute}']/preceding-sibling::input[@type='radio']`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", radioButton );
        await driver.sleep(1000)
        await radioButton.click();

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 10000);
        await driver.wait(until.stalenessOf(loadingElement), 10000);

        //Click button "Thêm lịch trình"
        const addButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm lịch trình')]")), 5000);
        await addButton.click();
        await driver.sleep(2000)

        //Enter time span
        const timeSpanInput = await driver.wait(until.elementLocated(By.xpath("//input[@id='time-span']")), 5000);
        await timeSpanInput.click();
        await driver.sleep(500)

        //Enter Continous time
        const target = parse(date, 'dd/MM/yyyy', new Date());
        const nDaysLater = format(target.setDate(target.getDate() + timespan), 'MMM dd, yyyy');
        const conTimeInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Continuous']")), 5000);
        inputValue = await conTimeInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await conTimeInput.sendKeys(...backspaceSeries);
        await conTimeInput.sendKeys(nDaysLater);

        await timeSpanInput.click();

        //Enter note
        const noteInput = await driver.wait(until.elementLocated(By.xpath("//input[@id='note']")), 5000);
        await noteInput.click();
        await noteInput.sendKeys(note);

        //Click on button "Thêm giờ" with id = "go"
        const addTimeButton = await driver.wait(until.elementLocated(By.xpath("//button[@id='go']")), 5000);
        await addTimeButton.click();

        //Click on button "OK" with id = "add-go"
        const okButton = await driver.wait(until.elementLocated(By.xpath("//button[@id='add-go']")), 5000);
        await okButton.click();

        await addTimeButton.click();

        //Click in button "Thêm giờ" with id = "return"
        const addTimeButton2 = await driver.wait(until.elementLocated(By.xpath("//button[@id='return']")), 5000);
        await addTimeButton2.click();

        //Click on button "OK" with id = "add-return"
        const okButton2 = await driver.wait(until.elementLocated(By.xpath("//button[@id='add-return']")), 5000);
        await okButton2.click();
        await addTimeButton2.click();


        //Click button "Lưu"
        const saveButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Lưu')]")), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", saveButton );
        await driver.sleep(1000)
        await saveButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã thêm lịch thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver);
    }

}

const AssignTrip = async (driver, route, subRoute, date) => {
    try {
        //Select route
        const routeSelect = await driver.wait(until.elementLocated(By.xpath("//select[@id='route-select']")), 5000);
        await routeSelect.click();
        const routeOption = await driver.wait(until.elementLocated(By.xpath(`//option[text()='${route}']`)), 5000);
        await routeOption.click();
        await driver.sleep(500)

        //Choose date
        const datePickerElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'react-datepicker')]//input")), 5000);
        let inputValue = await datePickerElement.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await datePickerElement.sendKeys(...backspaceSeries);
        await datePickerElement.sendKeys(date);

        //Click choose subroute
        const radioButton = await driver.findElement(By.xpath(`//label[text()='${subRoute}']/preceding-sibling::input[@type='radio']`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", radioButton );
        await driver.sleep(1000)
        await radioButton.click();

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 10000);
        await driver.wait(until.stalenessOf(loadingElement), 10000);

        //Click on button Phân công
        const assignButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Phân công')]")), 5000);
        await assignButton.click();
        await driver.sleep(2000)

        //Click on checkbox Phân công tự động
        const autoAssign = await driver.findElement(By.xpath(`//label[text()='Phân công tự động']/preceding-sibling::input[@type='checkbox']`));
        await autoAssign.click();
        await driver.sleep(1000)

        //Click on button "Lưu thông tin"
        const saveButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Lưu thông tin')]")), 5000);
        await saveButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã phân công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver);
    }
}

describe('Schedule management test', function () {
    jest.setTimeout(30000);
    let driver;
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize(); // Maximize the window
        await LoginSucessAdmin(driver)
    });
    afterAll(async () => {
      await driver.quit();
    });

    it('Lập lịch trình cho chuyến xe', async () => await ScheduleTrip(driver, 'TP. Hồ Chí Minh - Nha Trang', 'BX Miền Đông Mới-BX Phía Nam Nha Trang', '07/03/2024', 3, 'Xe không đi cao tốc'));
    it('Phân công tài xế và xe cho chuyến', async () => await AssignTrip(driver, 'TP. Hồ Chí Minh - Cam Ranh City', 'BX Miền Đông Mới-BX Cam Ranh', '20/01/2024'));
});