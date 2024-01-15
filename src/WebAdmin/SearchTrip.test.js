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

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(until.elementLocated(By.xpath("//label[text()='Điểm đi']/following-sibling::div")), 5000);
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label "TP. Hồ Chí Minh"
        const optionTpHCM = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${departure}')]`)), 7000);
        await optionTpHCM.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(until.elementLocated(By.xpath("//label[text()='Điểm đến']/following-sibling::div")), 5000);
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label "Thành phố Trà Vinh"
        const optionTraVinh = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${destination}')]`)), 7000);
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
        expect(true).toBe(true);
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Search trips test', function () {
    jest.setTimeout(30000);
    let driver;
    
    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
        await LoginSucessStaff(driver);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Tìm chuyến xe chiều đi', async () => await SearchTrip(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-16'));
    it('Tìm chuyến xe chiều về', async () => await SearchTrip(driver, 'Thành phố Trà Vinh', 'TP. Hồ Chí Minh', '2024-01-16'));
});