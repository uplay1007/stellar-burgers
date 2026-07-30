import { test, expect } from '@playwright/test';
import path from 'path';

const HAR_INGREDIENTS = path.join(__dirname, 'hars/ingredients.har');
const HAR_USER = path.join(__dirname, 'hars/user.har');
const HAR_ORDER = path.join(__dirname, 'hars/order.har');

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';

test.describe('Конструктор бургера: ингредиенты и модальное окно', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/ingredients' });
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Соберите бургер' })
    ).toBeVisible();
  });

  test('добавляет булку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(
      page.getByText(`${BUN_NAME} (верх)`, { exact: false })
    ).toBeVisible();
    await expect(
      page.getByText(`${BUN_NAME} (низ)`, { exact: false })
    ).toBeVisible();
  });

  test('добавляет начинку из списка ингредиентов в конструктор', async ({
    page
  }) => {
    await page
      .locator('li', { hasText: MAIN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Название начинки в конструкторе рендерится компонентом
    // ConstructorElement из библиотеки UI-кита с фиксированным (не
    // CSS-модульным) классом — по нему однозначно отличаем карточку
    // в конструкторе от такой же по названию карточки в списке ингредиентов.
    await expect(
      page.locator('.constructor-element__text', { hasText: MAIN_NAME })
    ).toBeVisible();
  });

  test('открывает модальное окно с данными того ингредиента, по которому кликнули', async ({
    page
  }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText(BUN_NAME)).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по клику на крестик', async ({
    page
  }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();
    await expect(page.locator('#modals').getByText(BUN_NAME)).toBeVisible();

    await page.locator('#modals button').first().click();

    await expect(page.locator('#modals')).toBeEmpty();
  });

  test('закрывает модальное окно ингредиента по клику на оверлей', async ({
    page
  }) => {
    await page.locator('li', { hasText: BUN_NAME }).getByRole('link').click();
    await expect(page.locator('#modals').getByText(BUN_NAME)).toBeVisible();

    await page.mouse.click(5, 5);

    await expect(page.locator('#modals')).toBeEmpty();
  });
});

test.describe('Конструктор бургера: оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript((token) => {
      window.localStorage.setItem('refreshToken', token as string);
    }, 'test-refresh-token');

    await page.routeFromHAR(HAR_INGREDIENTS, { url: '**/ingredients' });
    await page.routeFromHAR(HAR_USER, { url: '**/auth/user' });
    await page.routeFromHAR(HAR_ORDER, { url: '**/orders' });

    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Соберите бургер' })
    ).toBeVisible();
  });

  test('создаёт заказ и очищает конструктор после успешного оформления', async ({
    page
  }) => {
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText('12345')).toBeVisible();
    await expect(modal.getByText('идентификатор заказа')).toBeVisible();

    await modal.locator('button').first().click();
    await expect(modal).toBeEmpty();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});
