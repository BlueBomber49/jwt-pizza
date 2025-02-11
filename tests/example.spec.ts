// import { test, expect } from '@playwright/test' <- Replace this with the line below
import { Page } from "@playwright/test";
import { test, expect } from "playwright-test-coverage";
import { Role } from "../src/service/pizzaService";

async function loginAdmin(page: Page) {
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() == "PUT") {
      const loginReq = { email: "a@jwt.com", password: "admin" };
      const loginRes = {
        user: {
          id: 3,
          name: "admin",
          email: "a@jwt.com",
          roles: [{ role: Role.Admin }],
        },
        token: "abcdef",
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await page.evaluate((loginRes) => {
        localStorage.setItem("user", JSON.stringify(loginRes));
      });
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() == "DELETE") {
      const logoutRes = {
        message: "logout successful",
      };
      await route.fulfill({ json: logoutRes });
      await page.evaluate(() => {
        localStorage.setItem("user", "");
      });
    }
  });
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
}

test("register test", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    const registerReq = {
      name: "Tony, Mob Boss",
      email: "t@jwt.com",
      password: "pizza",
    };
    const registerRes = {
      user: {
        name: "Tony, Mob Boss",
        email: "t@jwt.com",
        roles: [
          {
            role: "diner",
          },
        ],
        id: 7,
      },
      token: "qwerty",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

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

test("about test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("contentinfo")).toContainText("About");
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main").getByRole("img").first()).toBeVisible();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
});

test("logout test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await loginAdmin(page);
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
});

test("admin test create/delete franchise", async ({ page }) => {
  await page.route("*/**/api/franchise", async (route) => {
    if (route.request().method() == "POST") {
      const createReq = {
        stores: [],
        id: "",
        name: "Tony's Pizza",
        admins: [
          {
            "email": "t@jwt.com"
          }
        ]
      };
      const createRes = {
        "name": "Tony's Pizza",
        "admins": [
          {
            "email": "t@jwt.com",
            "id": 3,
            "name": "Tony, Mob Boss"
          }
        ],
        "id": 1
      }
      expect(route.request().postDataJSON()).toMatchObject(createReq);
      await route.fulfill({ json: createRes });
    }
    else if (route.request().method() == "GET") {
      const franchiseRes = [{
        id: 1,
        name: "Tony's Pizza",
        stores: [
          {id: 1, name: 'Shady Pizza Joint'}
        ],
      }]
      await route.fulfill({json: franchiseRes})
    }
  });

  await page.goto("http://localhost:5173/");
  await loginAdmin(page);
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("Tony's Pizza");
  await page.getByRole("textbox", { name: "franchise name" }).press("Tab");
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("t@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name: "Tony's Pizza" })).toBeVisible();
  await page.getByRole("row", {name:'Tony\'s Pizza Close'}).getByRole("button").click()
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await expect(
    page.getByRole("cell", { name: "Tony's Pizza" })
  ).not.toBeVisible();
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
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() == "PUT") {
      const loginReq = { email: "f@jwt.com", password: "franchisee" };
      const loginRes = {
        user: {
          id: 3,
          name: "franchisee",
          email: "f@jwt.com",
          roles: [{ role: Role.Franchisee }],
        },
        token: "abcdef",
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await page.evaluate((loginRes) => {
        localStorage.setItem("user", JSON.stringify(loginRes));
      });
      await route.fulfill({ json: loginRes });
    }
  });
  await page.route("*/**/api/franchise/3", async (route) => {
    const dummyData = [
      {
        "id": 2,
        "name": "TestFranchise",
        "admins": [
          {
            "id": 4,
            "name": "pizza franchisee",
            "email": "f@jwt.com"
          }
        ],
        "stores": [
          {
            "id": 4,
            "name": "TestStore",
            "totalRevenue": 0
          }
        ]
      }
    ]
    await route.fulfill({ json: dummyData });
  })
  await page.route("*/**/api/franchise/2/store", async (route) =>{
    const createReq = {
      "id": "",
      "name": "TestStore"
    }
    const createRes = {
      "id": 1,
      "name": "TestStore",
      "totalRevenue": 0
    }
    expect(route.request().postDataJSON()).toMatchObject(createReq);
    await route.fulfill({ json: createRes})
  })
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("f@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("franchisee");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("link", { name: "f", exact: true  })).toBeVisible();
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();

  await expect(page.getByText("TestFranchise")).toBeVisible();
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("TestStore");
  await expect(page.getByText("Create store")).toBeVisible();
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name: "TestStore" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "0 ₿" })).toBeVisible();
  await page
    .getByRole("row", { name: "TestStore 0 ₿ Close" })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
});

test("view history", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByText("Mama Rucci, my my")).toBeVisible();
});

test("order test", async ({ page }) => {
  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() == "PUT") {
      const loginReq = { email: "d@jwt.com", password: "diner" };
      const loginRes = {
        user: {
          id: 3,
          name: "diner",
          email: "d@jwt.com",
          roles: [{ role: Role.Diner }],
        },
        token: "abcdef",
      };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await page.evaluate((loginRes) => {
        localStorage.setItem("user", JSON.stringify(loginRes));
      });
      await route.fulfill({ json: loginRes });
    }
  });
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });
  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });
  await page.route('*/**/api/order/verify', async (route) => {
    expect(route.request().postDataJSON()).toMatchObject({"jwt": "eyJpYXQ"})
    let verifyRes = {
      "message": "valid"
    }
    await route.fulfill({ json: verifyRes });
  })
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
  await page.getByRole("button", { name: "Order now" }).click();
  await expect(
    page.getByRole("link", { name: "Image Description Pepperoni" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await expect(page.getByText("Selected pizzas:")).toBeVisible();
  await page.getByRole("combobox").selectOption("Lehi");
  await page.getByRole("button", { name: "Checkout" }).click();

  //Login
  await expect(page.getByText("Welcome back")).toBeVisible();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();

  //Checkout
  await expect(page.getByText("So worth it")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pay now" })).toBeVisible();
  await page.getByRole("button", { name: "Pay now" }).click();

  //Validation
  await expect(page.getByText("Here is your JWT Pizza!")).toBeVisible();
  await expect(page.getByRole("button", { name: "Order more" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Verify" })).toBeVisible();
  await page.getByRole("button", { name: "Verify" }).click();
  await expect(
    page.getByRole("heading", { name: "JWT Pizza - valid" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
});

test("profile", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await loginAdmin(page);
  await page.getByRole("link", { name: "a", exact: true }).click();
  await expect(page.getByText("Your pizza kitchen")).toBeVisible();
});
