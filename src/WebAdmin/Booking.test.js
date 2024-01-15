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
    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const SearchTrip = async (driver, departure, destination, departDate) => {
    try {

        await driver.navigate().refresh();

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(until.elementLocated(By.xpath("//label[text()='Điểm đi']/following-sibling::div")), 5000);
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label "TP. Hồ Chí Minh"
        const optionTpHCM = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'menu')]//div[contains(text(), '${departure}')]`)), 7000);
        await optionTpHCM.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(until.elementLocated(By.xpath("//label[text()='Điểm đến']/following-sibling::div")), 5000);
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label "Thành phố Trà Vinh"
        const optionTraVinh = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'menu')]//div[contains(text(), '${destination}')]`)), 7000);
        await optionTraVinh.click();

        // Step 5: Find and click on the element with className "_datePicker"
        const datePickerElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, 'datepicker')]")), 5000);
        await datePickerElement.click();

        // Step 6: Find the select-datepicker and choose tomorrow
        // Find the next sibling element
        // Define the date
        const formattedDate = convertDateFormat(departDate)
        const dateElement = await driver.wait(until.elementLocated(By.css(`[aria-label="Choose ${formattedDate}"]`)), 5000);
        await dateElement.click();

        // Step 7: Click the "Chọn chuyến xe" button
        const chonChuyenXeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tìm chuyến')]"));
        await chonChuyenXeButton.click();

        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        await driver.wait(until.stalenessOf(loadingElement), 5000);
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const BookingTicketDownFloor = async (driver, departure, destination, departDate, departTime, listSeat) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);
        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        // const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        // await driver.wait(until.stalenessOf(loadingElement), 5000);

        await driver.sleep(3000);

        //Choose Seat
        for (let i = 0; i < listSeat.length; i++) {
            const seatButton = await driver.findElement(By.xpath(`//strong[contains(text(), '${listSeat[i]}')]/following-sibling::button`));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", seatButton);
            await driver.sleep(1000);
            await driver.wait(until.elementIsVisible(seatButton), 5000);
            await seatButton.click();
        }

        //Click button "Đặt vé"
        const datVeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đặt vé')]"));
        await datVeButton.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);

        //Fill in name and telephone
        const nameInput = await driver.wait(until.elementLocated(By.name('name')), 5000);
        const telephoneInput = await driver.wait(until.elementLocated(By.name('tel')), 5000);
        await nameInput.sendKeys('Nguyen Van A');
        await telephoneInput.sendKeys('0123456789');

        //Click button "Đặt vé"
        const datVeButton2 = await modal.findElement(By.xpath("//div[contains(@class, 'modal-footer')]//button[contains(text(), 'Đặt vé')]"));
        await datVeButton2.click();

        //Verify message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        // Wait for the login process to complete
        // Get the text of the first 'Toastify' element
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đặt chỗ thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.sleep(3000)
    }
}

const BookingTicketUpFloor = async (driver, departure, destination, departDate, departTime, listSeat) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);
        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        // const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        // await driver.wait(until.stalenessOf(loadingElement), 5000);

        await driver.sleep(3000);

        await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();

        //Choose Seat
        for (let i = 0; i < listSeat.length; i++) {
            const seatButton = await driver.findElement(By.xpath(`//strong[contains(text(), '${listSeat[i]}')]/following-sibling::button`));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", seatButton);
            await driver.sleep(1000);
            await driver.wait(until.elementIsVisible(seatButton), 5000);
            await seatButton.click();
        }

        //Click button "Đặt vé"
        const datVeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đặt vé')]"));
        await datVeButton.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);

        //Fill in name and telephone
        const nameInput = await driver.wait(until.elementLocated(By.name('name')), 5000);
        const telephoneInput = await driver.wait(until.elementLocated(By.name('tel')), 5000);
        await nameInput.sendKeys('Nguyen Van A');
        await telephoneInput.sendKeys('0123456789');

        //Click button "Đặt vé"
        const datVeButton2 = await modal.findElement(By.xpath("//div[contains(@class, 'modal-footer')]//button[contains(text(), 'Đặt vé')]"));
        await datVeButton2.click();

        //Verify message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        // Wait for the login process to complete
        // Get the text of the first 'Toastify' element
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đặt chỗ thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.sleep(3000)
    }
}

describe('Booking tickets test', () => {
    jest.setTimeout(30000);
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
        await LoginSucessStaff(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Đặt vé tầng dưới', async () => {
        await BookingTicketDownFloor(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-20', '07:00' ,['A04', 'A05']);
    });

    it('Đặt vé tầng trên', async () => {
        await BookingTicketUpFloor(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-20', '07:00',['B03', 'B04']);
    });
});