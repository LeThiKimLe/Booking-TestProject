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

const reset = async (driver) => {  
    try {
        driver.get('http://localhost:3001/#/system-manage/buses')
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

        //Click on a tag "Quản lý hệ thống"
        const employeeMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý hệ thống')]")), 5000);
        await employeeMng.click();

        await driver.sleep(2000)

        //Click on a tag "Quản lý xe"
        const BusMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý xe')]")), 5000);
        await BusMng.click();

        const someElementOutsideSidebar = await driver.findElement(By.className('container-lg'));
        await driver.actions().move({origin: someElementOutsideSidebar}).perform();

        await driver.sleep(1000)

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const AddBus = async (driver, infor) => {
    try{
        //Click on button "Thêm "bus
        const addBusButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm bus')]")), 5000);
        await addBusButton.click();

        //Wait for modal-content to be visible
        const modalContent = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modalContent), 5000);
        await driver.sleep(1000)
        //Find input fields with id "name", "year" ,"color",  "cccd", "address"
        const licenseInput = await modalContent.findElement(By.id('license'));
        const yearInput = await modalContent.findElement(By.id('year'));
        const colorInput = modalContent.findElement(By.id('color'));

        //Clear old data for inputs fields
        let inputValue = await licenseInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await licenseInput.sendKeys(...backspaceSeries);

        inputValue = await yearInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await yearInput.sendKeys(...backspaceSeries);

        inputValue = await colorInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await colorInput.sendKeys(...backspaceSeries);

        //Enter new value for inputs fields
        await driver.wait(until.elementIsEnabled(licenseInput), 6000);
        await licenseInput.sendKeys(infor.license);

        await driver.wait(until.elementIsEnabled(yearInput), 6000);
        await yearInput.sendKeys(infor.year);

        await driver.wait(until.elementIsEnabled(colorInput), 6000);
        await colorInput.sendKeys(infor.color);

        //Choose select
        const select = await modalContent.findElement(By.id('busType2'));
        await select.click();
       
        await driver.sleep(2000)

        //Choose bus type option from select with value
        await driver.findElement(By.xpath(`//select[@id='busType2']//option[contains(text(), '${infor.busType}')]`)).click();

        //Click button "Thêm"
        const addButton = await modalContent.findElement(By.xpath("//button[contains(text(), 'Thêm') and @type = 'submit']"));
        await addButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Thêm bus thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}


const UpdateBus = async (driver, license, updateInfor) => {
    try {
        //Click on button "Xem chi tiết"
        const busButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(@class, 'accordion-button') and ./b[contains(text(), '${license}')]]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", busButton);
        await driver.wait(until.elementIsVisible(busButton), 5000);
        await driver.sleep(1000)
        await busButton.click();

        await driver.sleep(2000)

        //Click on button "Cập nhật"
        const updateButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Cập nhật thông tin')]`)), 5000);
        await updateButton.click();

        //Loop through element in updateInfor
        for (const [key, value] of Object.entries(updateInfor)) {
            if (key === 'busType'){
                await driver.findElement(By.xpath(`//select[@id="busType"]//option[contains(text(), '${value}')]`)).click();
            }
            else if (key === 'busState'){
                await driver.findElement(By.xpath(`//select[@id="busState"]//option[contains(text(), '${value}')]`)).click();
            }
            else{
                const input = await driver.wait(until.elementLocated(By.id(key)), 5000);
                let inputValue = await input.getAttribute('value');
                let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
                await input.sendKeys(...backspaceSeries);
                await input.sendKeys(value);
            }
        }
        // Click on the 'Cập nhật' button again
        await updateButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã cập nhật thành công');
    }
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const UpdateBusState = async (driver, license, updateInfor) => {
    try {
        //Click on button "Xem chi tiết"
        const busButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", busButton);
        await driver.wait(until.elementIsVisible(busButton), 5000);
        await driver.sleep(1000)
        await busButton.click();
        await driver.sleep(2000)

        //Click on tab "Tình trạng"
        await driver.findElement(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tình trạng xe')]`)).click();
        await driver.sleep(2000)

        //Click on button "Cập nhật"
        const updateButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']//div[contains(@class, 'react-tabs__tab-panel--selected')]//button[contains(text(), 'Cập nhật thông tin')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", updateButton);
        await driver.sleep(1000)
        await updateButton.click();

        //Loop through element in updateInfor
        for (const [key, value] of Object.entries(updateInfor)) {
            const input = await busButton.findElement(By.id(key));
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
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const AssignRouteBus = async (driver, license, route, subroute) => {
    try{
        
        //Click on button "Xem chi tiết"
        const busButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", busButton);
        await driver.wait(until.elementIsVisible(busButton), 5000);
        await driver.sleep(1000)
        await busButton.click();
        await driver.sleep(2000)

        //Click on tab "Tình trạng"
        await driver.findElement(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Hoạt động')]`)).click();
        await driver.sleep(2000)

        //Click on button "Phân tuyến"
        const assignButton = await busButton.findElement(By.xpath(`//button[contains(text(), 'Phân tuyến')]`));
        //Scroll into view
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", assignButton);
        await driver.sleep(1000)
        await assignButton.click();
        await driver.sleep(1000);

        //Select route
        await driver.sleep(1000)
        const routeButton =  await busButton.findElement(By.xpath(`//option[contains(text(), '${route}')]`));
        await routeButton.click();
        await driver.sleep(1000);

        //Click choose subroute
        const radioButton = await busButton.findElement(By.xpath(`//label[text()='${subroute}']/preceding-sibling::input[@type='radio']`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", radioButton );
        await driver.sleep(1000)
        await radioButton.click();

        //Click button "Lưu"
        const saveButton = await busButton.findElement(By.xpath(`//button[contains(text(), 'Lưu')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", saveButton);
        await driver.sleep(1000)
        await saveButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã phân tuyến cho bus');

        expect(true).toBe(true)
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally {
        await reset(driver)
    }
}

const DeleteAssignRouteBus = async (driver, license) => {
    try{
        //Click on button "Xem chi tiết"
        const busButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", busButton);
        await driver.wait(until.elementIsVisible(busButton), 5000);
        await driver.sleep(1000)
        await busButton.click();
        await driver.sleep(2000)

        //Click on tab "Tình trạng"
        await driver.findElement(By.xpath(`//div[contains(@class,'accordion-item') and @id = '${license}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Hoạt động')]`)).click();
        await driver.sleep(2000)

        //Click on button "Xóa phân công"
        const deleteButton = await busButton.findElement(By.xpath(`//button[contains(text(), 'Xóa phân công')]`));
        //Scroll into view
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", deleteButton);
        await driver.sleep(1000)
        await deleteButton.click();

        //Click button "Xác nhận"
        await driver.sleep(1000)
        const confirmButton = await busButton.findElement(By.xpath(`//button[contains(text(), 'Xác nhận')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", confirmButton);
        await driver.sleep(1000)
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')),5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã hủy phân tuyến cho bus');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }

}

describe('Bus management test', function () {
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

    const busInfor = {
        license: "79C-78978",
        year: "2020",
        color: "Vàng cam",
        busType: "Xe giường nằm 43 chỗ",
    }

    const updateInfor = {
        license: "80A-66874",
        color: "Vàng đất",
        busType: "Xe limousine 33 chỗ",
        busState: "Đang bảo trì",
    }

    const busState = {
        brake: 'Tạm ổn',
        lighting: 'Tốt',
        tire: 'Tốt',
        steering: 'Tốt',
        mirror: 'Tốt',
        airCondition: 'Tốt',
        electric: 'Tốt',
        fuel: 'Tốt',
        overallState: 'Đều tốt'
    }

    it('Thêm xe mới', async () => await AddBus(driver, busInfor));
    it('Cập nhật thông tin chi tiết xe', async () => await UpdateBus(driver, '79C-78978', updateInfor));
    it('Cập nhật trạng thái xe', async () => await UpdateBusState(driver, '84B_89100', busState));
    it('Phân công tuyến xe', async () => await AssignRouteBus(driver,'84B_89100', 'TP. Hồ Chí Minh - Nha Trang', 'BX Miền Đông Mới-BX Phía Nam Nha Trang' ))
    it('Xóa phân công chuyến xe', async () => await DeleteAssignRouteBus(driver, '84B_89100'));
});
