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

        //Hover on sidebar
        const sidebar = await driver.wait(until.elementLocated(By.css("[class*='sidebar']")), 5000);
        await driver.actions().move({ origin: sidebar }).perform();

        //Click on a tag "Tìm vé"
        const searchTicket = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Tìm vé')]")), 5000);
        await searchTicket.click();

    } catch (error) {
        console.error('An error occurred:', error); 
        throw error;
    }
}

const reset = async (driver) => {  
    try {
        driver.get('http://localhost:3001/#/search-ticket')
        await driver.navigate().refresh();
        await driver.sleep(500)
    }   
    catch (error) {
        console.log(error)
        throw (error)
    }
}


const SearchBookingValid = async (driver, tel) => {
    try{

        //type tel into input named "searchTicket"
        const searchTicketInput = await driver.wait(until.elementLocated(By.name("searchTicket")), 5000);
        let inputValue = await searchTicketInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await searchTicketInput.sendKeys(...backspaceSeries);
        await searchTicketInput.sendKeys(tel);

        //Click on button "Tìm vé"
        const searchTicketButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tìm vé')]")), 5000);
        await searchTicketButton.click();
        await driver.sleep(2000);

        //Select first button in ul tag with class "list-group"
        const firstBooking = await driver.wait(until.elementLocated(By.xpath("//ul[contains(@class, 'list-group')]/button[1]")), 5000);
        await firstBooking.click();
        await driver.sleep(2000);

        //Check if strong with text "Thông tin chi tiết" displayed
        const ticketDetail = await driver.wait(until.elementLocated(By.xpath("//strong[contains(text(), 'Thông tin chi tiết')]")), 5000);
        await driver.wait(until.elementIsVisible(ticketDetail), 5000);
        await driver.sleep(3000)
        expect(true).toBe(true);

    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver);
    }
}

const SearchBookingInValid = async (driver, tel) => {
    try{
        //type tel into input named "searchTicket"
        const searchTicketInput = await driver.wait(until.elementLocated(By.name("searchTicket")), 5000);
        let inputValue = await searchTicketInput.getAttribute('value');
        let backspaceSeries = Array(inputValue.length).fill(Key.BACK_SPACE);
        await searchTicketInput.sendKeys(...backspaceSeries);
        await searchTicketInput.sendKeys(tel);

        //Click on button "Tìm vé"
        const searchTicketButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Tìm vé')]")), 5000);
        await searchTicketButton.click();

        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 5000);
        // Wait for the login process to complete
        // Get the text of the first 'Toastify' element
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Không tìm thấy lượt đặt vé phù hợp');
        await driver.sleep(1000)
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver);
    }
}

const ShowTicketPosition = async (driver, tel, seat) => {
    try{
        await SearchBookingValid(driver, tel);

        await driver.sleep(1000)
        //Click on button "Xem vị trí"
        const xemViTriElement = await driver.wait(until.elementLocated(By.xpath(`//a[@id="${seat}"]`)), 5000);
        await driver.wait(until.elementIsVisible(xemViTriElement), 5000);
        await xemViTriElement.click();

        //Check if url contains "booking"
        let url = ""
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('booking');
          }, 10000);

        await driver.sleep(3000);

        //Check if seat is displayed
        const seatName = await driver.findElements(By.xpath(`//strong[contains(text(), '${seat}')]`))
        if (seatName.length > 0 && seatName[0].isDisplayed()) {
            expect(true).toBe(true);
        }
        else {
            expect(true).toBe(false);
        }
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await reset(driver);
    }
}

describe('Search tickets test', function () {
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
    it('Tìm kiếm vé theo số điện thoại hợp lệ', async () => await SearchBookingValid(driver, '0333843255'));
    it('Tìm kiếm vé theo số điện thoại không hợp lệ', async () => await SearchBookingInValid(driver, '0333843254'));
    // it('Hiển thị vị trí vé trong chuyến xe', async () => await ShowTicketPosition(driver, '09090909091', 'B20'));
});