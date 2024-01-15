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

const ValidPaymentGuest = async (driver, departure, destination, departDate, listSeat) => {
    try {
        // Access the URL
        await driver.get('http://localhost:3000/');

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'selectArea')]/div[text()='Điểm đi']/following-sibling::div[1]")), 5000);
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label "TP. Hồ Chí Minh"
        const optionTpHCM = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${departure}')]`)), 7000);
        await optionTpHCM.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'selectArea')]/div[text()='Điểm đến']/following-sibling::div[1]")), 5000);
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label "Thành phố Trà Vinh"
        const optionTraVinh = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${destination}')]`)), 7000);
        await optionTraVinh.click();

        // Step 5: Find and click on the element with className "_datePicker"
        const datePickerElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, '_datePicker')]")), 5000);
        await datePickerElement.click();

        // Step 6: Find the select-datepicker and choose tomorrow
        // Find the next sibling element
        // Define the date
        const formattedDate = convertDateFormat(departDate)
        const dateElement = await driver.wait(until.elementLocated(By.css(`[aria-label="Choose ${formattedDate}"]`)), 5000);
        await dateElement.click();

        // Step 7: Click the "Chọn chuyến xe" button
        const chonChuyenXeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tìm chuyến xe')]"));
        await chonChuyenXeButton.click();

        const loadingElement = await driver.findElement(By.xpath("//div[contains(@class, 'loading-container')]"));
        await driver.wait(until.stalenessOf(loadingElement), 7000);

        //Step 8: Click button "Chọn chuyến"
        const selectTrip = await driver.wait(until.elementLocated(By.xpath("//button[text()='Chọn chuyến']")), 5000);
        await selectTrip.click();

        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url.includes('/trip/');
        }, 5000);

        await driver.executeScript("window.scrollTo(0, 0);");

        await driver.wait(async () => {
            const scrollTop = await driver.executeScript("return document.documentElement.scrollTop;");
            return scrollTop === 0;
        }, 5000);

        //Step 9: Choose seat
        for (const seat of listSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
        }

        //Step 10: Fill in data
        // const inforBox = await driver.findElement(By.xpath("//div[contains(@class, 'user_infor_container')]"))
        // await driver.executeScript("arguments[0].scrollIntoView(true);", inforBox);
        await driver.findElement(By.name('name')).sendKeys('Kim Nguyễn');
        await driver.findElement(By.name('tel')).sendKeys('0333843252');
        await driver.findElement(By.name('email')).sendKeys('kimme@gmail.com');
        // Find the checkbox and check it
        // Find the checkbox
        const checkbox = await driver.findElement(By.xpath("//div[contains(@class, 'infor_confirm')]/input[@type='checkbox']"));
       
        //Step 11: Click "Thanh toán"
        // Scroll to the bottom of the page
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

        // Wait until the page has scrolled to the bottom
        await driver.wait(async () => {
            const scrollTop = await driver.executeScript("return document.documentElement.scrollTop;");
            const scrollHeight = await driver.executeScript("return document.documentElement.scrollHeight;");
            const clientHeight = await driver.executeScript("return document.documentElement.clientHeight;");
            return scrollTop + clientHeight >= scrollHeight;
        }, 5000);

         // Wait for the checkbox to be visible
         await driver.wait(until.elementIsVisible(checkbox), 5000);

        // Check the checkbox
        await checkbox.click();

        const paymentButton = await driver.findElement(By.xpath("//button[contains(text(), 'Thanh toán')]"));
        await paymentButton.click();

        let url
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('/payment');
        }, 5000);

        const confirmPaymentBtn = await driver.wait(until.elementLocated(By.xpath("//button[(text()='Thanh toán')]")), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", confirmPaymentBtn);
        await driver.wait(until.elementIsEnabled(confirmPaymentBtn), 10000);
        await driver.sleep(2000); // Wait for 2 seconds
        await confirmPaymentBtn.click();
        const toastMessage = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'dialog_title')]/h2[contains(text(), 'Thanh toán vé thành công')]")), 10000);
        await driver.wait(until.elementIsVisible(toastMessage), 10000);
        expect(true).toBeTruthy();
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const ValidPaymentUser = async (driver, departure, destination, departDate, listSeat) => {
    try {
        // Login user account
        // Navigate to the login page
        await driver.get('http://localhost:3000/login');

        // Find the username and password input fields
        const usernameInput = await driver.findElement(By.name('username'));
        const passwordInput = await driver.findElement(By.name('password'));
        let initialUrl = await driver.getCurrentUrl();
        // Enter the username and password
        await usernameInput.sendKeys('0333843255');
        await passwordInput.sendKeys('1234567', Key.RETURN);

        // Wait for the login process to complete
        const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Đăng nhập')]"));
        await loginButton.click();
        
        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url !== initialUrl;
            }, 5000);

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'selectArea')]/div[text()='Điểm đi']/following-sibling::div[1]")), 5000);
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label "TP. Hồ Chí Minh"
        const optionTpHCM = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${departure}')]`)), 7000);
        await optionTpHCM.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'selectArea')]/div[text()='Điểm đến']/following-sibling::div[1]")), 5000);
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label "Thành phố Trà Vinh"
        const optionTraVinh = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${destination}')]`)), 7000);
        await optionTraVinh.click();

        // Step 5: Find and click on the element with className "_datePicker"
        const datePickerElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, '_datePicker')]")), 5000);
        await datePickerElement.click();

        // Step 6: Find the select-datepicker and choose tomorrow
        // Find the next sibling element
        // Define the date
        const formattedDate = convertDateFormat(departDate)
        const dateElement = await driver.wait(until.elementLocated(By.css(`[aria-label="Choose ${formattedDate}"]`)), 5000);
        await dateElement.click();

        // Step 7: Click the "Chọn chuyến xe" button
        const chonChuyenXeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tìm chuyến xe')]"));
        await chonChuyenXeButton.click();

        const loadingElement = await driver.findElement(By.xpath("//div[contains(@class, 'loading-container')]"));
        await driver.wait(until.stalenessOf(loadingElement), 7000);

        //Step 8: Click button "Chọn chuyến"
        const selectTrip = await driver.wait(until.elementLocated(By.xpath("//button[text()='Chọn chuyến']")), 5000);
        await selectTrip.click();

        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url.includes('/trip/');
        }, 5000);

        await driver.executeScript("window.scrollTo(0, 0);");

        await driver.wait(async () => {
            const scrollTop = await driver.executeScript("return document.documentElement.scrollTop;");
            return scrollTop === 0;
        }, 5000);

        //Step 9: Choose seat
        for (const seat of listSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
        }

        // Find the checkbox
        const checkbox = await driver.findElement(By.xpath("//div[contains(@class, 'infor_confirm')]/input[@type='checkbox']"));
       
        //Step 11: Click "Thanh toán"
        // Scroll to the bottom of the page
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

        // Wait until the page has scrolled to the bottom
        await driver.wait(async () => {
            const scrollTop = await driver.executeScript("return document.documentElement.scrollTop;");
            const scrollHeight = await driver.executeScript("return document.documentElement.scrollHeight;");
            const clientHeight = await driver.executeScript("return document.documentElement.clientHeight;");
            return scrollTop + clientHeight >= scrollHeight;
        }, 5000);

         // Wait for the checkbox to be visible
         await driver.wait(until.elementIsVisible(checkbox), 5000);

        // Check the checkbox
        await checkbox.click();

        const paymentButton = await driver.findElement(By.xpath("//button[contains(text(), 'Thanh toán')]"));
        await paymentButton.click();

        let url
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('/payment');
        }, 5000);

        const confirmPaymentBtn = await driver.wait(until.elementLocated(By.xpath("//button[(text()='Thanh toán')]")), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(true);", confirmPaymentBtn);
        await driver.wait(until.elementIsEnabled(confirmPaymentBtn), 10000);
        await driver.sleep(2000); // Wait for 2 seconds
        await confirmPaymentBtn.click();
        const toastMessage = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'dialog_title')]/h2[contains(text(), 'Thanh toán vé thành công')]")), 10000);
        await driver.wait(until.elementIsVisible(toastMessage), 10000);
        expect(true).toBeTruthy();
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const ExitPaymentSession = async (driver, departure, destination, departDate, listSeat) => {
    try {
        // Access the URL
        await driver.get('http://localhost:3000/');

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'selectArea')]/div[text()='Điểm đi']/following-sibling::div[1]")), 5000);
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label "TP. Hồ Chí Minh"
        const optionTpHCM = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${departure}')]`)), 7000);
        await optionTpHCM.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'selectArea')]/div[text()='Điểm đến']/following-sibling::div[1]")), 5000);
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label "Thành phố Trà Vinh"
        const optionTraVinh = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${destination}')]`)), 7000);
        await optionTraVinh.click();

        // Step 5: Find and click on the element with className "_datePicker"
        const datePickerElement = await driver.wait(until.elementLocated(By.xpath("//*[contains(@class, '_datePicker')]")), 5000);
        await datePickerElement.click();

        // Step 6: Find the select-datepicker and choose tomorrow
        // Find the next sibling element
        // Define the date
        const formattedDate = convertDateFormat(departDate)
        const dateElement = await driver.wait(until.elementLocated(By.css(`[aria-label="Choose ${formattedDate}"]`)), 5000);
        await dateElement.click();

        // Step 7: Click the "Chọn chuyến xe" button
        const chonChuyenXeButton = await driver.findElement(By.xpath("//button[contains(text(), 'Tìm chuyến xe')]"));
        await chonChuyenXeButton.click();

        const loadingElement = await driver.findElement(By.xpath("//div[contains(@class, 'loading-container')]"));
        await driver.wait(until.stalenessOf(loadingElement), 7000);

        //Step 8: Click button "Chọn chuyến"
        const selectTrip = await driver.wait(until.elementLocated(By.xpath("//button[text()='Chọn chuyến']")), 5000);
        await selectTrip.click();

        await driver.wait(async () => {
            let url = await driver.getCurrentUrl();
            return url.includes('/trip/');
        }, 5000);

        await driver.executeScript("window.scrollTo(0, 0);");

        await driver.wait(async () => {
            const scrollTop = await driver.executeScript("return document.documentElement.scrollTop;");
            return scrollTop === 0;
        }, 5000);

        //Step 9: Choose seat
        for (const seat of listSeat) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
        }

        //Step 10: Fill in data
        // const inforBox = await driver.findElement(By.xpath("//div[contains(@class, 'user_infor_container')]"))
        // await driver.executeScript("arguments[0].scrollIntoView(true);", inforBox);
        await driver.findElement(By.name('name')).sendKeys('Kim Nguyễn');
        await driver.findElement(By.name('tel')).sendKeys('0333843252');
        await driver.findElement(By.name('email')).sendKeys('kimme@gmail.com');
        // Find the checkbox and check it
        // Find the checkbox
        const checkbox = await driver.findElement(By.xpath("//div[contains(@class, 'infor_confirm')]/input[@type='checkbox']"));
       
        //Step 11: Click "Thanh toán"
        // Scroll to the bottom of the page
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

        // Wait until the page has scrolled to the bottom
        await driver.wait(async () => {
            const scrollTop = await driver.executeScript("return document.documentElement.scrollTop;");
            const scrollHeight = await driver.executeScript("return document.documentElement.scrollHeight;");
            const clientHeight = await driver.executeScript("return document.documentElement.clientHeight;");
            return scrollTop + clientHeight >= scrollHeight;
        }, 5000);

         // Wait for the checkbox to be visible
         await driver.wait(until.elementIsVisible(checkbox), 5000);

        // Check the checkbox
        await checkbox.click();

        //Click booking
        const paymentButton = await driver.findElement(By.xpath("//button[contains(text(), 'Thanh toán')]"));
        await paymentButton.click();

        let url
        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url.includes('/payment');
        }, 5000);
        await driver.sleep(2000); // Wait for 2 seconds

        //navigate to another page
        const navButton = await driver.findElement(By.xpath("//a[contains(@class, 'headerListItem')]"));
        await navButton.click();
        const toastMessage = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'dialog_title')]/h2[contains(text(), 'Vé vẫn đang được giữ cho bạn')]")), 10000);
        await driver.wait(until.elementIsVisible(toastMessage), 10000);

        //Click cancel button
        const cancelButton = await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Hủy vé')]")), 10000);
        await cancelButton.click();

        await driver.wait(async () => {
            url = await driver.getCurrentUrl();
            return url === 'http://localhost:3000/';
        }, 5000);
        expect(true).toBeTruthy();
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}


describe('Payment test', function () {
    jest.setTimeout(30000);
    let driver;

    beforeEach(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async () => {
        await driver.quit();
    });

    it('Thanh toán vé hợp lệ đối với khách', async () => await ValidPaymentGuest(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-28', ['B10']));
    it('Thanh toán vé hợp lệ đối với khách hàng có tài khoản', async () => await ValidPaymentUser(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-28', ['B11']));
    it('Xác nhận thoát khỏi phiên thanh toán', async () => await ExitPaymentSession(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-28', ['B12']));
});