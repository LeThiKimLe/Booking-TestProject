// Import necessary dependencies and test utilities
const { Builder, By, Key, until } = require('selenium-webdriver');

const reset = async (driver) => {  
    try {
        driver.get('http://localhost:3001/#/system-manage/routes')
        await driver.navigate().refresh();
        await driver.sleep(2000)
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
        const BusMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý tuyến xe')]")), 5000);
        await BusMng.click();

        const someElementOutsideSidebar = await driver.findElement(By.className('container-lg'));
        await driver.actions().move({origin: someElementOutsideSidebar}).perform();

        await driver.sleep(1000)

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const AddRoute = async (driver, infor) => {
    try{
        //Click on button "Thêm tuyến"
        const addBusButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm tuyến')]")), 5000);
        await addBusButton.click();

        //Get modal-content
        const modalContent = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'modal-content') and ./div[contains(@class, 'modal-header') and ./h5[contains(text(), 'Mở tuyến')]]]`)), 5000);
        await driver.wait(until.elementIsVisible(modalContent), 5000);
        await driver.sleep(1000)

        //Click choose Departure
        const selectDepart = await modalContent.findElement(By.xpath(`//select[@id="dep-select"]`));
        await selectDepart.click();
        await driver.sleep(1000)
        const departure = await modalContent.findElement(By.xpath(`//select[@id="dep-select"]//option[contains(text(),'${infor.departure}')]`));
        await departure.click();

        //Click choose Destination
        const selectDest = await modalContent.findElement(By.xpath(`//select[@id="des-select"]`));
        await driver.wait(until.elementIsEnabled(selectDest), 5000);
        await selectDest.click();
        await driver.sleep(1000)
        const destination = await selectDest.findElement(By.xpath(`//select[@id="des-select"]//option[contains(text(),'${infor.destination}')]`));
        await destination.click();

        //Click button "Xác minh thông tin"
        const confirmButton = await modalContent.findElement(By.xpath("//button[contains(text(), 'Xác minh thông tin')]"));
        await confirmButton.click();
        
        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 10000);
        await driver.wait(until.stalenessOf(loadingElement), 10000);

        //Fill in schedule and price input
        const scheduleInput = await modalContent.findElement(By.id('schedule'));
        //Clear old data for inputs fields
        let inputValue = await scheduleInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await scheduleInput.sendKeys(...backspaceSeries);
        await scheduleInput.sendKeys(infor.schedule);

        const priceInput = await modalContent.findElement(By.id('price'));
        inputValue = await priceInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await priceInput.sendKeys(...backspaceSeries);
        await priceInput.sendKeys(infor.price);

        //Choose bus type
        await modalContent.findElement(By.xpath(`//select[@id="bus-select"]//option[contains(text(), '${infor.busType}')]`)).click();

        if (infor.parentRoute)
        {
            const selectParents = await modalContent.findElement(By.xpath(`//select[@id="parent-select"]`));
            const parentsOption = await selectParents.findElement(By.xpath(`//option[contains(text(),'${infor.parentRoute}')]`));
            await parentsOption.click();
        }

        //Click button "Thêm tuyến"
        const addRouteButton = await modalContent.findElement(By.xpath(`//button[text()='Hủy']/preceding-sibling::button[text()='Thêm tuyến']`));
        await addRouteButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã thêm tuyến thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}


const UpdateRoute = async (driver, route, updateInfor) => {
    try {
        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on button "Cập nhật"
        const updateButton = await routeButton.findElement(By.xpath(`//div[@id='${route}']//button[contains(text(), 'Cập nhật thông tin')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", updateButton);
        await driver.sleep(1000)
        await updateButton.click();

        await driver.sleep(1000)

        //Loop through element in updateInfor
        for (const [key, value] of Object.entries(updateInfor)) {
            if (key === 'busType'){
                await driver.findElement(By.xpath(`//div[@id='${route}']//select[@id="bus-type-select"]`)).click();
                await driver.sleep(500)
                await driver.findElement(By.xpath(`//div[@id='${route}']//select[@id="bus-type-select"]//option[contains(text(), '${value}')]`)).click();
            }
            else if (key === 'parentRoute'){
                await driver.findElement(By.xpath(`//div[@id='${route}']//select[@id='parents-route-select']`)).click();
                await driver.sleep(500)
                await driver.findElement(By.xpath(`//div[@id='${route}']//select[@id="parents-route-select"]//option[contains(text(), '${value}')]`)).click();
            }
            else{
                const input = await routeButton.findElement(By.id(key));
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
        expect(toastifyText).toContain('Sửa thông tin tuyến thành công');
    }
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const CloseRoute = async (driver, route) => {
    try {
        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on button "Cập nhật"
        const updateButton = await routeButton.findElement(By.xpath(`//div[@id='${route}']//button[contains(text(), 'Đóng tuyến xe')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", updateButton);
        await driver.sleep(1000)
        await updateButton.click();
        await driver.sleep(1000)

        //Confirm close route
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Đóng') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();
        await driver.sleep(2000)
        expect(true).toBe(true)

    }
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const ReopenRoute = async (driver, route) => {
    try {
        //Choose radio "Ngưng hoạt động"
        const radio = await driver.findElement(By.xpath(`//label[text()='Ngưng hoạt động']/preceding-sibling::input[@type='radio']`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", radio);
        await driver.wait(until.elementIsVisible(radio), 5000);
        await radio.click();

        //Get item
        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on button "Mở tuyến xe"
        const updateButton = await routeButton.findElement(By.xpath(`//div[@id='${route}']//button[contains(text(), 'Mở lại tuyến xe')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", updateButton);
        await driver.sleep(1000)
        await updateButton.click();
        await driver.sleep(1000)

        //Confirm close route
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Mở') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();
        await driver.sleep(2000)
        expect(true).toBe(true)
        
    }
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}


const AddSubRoute = async (driver, route, start, end) => {
    try{
        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on tab "Tuyến nhỏ"
        await driver.findElement(By.xpath(`//div[@id = '${route}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Các tuyến nhỏ')]`)).click();
        await driver.sleep(2000)

        //Click on button "Thêm tuyến xe"
        const addSubRoute = await routeButton.findElement(By.xpath(`//button[contains(text(), 'Thêm tuyến xe')]`));
        //Scroll into view
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", addSubRoute);
        await driver.sleep(1000)
        await addSubRoute.click();
        await driver.sleep(1000);

        //Get modal-content
        const modalContent = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${route}']//div[contains(@class, 'card') and .//b[contains(text(), 'Thêm tuyến xe')]]`)), 5000);

        //Click choose StartStation
        const selectDepart = await modalContent.findElement(By.xpath(`//select[@id="start-select"]`));
        await selectDepart.click();
        await driver.sleep(1000)
        const departure = await modalContent.findElement(By.xpath(`//select[@id="start-select"]//option[contains(text(),'${start}')]`));
        await departure.click();

        //Click choose EndStation
        const selectDest = await modalContent.findElement(By.xpath(`//select[@id="end-select"]`));
        await driver.wait(until.elementIsEnabled(selectDest), 5000);
        await selectDest.click();
        await driver.sleep(1000)
        const destination = await modalContent.findElement(By.xpath(`//select[@id="end-select"]//option[contains(text(),'${end}')]`));
        await destination.click();

        //Click button "Lưu"
        const saveButton = await modalContent.findElement(By.xpath(`//button[contains(text(), 'Lưu')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", saveButton);
        await driver.sleep(1000)
        await saveButton.click();
        await driver.sleep(2000)
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

const AddPoint = async (driver, route, subRoute, point, type) => {
    try{
        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on tab "Tuyến nhỏ"
        await driver.findElement(By.xpath(`//div[@id = '${route}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Các tuyến nhỏ')]`)).click();
        await driver.sleep(2000)

        //Click choose subroute
        const selectSubRoute = await routeButton.findElement(By.xpath(`//div[@id='${subRoute}' and contains(@class, 'card')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectSubRoute);
        await driver.sleep(1000)
        await selectSubRoute.click();
        await driver.sleep(1000)

        //Get modal-content
        const modalContent = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${subRoute + ' detail'}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", modalContent);
        await driver.sleep(1000)

        if (type === 'pick')
        {
            //Click on button add pick point
            const addPickStation = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//button[@id='pick-add']`));
            await addPickStation.click();

            //Choose pick point
            const selectPickPoint = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//select[@id="pick-select"]`));
            await selectPickPoint.click();
            await driver.sleep(1000)
            const pick = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//select[@id="pick-select"]//option[contains(text(),'${point}')]`));
            await pick.click();
        }
        else{
            //Click on button add drop point
            const addDropStation = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//button[@id='drop-add']`));
            await addDropStation.click();

            //Choose drop point
            const selectDropPoint = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//select[@id="drop-select"]`));
            await selectDropPoint.click();
            await driver.sleep(1000)
            const drop = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//select[@id="drop-select"]//option[contains(text(),'${point}')]`));
            await drop.click();
        }

        //Click button "Lưu"
        const saveButton = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//button[contains(text(), 'Thêm') and contains(@class, 'btn-success')]`));
        await saveButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã thêm trạm thành công');
        
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally {
        await reset(driver)
    }
}

const CloseSubRoute = async (driver, route, subRoute) => {
    try{
        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on tab "Tuyến nhỏ"
        await driver.findElement(By.xpath(`//div[@id = '${route}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Các tuyến nhỏ')]`)).click();
        await driver.sleep(2000)

        //Click choose subroute
        const selectSubRoute = await routeButton.findElement(By.xpath(`//div[@id='${subRoute}' and contains(@class, 'card')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectSubRoute);
        await driver.sleep(1000)
        await selectSubRoute.click();
        await driver.sleep(1000)

        //Get modal-content
        const modalContent = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${subRoute + ' detail'}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", modalContent);
        await driver.sleep(1000)

        //Click button "Đóng tuyến xe"
        const closeButton = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//button[contains(text(), 'Đóng tuyến xe')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", closeButton);
        await driver.sleep(1000)
        await closeButton.click();

        //Confirm close route
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Đóng') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã đóng tuyến xe');

    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally {
        await reset(driver)
    }
}

const ReopenSubRoute = async (driver, route, subRoute) => {
    try{

        const routeButton = await driver.wait(until.elementLocated(By.xpath(`//div[@id='${route}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", routeButton);
        await driver.wait(until.elementIsVisible(routeButton), 5000);
        await driver.sleep(1000)
        await routeButton.click();
        await driver.sleep(2000)

        //Click on tab "Tuyến nhỏ"
        await driver.findElement(By.xpath(`//div[@id = '${route}']//li[contains(@class, 'react-tabs__tab') and contains(text(),'Các tuyến nhỏ')]`)).click();
        await driver.sleep(2000)

        //Choose radio "Ngưng hoạt động"
        const radio = await driver.findElement(By.xpath(`//div[@id = '${route}']//label[text()='Ngưng hoạt động']/preceding-sibling::input[@type='radio']`));
        await radio.click();

        //Click choose subroute
        const selectSubRoute = await routeButton.findElement(By.xpath(`//div[@id='${subRoute}' and contains(@class, 'card')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", selectSubRoute);
        await driver.sleep(1000)
        await selectSubRoute.click();
        await driver.sleep(1000)

        //Get modal-content
        const modalContent = await driver.wait(until.elementLocated(By.xpath(`//div[@id = '${subRoute + ' detail'}']`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", modalContent);
        await driver.sleep(1000)

        //Click button "Mở lại tuyến xe"
        const closeButton = await modalContent.findElement(By.xpath(`//div[@id = '${subRoute + ' detail'}']//button[contains(text(), 'Mở lại tuyến xe')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", closeButton);
        await driver.sleep(1000)
        await closeButton.click();

        //Confirm close route
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Mở') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã mở lại tuyến xe');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally {
        await reset(driver)
    }
}

describe('Route management test', function () {
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

    const newRouteData = {
        departure: "Cam Ranh City",
        destination: "Long An",
        schedule: "Cam Ranh -> HCM -> Vĩnh Long",
        price: "1000000",
        busType: "Xe limousine 33 chỗ",
    }

    const updateInfor = {
        distance: 145,
        hours: 2,
        minutes: 45,
        schedule: "Cam Ranh -> Bình Thuận -> HCM -> Vĩnh Long",
        price: 50000,
        busType: "Xe limousine 33 chỗ",
    }

    it('Thêm tuyến lớn mới', async () => await AddRoute(driver, newRouteData));
    it('Cập nhật thông tin tuyến lớn', async () => await UpdateRoute(driver, 'Cam Ranh City - Long An', updateInfor));
    it('Đóng tuyến lớn', async () => await CloseRoute(driver, 'Nha Trang - Long An'));
    it('Mở lại tuyến lớn', async () => await ReopenRoute(driver, 'Nha Trang - Long An'));

    it('Thêm tuyến nhỏ mới', async () => await AddSubRoute(driver, 'TP. Hồ Chí Minh - Bình Định', 'BX An Sương', 'VP An Nhơn'));
    it('Thêm điểm đón cho tuyến nhỏ', async () => await AddPoint(driver, 'TP. Hồ Chí Minh - Bình Định', 'BX An Sương - VP An Nhơn', 'VP Suối Linh', 'pick'));
    it('Thêm điểm trả cho tuyến nhỏ', async () => await AddPoint(driver, 'TP. Hồ Chí Minh - Bình Định', 'BX An Sương - VP An Nhơn', 'BX Phan Rang', 'drop'));

    it('Đóng tuyến nhỏ', async () => await CloseSubRoute(driver, 'TP. Hồ Chí Minh - Cam Ranh City', 'BX An Sương - BX Cam Ranh'));
    it('Mở lại tuyến nhỏ', async () => await ReopenSubRoute(driver, 'TP. Hồ Chí Minh - Cam Ranh City', 'BX An Sương - BX Cam Ranh'));

});