/* eslint-env jest */
const config = require('config')
const timeout = 5000

test('can wait for an element to appear', async () => {
  const context = await global.__BROWSER__.createIncognitoBrowserContext()
  const page = await context.newPage()
  await page.goto(`${config.get('baseURL')}`)
  await page.waitFor('#elementappearschild', { visible: true, timeout: 5000 })
}, timeout)

test('can use an element that appears after on page load', async () => {
  const context = await global.__BROWSER__.createIncognitoBrowserContext()
  const page = await context.newPage()
  await page.goto(`${config.get('baseURL')}`)
  await page.waitFor('#loadedchild', { visible: true, timeout: 5000 })
  const element = await page.$('#loadedchild')
  const text = await (await element.getProperty('textContent')).jsonValue()
  expect(text).toBe('Loaded!')
}, timeout)

test('can handle alerts', async () => {
  const context = await global.__BROWSER__.createIncognitoBrowserContext()
  const page = await context.newPage()
  page.on('dialog', async dialog => {
    await dialog.accept()
  })
  await page.goto(`${config.get('baseURL')}/leave`)
  await page.click('#homelink')
  await page.waitFor('#elementappearsparent', { visible: true, timeout: 5000 })
}, timeout)

test('can check for errors when there should be none', async () => {
  const context = await global.__BROWSER__.createIncognitoBrowserContext()
  const page = await context.newPage()
  let errors = ''
  page.on('pageerror', pageerr => {
    errors = errors + pageerr
  })
  await page.goto(`${config.get('baseURL')}`)
  expect(errors).toBe('')
}, timeout)

test('can check for errors when there are present', async () => {
  const context = await global.__BROWSER__.createIncognitoBrowserContext()
  const page = await context.newPage()
  let errors = ''
  page.on('pageerror', pageerr => {
    errors = errors + pageerr
  })
  await page.goto(`${config.get('baseURL')}/error`)
  expect(errors).toBe('Error: Purple Monkey Dishwasher Error')
}, timeout)

test('can use xpath selectors to find elements', async () => {
  const context = await global.__BROWSER__.createIncognitoBrowserContext()
  const page = await context.newPage()
  await page.goto(`${config.get('baseURL')}`)
  await page.waitForXPath('//span[contains(., "Scissors")]')
  const elements = await page.$x('//span[contains(., "Scissors")]')
  await elements[0].click()
  await page.waitForXPath('//div[contains(., "Scissors clicked!")]')
}, timeout)
