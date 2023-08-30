require('dotenv').config()
const {Builder, Browser, By} = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');
const options = new chrome.Options();

options.addArguments('headless');
options.addArguments("--no-sandbox");
options.addArguments("--disable-dev-shm-usage");

const login = process.env.LOGIN;
const password = process.env.PASSWORD;
const fourHours = 1000 * 60 * 60 * 4.1;

(async function updateMyResume() {
    console.log('start driver...')
    let driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();
    try {
        await driver.get('https://hh.ru/login');
        console.log('get hh.ru/login')
        await enterByPassword(driver);
        await enterAndSendCredentials(driver);
        await driver.get('https://hh.ru/applicant/resumes');
        await updateResume(driver)
    } catch (e) {
        console.log("Update is failed " + e)
    } finally {
        await driver.quit();
        console.log('driver is finish')
        console.log('sleep 4 hours')
        setTimeout(async () => {
            await updateMyResume
        }, fourHours)
    }
})()

async function enterByPassword(driver) {
    // Кликнуть на ссылку "Войти с паролем"
    try {
        const enterByPassBtn = await driver.findElement(By.xpath("//*[@data-qa='expand-login-by-password']"));
        await driver.executeScript("arguments[0].click();", enterByPassBtn)
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('get enterByPassword')
    } catch (e) {
        console.log(e)
    }
}

async function enterAndSendCredentials(driver) {
    try {
        // Найти поле логина и ввести логин
        const inputLogin = driver.findElement(By.xpath("//*[@data-qa='login-input-username']"));
        inputLogin.sendKeys(login);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Найти поле пароля и ввести пароль
        const inputPassword = driver.findElement(By.xpath("//*[@data-qa='login-input-password']"));
        inputPassword.sendKeys(password);
        await new Promise(resolve => setTimeout(resolve, 500));
        // Найти и нажать кнопку "Войти"
        const onLoginButton = await driver.findElement(By.xpath("//*[@data-qa='account-login-submit']"));
        await driver.executeScript("arguments[0].click();", onLoginButton)
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('get enterAndSendCredentials')
    } catch (e) {
        console.log(e)
    }
}

async function updateResume(driver) {
    try {
        // Найти и нажать ссылку "Поднять резюме"
        const updateResumeButton = driver.findElement(By.xpath("//*[@data-qa='resume-update-button_actions']"))
        await driver.executeScript("arguments[0].click();", updateResumeButton)
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('get updateResume')
    } catch (e) {
        console.log(e)
    }
}