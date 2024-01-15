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
        // Reload the current page
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

const ChangeTicketSameTrip = async (driver, departure, destination, departDate, departTime, seat, listOldSeat, listNewSeat) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);

        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        await driver.wait(until.stalenessOf(loadingElement), 5000);

        if (seat.includes('B')) {
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();
        }
        const editBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${seat}')]]]//button[contains(@class, 'btn-outline-success')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", editBtn);
        await driver.sleep(2000);
        await driver.wait(until.elementIsVisible(editBtn), 5000);
        await editBtn.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);
        await driver.sleep(1000);

        //Choose tab "Tác vụ vé"
        const tabThanhToan = await modal.findElement(By.xpath("//li[contains(@class, 'react-tabs__tab') and .//strong[contains(text(),'Tác vụ vé')]]"));
        await tabThanhToan.click();
        await driver.sleep(1000);

        //Choose list input type checkbox
        for (let i=0; i< listOldSeat.length; i++) {
            const checkbox = await modal.findElement(By.xpath(`//input[@type='checkbox' and following-sibling::label[text()='${listOldSeat[i]}']]`));
            await driver.sleep(500)
            await checkbox.click();
        }

        //Click button "Đổi vé"
        const doiVeButton = await modal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        await driver.wait(until.elementIsEnabled(doiVeButton), 5000);
        await doiVeButton.click();


        //Wait for modal "Đổi vé" appear
        const changeModal = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'card-header') and .//strong[contains(text(),'Đổi vé')]]")), 5000);
        await driver.sleep(1000);

        //Minimize modal
        // const minimizeModal = await driver.wait(driver.elementLocated(By.xpath("//button[contains(text(), 'Đổi vé')]/following-sibling::svg")), 5000);
        // await minimizeModal.click();

        //Choose seat
        for (let i=0; i< listNewSeat.length; i++) {
            const selectedTab = driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab--selected')]")), 5000);
            if (listNewSeat[i].includes('B') && selectedTab.getText() === 'Tầng dưới') {
                const active = await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000));
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", active);
                await driver.sleep(500);
                await active.click();
            }
            else if (listNewSeat[i].includes('A') && selectedTab.getText() === 'Tầng trên'){
                const active = await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng dưới')]"), 5000));
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", active);
                await driver.sleep(500);
                await active.click();
            }
            await driver.sleep(500);
            const chooseBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${listNewSeat[i]}')]]]//button[contains(@class, 'btn-outline-warning')]`));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", chooseBtn);
            await driver.sleep(500);
            await driver.wait(until.elementIsVisible(chooseBtn), 5000);
            await chooseBtn.click();
        }

        //Click button "Đổi vé"
        const changeBtn = await changeModal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        await driver.wait(until.elementIsEnabled(changeBtn), 5000);
        await changeBtn.click();

        await driver.sleep(2000);

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 10000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã đổi vé thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.sleep(2000)
    }
}

const ChangeTicketDiffentTrip = async (driver, departure, destination, departDate, departTime, seat, listOldSeat, listNewSeat, newTripTime) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);

        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        await driver.wait(until.stalenessOf(loadingElement), 5000);

        if (seat.includes('B')) {
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();
        }
        const editBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${seat}')]]]//button[contains(@class, 'btn-outline-success')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", editBtn);
        await driver.sleep(2000);
        await driver.wait(until.elementIsVisible(editBtn), 5000);
        await editBtn.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);
        await driver.sleep(1000);

        //Choose tab "Tác vụ vé"
        const tabThanhToan = await modal.findElement(By.xpath("//li[contains(@class, 'react-tabs__tab') and .//strong[contains(text(),'Tác vụ vé')]]"));
        await tabThanhToan.click();
        await driver.sleep(1000);

        //Choose list input type checkbox
        for (let i=0; i< listOldSeat.length; i++) {
            const checkbox = await modal.findElement(By.xpath(`//input[@type='checkbox' and following-sibling::label[text()='${listOldSeat[i]}']]`));
            await driver.sleep(500)
            await checkbox.click();
        }

        //Click button "Đổi vé"
        const doiVeButton = await modal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        await driver.wait(until.elementIsEnabled(doiVeButton), 5000);
        await doiVeButton.click();


        //Wait for modal "Đổi vé" appear
        const changeModal = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'card-header') and .//strong[contains(text(),'Đổi vé')]]")), 5000);
        await driver.sleep(1000);

        //Minimize modal
        // const minimizeModal = await driver.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]/following-sibling::svg"));
        // await minimizeModal.click();

        //Choose diffent trip
        //scroll to head of page
        await driver.executeScript("window.scrollTo(0, 0)");
        await driver.sleep(1000);
        const newTrip = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${newTripTime}')]]`));
        await newTrip.click();
        await driver.sleep(4000);

        //Choose seat
        for (let i=0; i< listNewSeat.length; i++) {
            if (listNewSeat[i].includes('B')) {
                const active = await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000));
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", active);
                await driver.sleep(500);
                await active.click();
            }
            else {
                const active = await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng dưới')]"), 5000));
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", active);
                await driver.sleep(500);
                await active.click();
            }
            await driver.sleep(500);
            const chooseBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${listNewSeat[i]}')]]]//button[contains(@class, 'btn-outline-warning')]`));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", chooseBtn);
            await driver.sleep(500);
            await driver.wait(until.elementIsVisible(chooseBtn), 5000);
            await chooseBtn.click();
        }

        //Click button "Đổi vé"
        const changeBtn = await changeModal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        await driver.wait(until.elementIsEnabled(changeBtn), 5000);
        await changeBtn.click();

        await driver.sleep(2000);

        //Check success message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 10000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();
        expect(toastifyText).toContain('Đã đổi vé thành công');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.sleep(2000)
    }
}

const BookingNotMeetCancelPolicy = async (driver, departure, destination, departDate, departTime, seat) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);

        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        // const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        // await driver.wait(until.stalenessOf(loadingElement), 5000);
        await driver.sleep(2000)

        if (seat.includes('B')) {
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();
        }
        const editBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${seat}')]]]//button[contains(@class, 'btn-outline-success')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", editBtn);
        await driver.sleep(2000);
        await driver.wait(until.elementIsVisible(editBtn), 5000);
        await editBtn.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);
        await driver.sleep(1000);

        //Choose tab "Tác vụ vé"
        const tabThanhToan = await modal.findElement(By.xpath("//li[contains(@class, 'react-tabs__tab') and .//strong[contains(text(),'Tác vụ vé')]]"));
        await tabThanhToan.click();
        await driver.sleep(2000);

        //Choose first input type checkbox
        const checkbox = await modal.findElement(By.xpath("//input[contains(@type, 'checkbox')]"));
        await checkbox.click();

        await driver.sleep(1000);
        //Click button "Hủy vé"
        const doiVeButton = await modal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        const isEnabled = await doiVeButton.isEnabled();
        if (isEnabled) {
            expect(false).toBe(true)
        } else {
            expect(true).toBe(true)
        }
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const CancelChangeTicket = async (driver, departure, destination, departDate, departTime, seat, listOldSeat) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);

        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        await driver.wait(until.stalenessOf(loadingElement), 5000);

        if (seat.includes('B')) {
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();
        }
        const editBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${seat}')]]]//button[contains(@class, 'btn-outline-success')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", editBtn);
        await driver.sleep(2000);
        await driver.wait(until.elementIsVisible(editBtn), 5000);
        await editBtn.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);
        await driver.sleep(1000);

        //Choose tab "Tác vụ vé"
        const tabThanhToan = await modal.findElement(By.xpath("//li[contains(@class, 'react-tabs__tab') and .//strong[contains(text(),'Tác vụ vé')]]"));
        await tabThanhToan.click();
        await driver.sleep(1000);

        //Choose list input type checkbox
        for (let i=0; i< listOldSeat.length; i++) {
            const checkbox = await modal.findElement(By.xpath(`//input[@type='checkbox' and following-sibling::label[text()='${listOldSeat[i]}']]`));
            await driver.sleep(500)
            await checkbox.click();
        }

        //Click button "Đổi vé"
        const doiVeButton = await modal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        await driver.wait(until.elementIsEnabled(doiVeButton), 5000);
        await doiVeButton.click();

        //Wait for modal "Đổi vé" appear
        const changeModal = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'card-header') and .//strong[contains(text(),'Đổi vé')]]")), 5000);
        await driver.sleep(1000);

        //Click button "Hủy"
        const changeBtn = await changeModal.findElement(By.xpath("//button[contains(text(), 'Hủy')]"));
        await driver.wait(until.elementIsEnabled(changeBtn), 5000);
        await changeBtn.click();

        await driver.sleep(500);

        //Check modal exist
        // Check if the changeModal still exists
        const changeModals = await driver.findElements(By.xpath("//div[contains(@class,'card-header') and .//strong[contains(text(),'Đổi vé')]]"));
        if (changeModals.length > 0) {
            expect(false).toBe(true)
        } else {
            expect(true).toBe(true)
        }
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.sleep(2000)
    }
}

const ChooseOverSeatNeeded = async (driver, departure, destination, departDate, departTime, seat, listOldSeat, listNewSeat) => {
    try{
        await SearchTrip(driver, departure, destination, departDate);

        //Choose Trip
        const chooseTripButton = await driver.findElement(By.xpath(`//div[h5[contains(text(), '${departTime}')]]`));
        await chooseTripButton.click();

        //Wait to load data
        const loadingElement = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'spinner-border')]")), 5000);
        await driver.wait(until.stalenessOf(loadingElement), 5000);

        if (seat.includes('B')) {
            await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000)).click();
        }
        const editBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${seat}')]]]//button[contains(@class, 'btn-outline-success')]`));
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", editBtn);
        await driver.sleep(2000);
        await driver.wait(until.elementIsVisible(editBtn), 5000);
        await editBtn.click();

        //Get modal
        const modal = await driver.wait(until.elementLocated(By.className('modal-content')), 5000);
        await driver.wait(until.elementIsVisible(modal), 5000);
        await driver.sleep(1000);

        //Choose tab "Tác vụ vé"
        const tabThanhToan = await modal.findElement(By.xpath("//li[contains(@class, 'react-tabs__tab') and .//strong[contains(text(),'Tác vụ vé')]]"));
        await tabThanhToan.click();
        await driver.sleep(1000);

        //Choose list input type checkbox
        for (let i=0; i< listOldSeat.length; i++) {
            const checkbox = await modal.findElement(By.xpath(`//input[@type='checkbox' and following-sibling::label[text()='${listOldSeat[i]}']]`));
            await driver.sleep(500)
            await checkbox.click();
        }

        //Click button "Đổi vé"
        const doiVeButton = await modal.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]"));
        await driver.wait(until.elementIsEnabled(doiVeButton), 5000);
        await doiVeButton.click();


        //Wait for modal "Đổi vé" appear
        const changeModal = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'card-header') and .//strong[contains(text(),'Đổi vé')]]")), 5000);
        await driver.sleep(1000);

        //Minimize modal
        // const minimizeModal = await driver.findElement(By.xpath("//button[contains(text(), 'Đổi vé')]/following-sibling::svg"));
        // await minimizeModal.click();

        //Choose seat
        for (let i=0; i< listOldSeat.length + 1; i++) {
            const selectedTab = driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab--selected')]")), 5000);
            if (listNewSeat[i].includes('B') && selectedTab.getText() === 'Tầng dưới') {
                const active = await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng trên')]"), 5000));
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", active);
                await driver.sleep(500);
                await active.click();
            }
            else if (listNewSeat[i].includes('A') && selectedTab.getText() === 'Tầng trên'){
                const active = await driver.wait(until.elementLocated(By.xpath("//li[contains(@class, 'react-tabs__tab') and contains(text(),'Tầng dưới')]"), 5000));
                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", active);
                await driver.sleep(500);
                await active.click();
            }
            await driver.sleep(500);
            const chooseBtn = await driver.findElement(By.xpath(`//div[contains(@class, 'card ') and .//div[contains(@class, 'card-header') and .//strong[contains(text(), '${listNewSeat[i]}')]]]//button[contains(@class, 'btn-outline-warning')]`));
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", chooseBtn);
            await driver.sleep(500);
            await driver.wait(until.elementIsVisible(chooseBtn), 5000);
            await chooseBtn.click();
        }

        //Check error message
        const elements = await driver.wait(until.elementLocated(By.className('toast-body')), 10000);
        await driver.wait(until.elementIsVisible(elements), 5000);
        const toastifyText = await elements.getText();

        //Close change form
        const cancelBtn = await changeModal.findElement(By.xpath("//button[contains(text(), 'Hủy')]"));
        await driver.wait(until.elementIsEnabled(cancelBtn), 5000);
        await cancelBtn.click();

        expect(toastifyText).toContain('Chỉ chọn đủ số vé cần đổi');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
    finally{
        await driver.sleep(2000)
    }
}

describe('Change tickets test', () => {
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

    it('Đổi vé cùng chuyến', async () => {
        await ChangeTicketSameTrip(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-22', '07:00' ,'A01',['A01', 'A02'], ['A04', 'A05']);
    });

    it('Đổi vé khác chuyến', async () => {
        await ChangeTicketDiffentTrip(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-22', '07:00','A08',['A08', 'A09'], ['B01', 'B02'], '09:00');
    });

    it('Vé không thỏa điều kiện đổi vé', async () => {
        await BookingNotMeetCancelPolicy(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-22', '07:00', 'A17');
    });

    it('Hủy thao tác đổi vé', async () => {
        await CancelChangeTicket(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-22', '07:00','A16',['A16']);
    });

    it('Chọn số vé mới nhiều hơn số vé cần đổi', async () => {
        await ChooseOverSeatNeeded(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-22', '07:00','A16',['A16'], ['A13', 'A14'] );
    });
});