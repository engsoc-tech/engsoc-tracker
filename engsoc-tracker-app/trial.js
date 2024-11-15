import chrome from "chrome-cookies-secure"

const url = 'https://www.google.com';

chrome.getCookies(url, 'puppeteer', function(err, cookies) {
    if (err) {
        console.log(err, 'error');
        return
    }
    // do stuff here...
    console.log(cookies, 'cookies');
}, 'yourProfile') // e.g. 'Profile 2'