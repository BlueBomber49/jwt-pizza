// import { test, expect } from '@playwright/test' <- Replace this with the line below
import { Page } from "@playwright/test";
import { test, expect } from "playwright-test-coverage";

async function loginAdmin(page: Page) {
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
}

test("register", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByText("Welcome to the party")).toBeVisible();
  await page.getByRole("textbox", { name: "Full name" }).fill("Tony, Mob Boss");
  await page.getByRole("textbox", { name: "Email address" }).fill("t@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("pizza");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
  await expect(page.getByRole("link", { name: "TB" })).toBeVisible();
});

test("about", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("contentinfo")).toContainText("About");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main").getByRole("img").first()).toBeVisible();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
});

test("logout test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("Tony, Mob Boss");
  await page.getByRole("textbox", { name: "Email address" }).fill("t@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("pizza");
  await page.getByRole("button", { name: "Register" }).click();
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
});

test("admin test create/delete franchise", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await loginAdmin(page);
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('Tony\'s Pizza');
  await page.getByRole('textbox', { name: 'franchise name' }).press('Tab');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('t@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'Tony\'s Pizza' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Tony, Mob Boss' })).toBeVisible();
  await page.getByRole('row', { name: 'Tony\'s Pizza Tony, Mob Boss' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('cell', { name: 'Tony\'s Pizza' })).not.toBeVisible();
});

test("franchise help page", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(
    page.getByLabel("Global").getByRole("link", { name: "Franchise" })
  ).toBeVisible();
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByText("So you want a piece of the")).toBeVisible();
});

test("franchisee dashboard", async ({ page }) => {
  await page.goto("http://localhost:5173/");
await page.goto('http://localhost:5173/');
await page.getByRole('link', { name: 'Login' }).click();
await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
await page.getByRole('button', { name: 'Login' }).click();
await expect(page.getByRole('link', { name: 'pf' })).toBeVisible();
await page.getByRole('link', { name: 'pf' }).click();
await expect(page.getByText('pizza franchisee')).toBeVisible();
await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByText('pizzaPocket')).toBeVisible();
await expect(page.getByRole('cell', { name: 'SLC' })).toBeVisible();
await page.getByRole('button', { name: 'Create store' }).click();
await page.getByRole('textbox', { name: 'store name' }).fill('TestStore');
await expect(page.getByText('Create store')).toBeVisible();
await page.getByRole('button', { name: 'Create' }).click();
await expect(page.getByRole('cell', { name: 'TestStore' })).toBeVisible();
await expect(page.getByRole('cell', { name: '0 ₿' })).toBeVisible();
await page.getByRole('row', { name: 'TestStore 0 ₿ Close' }).getByRole('button').click();
await expect(page.getByText('Sorry to see you go')).toBeVisible();
await page.getByRole('button', { name: 'Close' }).click();
});

test("view history", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByText("Mama Rucci, my my")).toBeVisible();
});

test("order test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  loginAdmin(page);
  await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
  await page.getByRole("button", { name: "Order now" }).click();
  await expect(
    page.getByRole("link", { name: "Image Description Pepperoni" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.getByText("Selected pizzas:")).toBeVisible();
  await page.getByRole("combobox").selectOption("1");
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page.getByText("So worth it")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay now" })).toBeVisible();
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByText("Here is your JWT Pizza!")).toBeVisible();
  await expect(page.getByRole("button", { name: "Order more" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Verify" })).toBeVisible();
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(
    page.getByRole("heading", { name: "JWT Pizza - valid" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
});

test("diner dashboard", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("Diner dan");
  await page.getByRole("textbox", { name: "Full name" }).press("Tab");
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("d");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByRole("link", { name: "Dd" }).click();
  await expect(page.getByText("Your pizza kitchen")).toBeVisible();
});
