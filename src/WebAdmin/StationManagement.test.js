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
        driver.get('http://localhost:3001/#/system-manage/locations')
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

        //Click on a tag "Quản lý nhân sự"
        const employeeMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý hệ thống')]")), 5000);
        await employeeMng.click();

        await driver.sleep(1000)

        //Click on a tag "Quản lý nhân viên"
        const staffMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý trạm xe')]")), 5000);
        await staffMng.click();

        const someElementOutsideSidebar = await driver.findElement(By.className('container-lg'));
        await driver.actions().move({origin: someElementOutsideSidebar}).perform();

        await driver.sleep(3000)

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const AddLocation = async (driver, name) => {
    try{
        //Click button "Thêm trạm xe"
        const addLocationButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm trạm xe')]")), 5000);
        await addLocationButton.click();
        await driver.sleep(1000)

        //Find input 
        const input = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name = 'add-form']")), 5000);
        await input.sendKeys(name, Key.RETURN);

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Thêm trạm thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const EditLocation = async (driver, name, newName) => {
    try{
        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(name, Key.RETURN);
        await driver.sleep(1000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'row') and .//input[@value='${name}']]`)), 5000);
        const dropDown = editLocation.findElement(By.xpath("//div[contains(@class, 'btn-group')]"));
        await dropDown.click();
        await driver.sleep(500)
        const editBtn = editLocation.findElement(By.xpath("//a[contains(@class, 'dropdown-item') and contains(text(), 'Đổi tên')]"));
        await editBtn.click();

        //Find input
        const nameInput = await editLocation.findElement(By.xpath(`//input[@value = '${name}' and @name='location-name']`));
        //Clear old data for inputs fields
        let inputValue = await nameInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await nameInput.sendKeys(...backspaceSeries);
        //Enter new value for inputs fields
        await driver.wait(until.elementIsEnabled(nameInput), 6000);
        await nameInput.sendKeys(newName, Key.RETURN);

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Sửa tên thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const CloseLocation = async (driver, name) => {
    try{
        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(name, Key.RETURN);
        await driver.sleep(1000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'row') and .//input[@value='${name}']]`)), 5000);
        const dropDown = editLocation.findElement(By.xpath("//div[contains(@class, 'btn-group')]"));
        await dropDown.click();
        await driver.sleep(500)
        const editBtn = editLocation.findElement(By.xpath("//a[contains(@class, 'dropdown-item') and contains(text(), 'Xóa trạm')]"));
        await editBtn.click();
        await driver.sleep(1000)

        //Confirm close location
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Xóa') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Xóa trạm thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const ReopenLocation = async (driver, name) => {
    try{
        //Click on button "Đã đóng"
        const closedButton = await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'Đã đóng') and @role='button']")), 5000);
        await closedButton.click();
        await driver.sleep(1000);

        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(name, Key.RETURN);
        await driver.sleep(1000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'row') and .//input[@value='${name}']]`)), 5000);
        const dropDown = editLocation.findElement(By.xpath("//div[contains(@class, 'btn-group')]"));
        await dropDown.click();
        await driver.sleep(500)
        const editBtn = editLocation.findElement(By.xpath("//a[contains(@class, 'dropdown-item') and contains(text(), 'Mở trạm')]"));
        await editBtn.click();
        await driver.sleep(1000)

        //Confirm close location
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Mở') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Mở trạm thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }

}

const AddStation = async (driver, location, stationInfor) => {
    try{
        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(location, Key.RETURN);
        await driver.sleep(2000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'card col-3') and .//input[@value='${location}']]`)), 5000);
        const addButton = await editLocation.findElement(By.xpath("//button[@id='add-station']"));
        addButton.click();

        await driver.sleep(1000)
        // Find input has placeholder is "Nhập tên trạm đi"
        const nameStationInput = await editLocation.findElement(By.xpath("//input[@placeholder='Nhập tên trạm đi']"));
        await driver.wait(until.elementIsEnabled(nameStationInput), 6000);
        await nameStationInput.sendKeys(stationInfor.name);
        const addressStationInput = await editLocation.findElement(By.xpath("//textarea[@placeholder='Nhập địa chỉ']"));
        await driver.wait(until.elementIsEnabled(addressStationInput), 6000);
        await addressStationInput.sendKeys(stationInfor.address);

        //Click button "Load vị trí"
        const loadButton = await editLocation.findElement(By.xpath("//button[contains(text(), 'Load vị trí')]"));
        await loadButton.click();

        //Wait until button Save enabled
        const saveButton = await editLocation.findElement(By.xpath("//button[@id='save-station']"));
        await driver.wait(until.elementIsEnabled(saveButton), 6000);
        await saveButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Thêm trạm đi thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const EditStation = async (driver, location, stationName, stationInfor) => {
    try{
        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(location, Key.RETURN);
        await driver.sleep(2000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'card col-3') and .//input[@value='${location}']]`)), 5000);
        
        //Find input has value is stationName
        const stationInput = await editLocation.findElement(By.xpath(`//input[@value='${stationName}']`));
        await stationInput.click()
        await driver.sleep(2000)

        //Click update button
        const updateButton = await editLocation.findElement(By.xpath("//button[@id = 'update-station']"));
        await updateButton.click();
        await driver.sleep(2000)

        // Find input has placeholder is "Nhập tên trạm đi"
        const nameStationInput = await editLocation.findElement(By.xpath("//input[@id='station-name']"));
        await driver.wait(until.elementIsEnabled(nameStationInput), 6000);
        let inputValue = await nameStationInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await nameStationInput.sendKeys(...backspaceSeries);
        await nameStationInput.sendKeys(stationInfor.name);

        const addressStationInput = await editLocation.findElement(By.xpath("//textarea[@id='station-address']"));
        await driver.wait(until.elementIsEnabled(addressStationInput), 6000);
        inputValue = await addressStationInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await addressStationInput.sendKeys(...backspaceSeries);
        await addressStationInput.sendKeys(stationInfor.address);

        //Click button "Load vị trí"
        const loadButton = await editLocation.findElement(By.xpath("//button[contains(text(), 'Load vị trí')]"));
        await loadButton.click();

        //Wait until tag i "Xem vị trí" appear
        const viewButton = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Xem vị trí')]")), 5000);
        await driver.wait(until.elementIsVisible(viewButton), 6000);

        //Wait until button Save enabled
        await updateButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Sửa thông tin thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const CloseStation = async (driver, location, station) => {
    try{
        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(location, Key.RETURN);
        await driver.sleep(2000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@id, "station-header")]`)), 5000);
            
        //Find input has value is stationName
        const stationInput = await editLocation.findElement(By.xpath(`//input[@value='${station}']`));
        // Create an Actions instance
        const actions = driver.actions({bridge: true});
        // Move the mouse over the element
        await actions.move({origin: stationInput}).perform();

        //Find close button
        const closeButton = await driver.wait(until.elementLocated(By.xpath("//button[@id = 'station-close']")), 5000);
        await closeButton.click();

        await driver.sleep(1000)

        //Confirm close location
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Xóa') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã đóng trạm thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const ReopenStation = async (driver, location, station) => {
    try{
        //Search for location
        const searchInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Nhập tên trạm' and @name='station name']")), 5000);
        await searchInput.sendKeys(location, Key.RETURN);
        await driver.sleep(1000)
        const editLocation = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class, 'row') and .//input[@value='${location}']]`)), 5000);
        const dropDown = editLocation.findElement(By.xpath("//div[contains(@class, 'btn-group')]"));
        await dropDown.click();
        await driver.sleep(500)
        const editBtn = editLocation.findElement(By.xpath("//a[contains(@class, 'dropdown-item') and contains(text(), 'Hiện trạm đi đã đóng')]"));
        await editBtn.click();
        await driver.sleep(1000)

        //Find input has value is stationName
        const stationInput = await editLocation.findElement(By.xpath(`//input[@value='${station}']`));
        // Create an Actions instance
        const actions = driver.actions({bridge: true});
        // Move the mouse over the element
        await actions.move({origin: stationInput}).perform();

        //Find close button
        const reopenButton = await driver.wait(until.elementLocated(By.xpath("//button[@id = 'station-open']")), 5000);
        await reopenButton.click();

        //Confirm open location
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Mở trạm') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 7000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã mở trạm đi thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }

}


describe('Station management test', function () {
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

    it('Thêm trạm lớn', async () => await AddLocation(driver, "Quảng Trị"));
    it('Sửa tên trạm lớn', async () => await EditLocation(driver, "Quảng Nam", "Tỉnh Quảng Trị"));
    it('Xóa trạm lớn', async () => await CloseLocation(driver, "Tỉnh Quảng Trị"));
    it('Mở lại trạm lớn', async () => await ReopenLocation(driver, "Tỉnh Quảng Trị"));

    it('Thêm trạm nhỏ', async () => await AddStation(driver, "Tỉnh Quảng Trị", {
        name: "Thành cổ Quảng Trị",
        address: "Tỉnh Quảng Trị"
    } ));

    it('Sửa thông tin trạm nhỏ', async () => await EditStation(driver, "Tỉnh Quảng Nam", "Phố cổ Hội An", {
        name: 'Tiệm cao lầu Hội An',
        address: 'Hội An, Quảng Nam'
    }));
    it('Đóng trạm nhỏ', async () => await CloseStation(driver, "Quảng Ninh" ,"Bãi đá Quãng Ninh"));
    it('Mở lại trạm nhỏ', async () => await ReopenStation(driver, "Quảng Ninh" ,"Bãi đá Quãng Ninh"));
});