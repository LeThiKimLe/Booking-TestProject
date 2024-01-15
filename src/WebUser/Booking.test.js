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

const BookingValidSeat = async (driver, departure, destination, departDate, listSeat) => {
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
        await driver.wait(until.stalenessOf(loadingElement), 5000);

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

        expect(url).toContain('/payment');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const BookingEmptySeat = async (driver, departure, destination, departDate) => {
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
        await driver.wait(until.stalenessOf(loadingElement), 5000);

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

        const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
        await driver.wait(until.elementIsVisible(toastMessage), 5000);
        const toastText = await toastMessage.getText();
        expect(toastText).toContain('Vui lòng chọn chỗ');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const BookingInsufficientData  = async (driver, departure, destination, departDate, listSeat) => {
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
        await driver.wait(until.stalenessOf(loadingElement), 5000);

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

        const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
        await driver.wait(until.elementIsVisible(toastMessage), 5000);
        const toastText = await toastMessage.getText();
        expect(toastText).toContain('Vui lòng điền đủ thông tin người mua');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const BookingNotCheckPolicy  = async (driver, departure, destination, departDate, listSeat) => {
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
        await driver.wait(until.stalenessOf(loadingElement), 5000);

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

        const paymentButton = await driver.findElement(By.xpath("//button[contains(text(), 'Thanh toán')]"));
        await paymentButton.click();

        const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
        await driver.wait(until.elementIsVisible(toastMessage), 5000);
        const toastText = await toastMessage.getText();
        expect(toastText).toContain('Vui lòng tích xác nhận điều khoản');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const BookingOverMaxTicket  = async (driver, departure, destination, departDate, listSeat) => {
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
        await driver.wait(until.stalenessOf(loadingElement), 5000);

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
        for (const seat of listSeat.slice(0, 6)) {
            const seatButton = await driver.wait(until.elementLocated(By.xpath(`//div[contains(@class,'seatname') and text()='${seat}']`)), 5000);
            await seatButton.click();
        }

        const toastMessage = await driver.wait(until.elementLocated(By.css('.Toastify__toast')), 5000);
        await driver.wait(until.elementIsVisible(toastMessage), 5000);
        const toastText = await toastMessage.getText();
        expect(toastText).toContain('Chỉ chọn tối đa 5 vé');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

const BookingForUser = async (driver, departure, destination, departDate, listSeat) => {
    try {

         // Steps to login with user account
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
        await driver.wait(until.stalenessOf(loadingElement), 5000);

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
        expect(url).toContain('/payment');
    }
    catch (error) {
        console.log(error)
        throw (error)
    }
}

describe('Booking test', function () {
    jest.setTimeout(30000);
    let driver;

    beforeEach(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterEach(async () => {
        await driver.quit();
    });

    it('Đặt vé hợp lệ', async () => await BookingValidSeat(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-25', ['A15']));
    it('Đặt vé khi chưa chọn chỗ ngồi', async () => await BookingEmptySeat(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-25'));
    it('Đặt vé khi chưa điền đủ thông tin', async () => await BookingInsufficientData(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-25', ['A05', 'A06']));
    it('Đặt vé khi chưa tích chọn chính sách', async () => await BookingNotCheckPolicy(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-25', ['B03']));
    it('Đặt chọn quá 5 vé', async () => await BookingOverMaxTicket(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-25', ['B04', 'B05', 'B06', 'B07','B08', 'B09']));
    it('Đặt vé đối với người dùng có tài khoản', async () => await BookingForUser(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh', '2024-01-25', ['A10']));
});