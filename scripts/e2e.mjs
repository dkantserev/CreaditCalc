import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = process.env.EVIDENCE_DIR || 'evidence';
await fs.mkdir(out, {recursive: true});
const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage({viewport: {width: 1440, height: 1000}, acceptDownloads: true});
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const checks = [];

async function check(name, fn) {
    await fn();
    checks.push({name, status: 'PASS'});
}

try {
    await page.goto('http://127.0.0.1:5173');
    await check('initial empty state', async () => {
        await page.getByText('Здесь появятся результаты').waitFor();
    });
    await page.getByRole('button', {name: 'Рассчитать кредит', exact: true}).click();
    await page.locator('.stats strong').first().waitFor();
    await page.locator('.recharts-surface').first().waitFor();
    await check('annuity via live API', async () => assert.equal(await page.locator('#schedule tbody tr').count(), 36));
    await page.screenshot({path: out + '/desktop.png', fullPage: false});
    await check('CSV download', async () => {
        const dp = page.waitForEvent('download');
        await page.getByRole('button', {name: 'Скачать CSV'}).click();
        const d = await dp;
        await d.saveAs(out + '/schedule.csv');
        const text = await fs.readFile(out + '/schedule.csv', 'utf8');
        assert.ok(text.startsWith('\uFEFFМесяц;'));
        assert.equal(text.split('\r\n').length, 37);
    });
    await check('comparison of three offers', async () => {
        await page.getByRole('button', {name: 'Сравнить предложения'}).click();
        await page.locator('#compare table').waitFor();
        assert.equal(await page.locator('#compare tbody tr').count(), 3);
        assert.ok(await page.locator('.badge').count() >= 2);
    });
    await page.locator('#compare').screenshot({path: out + '/compare.png'});
    await check('differentiated schedule via live API', async () => {
        await page.locator('[name=amount]').fill('120000');
        await page.locator('[name=annualRate]').fill('12');
        await page.locator('[name=term]').fill('12');
        await page.locator('[name=type]').selectOption('DIFFERENTIATED');
        await page.getByRole('button', {name: 'Рассчитать кредит', exact: true}).click();
        await page.waitForFunction(() => document.querySelector('#schedule tbody tr td:nth-child(2)')?.textContent?.replace(/\s/g, '').includes('11200'));
        assert.equal(await page.locator('#schedule tbody tr').count(), 12);
    });
    await check('zero rate and final rounding', async () => {
        await page.locator('[name=amount]').fill('100');
        await page.locator('[name=annualRate]').fill('0');
        await page.locator('[name=term]').fill('3');
        await page.locator('[name=type]').selectOption('ANNUITY');
        await page.getByRole('button', {name: 'Рассчитать кредит', exact: true}).click();
        await page.waitForFunction(() => document.querySelectorAll('#schedule tbody tr').length === 3);
        assert.ok((await page.locator('#schedule tbody tr').last().innerText()).includes('33,34'));
    });
    await check('HTML validation', async () => {
        await page.locator('[name=amount]').fill('-1');
        assert.equal(await page.locator('[name=amount]').evaluate(e => e.checkValidity()), false);
        await page.locator('[name=amount]').fill('1000000');
    });
    await page.locator('[name=annualRate]').fill('18');
    await page.locator('[name=term]').fill('36');
    await page.getByRole('button', {name: 'Рассчитать кредит', exact: true}).click();
    await page.waitForFunction(() => document.querySelectorAll('#schedule tbody tr').length === 36);
    await check('mobile layout at 390px', async () => {
        await page.setViewportSize({width: 390, height: 844});
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({path: out + '/mobile.png', fullPage: true});
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
    });
    await page.setViewportSize({width: 1440, height: 1000});
    await check('print PDF includes all rows', async () => {
        await page.emulateMedia({media: 'print'});
        assert.equal(await page.locator('#schedule tbody tr:visible').count(), 36);
        await page.pdf({path: out + '/calculation-print.pdf', format: 'A4', printBackground: true});
    });
    await check('no runtime JS errors', async () => assert.deepEqual(errors, []));
    await fs.writeFile(out + '/e2e-results.json', JSON.stringify({checks, errors}, null, 2));
    console.log(JSON.stringify(checks, null, 2));
} finally {
    await browser.close();
}
