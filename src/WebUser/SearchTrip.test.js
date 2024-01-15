// Import necessary dependencies and test utilities
const { Builder, By, Key, until } = require('selenium-webdriver');

const FindTripFromHome = async (driver, departure, destination) => {
    try {
        // Access the URL
        await driver.get('http://localhost:3000/');

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "//div[contains(@class, 'selectArea')]/div[text()='Điểm đi']/following-sibling::div[1]"
                )
            ),
            5000
        );
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label departure
        const optionDeparture = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(text(), '${departure}')]`)
            ),
            7000
        );
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", optionDeparture);
        // Wait for the checkbox to be clickable and then click it
        await driver.wait(until.elementIsVisible(optionDeparture), 10000);
        await driver.sleep(1000)
        await optionDeparture.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "//div[contains(@class, 'selectArea')]/div[text()='Điểm đến']/following-sibling::div[1]"
                )
            ),
            5000
        );
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label destination
        const optionDestination = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(text(), '${destination}')]`)
            ),
            7000
        );
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", optionDestination);
        // Wait for the checkbox to be clickable and then click it
        await driver.wait(until.elementIsVisible(optionDestination), 10000);
        await driver.sleep(1000)
        await optionDestination.click();
        // Step 5: Find and click on the element with className "_datePicker"
        const datePickerElement = await driver.findElement(
            By.xpath("//*[contains(@class, '_datePicker')]")
        );
        await datePickerElement.click();

        // Step 6: Find the select-datepicker and choose tomorrow
        // Find the next sibling element
        const nextElement = await driver.findElement(
            By.xpath("//*[contains(@class, '--today')]/following-sibling::*[1]")
        );
        await nextElement.click();

        // Step 7: Click the "Chọn chuyến xe" button
        const chonChuyenXeButton = await driver.findElement(
            By.xpath("//button[contains(text(), 'Tìm chuyến xe')]")
        );
        await chonChuyenXeButton.click();

        // Step 8: Check that the current URL contains "trips"
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('trips');
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const FindTripFromTrip = async (driver, departure, destination) => {
    try {
        // Access the URL
        await driver.get('http://localhost:3000/');

        // Step 1: Click on the select component for "Điểm Đi"
        const selectItemDiemDi = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "//div[contains(@class, 'selectArea')]/div[text()='Điểm đi']/following-sibling::div[1]"
                )
            ),
            5000
        );
        await selectItemDiemDi.click();

        // Step 2: Choose the option with label "TP. Hồ Chí Minh"
        const optionTpHCM = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(text(), 'TP. Hồ Chí Minh')]`)
            ),
            7000
        );
        await optionTpHCM.click();

        // Step 3: Click on the select component for "Điểm Đến"
        const selectItemDiemDen = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "//div[contains(@class, 'selectArea')]/div[text()='Điểm đến']/following-sibling::div[1]"
                )
            ),
            5000
        );
        await selectItemDiemDen.click();

        // Step 4: Choose the option with label "Thành phố Trà Vinh"
        const optionTraVinh = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(text(), 'Thành phố Trà Vinh')]`)
            ),
            7000
        );
        await optionTraVinh.click();

        // Step 5: Find and click on the element with className "_datePicker"
        const datePickerElement = await driver.findElement(
            By.xpath("//*[contains(@class, '_datePicker')]")
        );
        await datePickerElement.click();

        // Step 6: Find the select-datepicker and choose tomorrow
        // Find the next sibling element
        const nextElement = await driver.findElement(
            By.xpath("//*[contains(@class, '--today')]/following-sibling::*[1]")
        );
        await nextElement.click();

        // Step 7: Click the "Chọn chuyến xe" button
        const chonChuyenXeButton = await driver.findElement(
            By.xpath("//button[contains(text(), 'Tìm chuyến xe')]")
        );
        await chonChuyenXeButton.click();

        const loadingElement = await driver.findElement(
            By.xpath("//div[contains(@class, 'loading-container')]")
        );
        await driver.wait(until.stalenessOf(loadingElement), 5000);

        // Scroll to the top of the page
        await driver.executeScript("window.scrollTo(0, 0);");

        await driver.wait(async () => {
            const scrollTop = await driver.executeScript(
                "return document.documentElement.scrollTop;"
            );
            return scrollTop === 0;
        }, 5000);

        // Step 8: Search trip on trip page
        const selectItemDiemDiNew = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "//div[contains(@class, 'selectArea')]/div[text()='Điểm đi']/following-sibling::div[1]"
                )
            ),
            5000
        );
        await selectItemDiemDiNew.click();

        const optionDepart = await driver.wait(
            until.elementLocated(By.xpath(`//div[contains(text(), '${departure}')]`)),
            10000
        );
        await optionDepart.click();

        const selectItemDiemDenNew = await driver.wait(
            until.elementLocated(
                By.xpath(
                    "//div[contains(@class, 'selectArea')]/div[text()='Điểm đến']/following-sibling::div[1]"
                )
            ),
            5000
        );
        await selectItemDiemDenNew.click();

        const optionDestinate = await driver.wait(
            until.elementLocated(
                By.xpath(`//div[contains(text(), '${destination}')]`)
            ),
            10000
        );
        await optionDestinate.click();

        const chonChuyenXeButtonNew = await driver.findElement(
            By.xpath("//button[contains(text(), 'Tìm chuyến xe')]")
        );
        await chonChuyenXeButtonNew.click();

        // Step 8: Check that the current URL contains "trips"
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).toContain('trips');
    } catch (error) {
        console.log(error);
        throw error;
    }
};

describe('Search Trip Test', () => {
    jest.setTimeout(30000);
    let driver;

    beforeAll(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    it('Tìm kiếm chuyến đi từ trang home chiều thuận', async () => {
        await FindTripFromHome(driver, 'TP. Hồ Chí Minh', 'Thành phố Trà Vinh');
    });

    it('Tìm kiếm chuyến đi từ trang home chiều thuận', async () => {
        await FindTripFromHome(driver, 'Đà Nẵng', 'Nha Trang');
    });

    it('Tìm kiếm chuyến đi từ trang home chiều ngược', async () => {
        await FindTripFromHome(driver, 'Thành phố Trà Vinh', 'TP. Hồ Chí Minh');
    });

    it('Tìm kiếm chuyến đi từ trang home chiều ngược', async () => {
        await FindTripFromHome(driver, 'Vũng Tàu', 'TP. Hồ Chí Minh');
    });

    it('Tìm kiếm chuyến đi từ trang home chiều ngược', async () => {
        await FindTripFromHome(driver, 'Nha Trang', 'TP. Hồ Chí Minh');
    });

    it('Tìm kiếm chuyến đi từ trang kết quả tìm kiếm', async () => {
        await FindTripFromTrip(driver, 'Đà Lạt', 'Đà Nẵng');
    });
});