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
        driver.get('http://localhost:3001/#/employee-manage/staffs')
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
        const employeeMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý nhân sự')]")), 5000);
        await employeeMng.click();

        await driver.sleep(1000)

        //Click on a tag "Quản lý nhân viên"
        const staffMng = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Quản lý nhân viên')]")), 5000);
        await staffMng.click();

        const someElementOutsideSidebar = await driver.findElement(By.className('container-lg'));
        await driver.actions().move({origin: someElementOutsideSidebar}).perform();

        await driver.sleep(1000)

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const AddStaff = async (driver, infor) => {
    try{

        //Click on button "Thêm nhân viên"
        const addStaffButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm nhân viên')]")), 5000);
        await addStaffButton.click();

        //Wait for modal-content to be visible
        const modalContent = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modalContent), 5000);

        //Find input fields with id "name", "email" ,"tel",  "cccd", "address"
        const nameInput = await driver.wait(until.elementLocated(By.id('name')), 5000);
        const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
        const telInput = await driver.wait(until.elementLocated(By.id('tel')), 5000);
        const cccdInput = await driver.wait(until.elementLocated(By.id('cccd')), 5000);
        const addressInput = await driver.wait(until.elementLocated(By.id('address')), 5000);

        //Clear old data for inputs fields
        let inputValue = await nameInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await nameInput.sendKeys(...backspaceSeries);

        inputValue = await emailInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await emailInput.sendKeys(...backspaceSeries);

        inputValue = await telInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await telInput.sendKeys(...backspaceSeries);

        inputValue = await cccdInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await cccdInput.sendKeys(...backspaceSeries);

        inputValue = await addressInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await addressInput.sendKeys(...backspaceSeries);

        //Enter new value for inputs fields
        await driver.wait(until.elementIsEnabled(nameInput), 6000);
        await nameInput.sendKeys(infor.name);

        await driver.wait(until.elementIsEnabled(emailInput), 6000);
        await emailInput.sendKeys(infor.email);

        await driver.wait(until.elementIsEnabled(telInput), 6000);
        await telInput.sendKeys(infor.tel);

        await driver.wait(until.elementIsEnabled(cccdInput), 6000);
        await cccdInput.sendKeys(infor.cccd);

        await driver.wait(until.elementIsEnabled(addressInput), 6000);
        await addressInput.sendKeys(infor.address);

        //Choose gender option from select with value true
        await driver.findElement(By.xpath(`//option[contains(text(), '${infor.gender}')]`)).click();

        //Choose role option from select with value true
        await driver.findElement(By.xpath(`//option[contains(text(), '${infor.role}')]`)).click();
        
        //Choose begin work date
        const dateInput = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'datepicker')]//input")), 5000);
        inputValue = await dateInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await dateInput.sendKeys(...backspaceSeries);
        await dateInput.sendKeys(infor.beginWorkDate);

        //Click button "Thêm"
        const addButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm') and @type = 'submit']")), 5000);
        await addButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã thêm nhân viên thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }
}

const AddExistStaff = async (driver, infor) => {
    try{

        //Click on button "Thêm nhân viên"
        const addStaffButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm nhân viên')]")), 5000);
        await addStaffButton.click();

        //Wait for modal-content to be visible
        const modalContent = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modalContent), 5000);

        //Find input fields with id "name", "email" ,"tel",  "cccd", "address"
        const nameInput = await driver.wait(until.elementLocated(By.id('name')), 5000);
        const emailInput = await driver.wait(until.elementLocated(By.id('email')), 5000);
        const telInput = await driver.wait(until.elementLocated(By.id('tel')), 5000);
        const cccdInput = await driver.wait(until.elementLocated(By.id('cccd')), 5000);
        const addressInput = await driver.wait(until.elementLocated(By.id('address')), 5000);

        //Clear old data for inputs fields
        let inputValue = await nameInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await nameInput.sendKeys(...backspaceSeries);

        inputValue = await emailInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await emailInput.sendKeys(...backspaceSeries);

        inputValue = await telInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await telInput.sendKeys(...backspaceSeries);

        inputValue = await cccdInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await cccdInput.sendKeys(...backspaceSeries);

        inputValue = await addressInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await addressInput.sendKeys(...backspaceSeries);

        //Enter new value for inputs fields
        await driver.wait(until.elementIsEnabled(nameInput), 6000);
        await nameInput.sendKeys(infor.name);

        await driver.wait(until.elementIsEnabled(emailInput), 6000);
        await emailInput.sendKeys(infor.email);

        await driver.wait(until.elementIsEnabled(telInput), 6000);
        await telInput.sendKeys(infor.tel);

        await driver.wait(until.elementIsEnabled(cccdInput), 6000);
        await cccdInput.sendKeys(infor.cccd);

        await driver.wait(until.elementIsEnabled(addressInput), 6000);
        await addressInput.sendKeys(infor.address);

        //Choose gender option from select with value true
        await driver.findElement(By.xpath(`//option[contains(text(), '${infor.gender}')]`)).click();

        //Choose role option from select with value true
        await driver.findElement(By.xpath(`//option[contains(text(), '${infor.role}')]`)).click();
        
        //Choose begin work date
        const dateInput = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'datepicker')]//input")), 5000);
        inputValue = await dateInput.getAttribute('value');
        backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await dateInput.sendKeys(...backspaceSeries);
        await dateInput.sendKeys(infor.beginWorkDate);

        //Click button "Thêm"
        const addButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Thêm') and @type = 'submit']")), 5000);
        await addButton.click();

        //Check error message
        const errorMessage = await driver.wait(until.elementLocated(By.xpath("//div[contains(text(), 'Nhân viên đã tồn tại trong hệ thống')]")), 5000);
        expect(true).toBe(true)
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.wait(until.elementLocated(By.xpath("//h5[contains(text(), 'Thêm nhân viên')]/following-sibling::button")), 10000).click();
        await driver.sleep(3000);
        await reset(driver)
    }
}

const ViewDetail = async (driver, name) => {
    try{
        //Click on button "Xem chi tiết"
        const viewDetailButton = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${name}')]/following-sibling::td//a[contains(text(), 'Xem chi tiết')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", viewDetailButton);
        await driver.sleep(1000)
        await viewDetailButton.click();

        //Wait until url contain detail
        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('detail');
        }, 10000);

        //Get title page
        const title = await driver.wait(until.elementLocated(By.xpath(`//b[contains(text(), '${name}')]`)), 5000);
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

const UpdateStaff = async (driver, name, updateInfor) => {
    try {
        //Click on button "Xem chi tiết"
        const viewDetailButton = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${name}')]/following-sibling::td//a[contains(text(), 'Xem chi tiết')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", viewDetailButton);
        await driver.sleep(1000)
        await viewDetailButton.click();

        //Wait until url contain detail
        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('detail');
        }, 10000);

        //Click on button "Cập nhật"
        const updateButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Cập nhật thông tin')]`)), 5000);
        await updateButton.click();

        //Loop through element in updateInfor
        for (const [key, value] of Object.entries(updateInfor)) {
            if (key === 'gender'){
                await driver.findElement(By.xpath(`//option[contains(text(), '${value}')]`)).click();
            }
            else if (key === "beginWorkDate"){
                const dateInput = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'datepicker')]//input")), 5000);
                let inputValue = await dateInput.getAttribute('value');
                backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
                await dateInput.sendKeys(...backspaceSeries);
                await dateInput.sendKeys(updateInfor.beginWorkDate);
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

const CloseStaffAccount = async (driver, name) => {
    try {
        //Click on button "Xem chi tiết"
        const viewDetailButton = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${name}')]/following-sibling::td//a[contains(text(), 'Xem chi tiết')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", viewDetailButton);
        await driver.sleep(1000)
        await viewDetailButton.click();

        //Wait until url contain detail
        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('detail');
        }, 10000);

        //Click on button "Đóng tài khoản"
        const closeButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Đóng tài khoản')]`)), 5000);
        await closeButton.click();

        await driver.sleep(1000)
        //Confirm close account
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Đóng') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã đóng tài khoản');
    }
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }

}

const ReOpenStaffAccount = async (driver, name) => {
    try {
        //Click on button "Xem chi tiết"
        const viewDetailButton = await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${name}')]/following-sibling::td//a[contains(text(), 'Xem chi tiết')]`)), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", viewDetailButton);
        await driver.sleep(1000)
        await viewDetailButton.click();

        //Wait until url contain detail
        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('detail');
        }, 10000);

        //Click on button "Mở lại tài khoản"
        const closeButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Mở lại tài khoản')]`)), 5000);
        await closeButton.click();

        await driver.sleep(1000)
        //Confirm close account
        const confirmButton = await driver.wait(until.elementLocated(By.xpath(`//button[contains(text(), 'Mở') and contains(@class, 'btn-primary')]`)), 5000);
        await confirmButton.click();

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã mở lại tài khoản');
    }
    catch(error){
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver)
    }

}

describe('Staff management test', function () {
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

    const staffInfor = {
        name: "Lê Ngân Vang",
        email: "bell@gmail.com",
        tel: "0320022152",
        gender: "Nam",
        cccd: "342113490323",
        address: "Đình Phong Phú, Quận 9, Thành phố Hồ Chí Minh",
        beginWorkDate: "20/10/2023",
        role: "Nhân viên",
    }

    const adminInfor = {
        name: "Nguyễn Băng Băng",
        email: "bangbang@gmail.com",
        tel: "0478093042",
        gender: "Nam",
        cccd: "341290523411",
        address: "215, Đường 138, Quận 9, Thành phố Hồ Chí Minh",
        beginWorkDate: "09/02/2023",
        role: "Quản trị viên",
    }

    const updateInfor = {
        name: "Nguyễn Lê Kim Ngân",
        gender: "Nam",
        beginWorkDate: "07/07/2023",
    }

    it('Thêm nhân viên mới', async () => await AddStaff(driver, staffInfor));
    it('Thêm admin mới', async () => await AddStaff(driver, adminInfor));
    it('Kiểm tra nhân viên đã tồn tại trong hệ thống', async () => await AddExistStaff(driver, adminInfor));
    it('Xem thông tin chi tiết nhân viên', async () => await ViewDetail(driver, 'Nguyễn Lê Kim'));
    it('Cập nhật thông tin nhân viên', async () => await UpdateStaff(driver, 'Nguyễn Lê Kim', updateInfor));
    it('Đóng tài khoản nhân viên', async () => await CloseStaffAccount(driver, 'Nguyễn Nga'));
    it('Mở tài khoản nhân viên', async () => await ReOpenStaffAccount(driver, 'Nguyễn Nga'));
});