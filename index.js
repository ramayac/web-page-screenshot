const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;
//const fs = require('fs');

const PORT = process.env.PORT || 3000;
const FILENAME = 'screenshot.png';
const SCREENSHOT_URL = 'https://duckduckgo.com/';

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', async(req, res, next) => {
    res.status(200).send('ok').end();
  })
  .get('/screenshot', async (req, res, next) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    //await page.setViewport({ width: 600, height: 800 });
    //await page.goto(SCREENSHOT_URL || 'https://google.com');
    await page.goto(SCREENSHOT_URL);

    await page.screenshot({
      path: FILENAME,
    });

    await browser.close();

    await convert(FILENAME);

    res.status(200).send('ok').end();
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename, /*'-gravity', 'center', '-extent', '600x800',*/ '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {
        resolve();
      }
    });
  });
}
