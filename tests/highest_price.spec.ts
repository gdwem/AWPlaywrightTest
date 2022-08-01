import { test, expect } from '@playwright/test';
import { reportSlowTests } from '../playwright.config';

test('Click on the highest priced dress', async ({ page }) => {

  // Go to http://automationpractice.com/index.php
  await page.goto('http://automationpractice.com/index.php');

  // Go to http://automationpractice.com/index.php?id_category=8&controller=category
  await page.goto('http://automationpractice.com/index.php?id_category=8&controller=category');

  // get the prices on the page
  const prices = page.locator('//*[@class="left-block"]//span[@class="price product-price"]');
  const mostExpensive = await prices.allTextContents();

  let pricesArray: number[] = [];

  mostExpensive.forEach(element => element !== 'undefined' ? pricesArray.push(parseFloat(element.split('$')[1])) :  null);
  
  // find the highest price
  const highestPrice = pricesArray.sort()[pricesArray.length - 1];

  await console.log(highestPrice);

  // get the products parent container
  const productContainer = page.locator('//*[@class="product-container"]');
  const count = await prices.count()

  // cycle through the products
  for (let i = 0; i< count; ++i)
  {
    let currentPrice = await (await productContainer.nth(i).locator('//*[@class="left-block"]//span[@class="price product-price"]').innerText()).includes(highestPrice.toString());

    if (currentPrice) {
      // if the blocks descendant contains the highest price, then click on that blocks descendant add to cart
      await productContainer.nth(i).hover()
      await productContainer.nth(i).locator('//div[@class="right-block"]//a[@class="button ajax_add_to_cart_button btn btn-default"]').click();  

      // assert item has been added
      await expect(page.locator('//*[@class="ajax_cart_product_txt "]')).toHaveText('There is 1 item in your cart.')
    }
  }
});