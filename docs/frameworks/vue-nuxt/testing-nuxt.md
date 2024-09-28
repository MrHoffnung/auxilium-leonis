# Testing Nuxt

<img src="https://vitest.dev/logo.svg" width="150px" height="auto">
<br>

> Based on the YouTube video "[Nuxt Test Utils - A Primer to Testing in Nuxt](https://youtu.be/yGzwk9xi9gU?si=D8yQzNSiTjWVJbv1)" by [Alexander Lichter](https://www.youtube.com/@TheAlexLichter).

## Disclaimer

Like all of my cheatsheets, this one is not guaranteed to be correct. I recommend checking out the official documentations of [Nuxt's test-utils](https://nuxt.com/docs/getting-started/testing), [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) and [Happy-Dom](https://github.com/capricorn86/happy-dom). I would also like to point out that parts of this website are copied 1:1 from the [Nuxt Testing Documentation](https://nuxt.com/docs/getting-started/testing).

## Installing The Tools

```shell
# Using bun
bun add --dev @nuxt/test-utils vitest @vue/test-utils happy-dom @playwright/test
```

## Configuration

The configuration for Vitest is stored in the `vitest.config.ts` file, inside the root directory. A basic Vitest-Config looks like the following example:

```ts
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
  },
});
```

## Where Do I Store My Test?

The are places where people store there test. My preference is to create them inside the `tests/` folder inside the root directory. Inside this folder, I create usually sub-folders for unit- (`unit/`), integration- (`integration/`) and end-to-end-tests (`e2e/`). Each of these folders mirrors the structure of the project (e.g. `pages/`)

## The First Test

Let's create a test, where we're testing if $1+2=3$, just to see if our test-setup is working. Create a file named `add.test.ts` inside the `tests/unit/` folder, and add the following content to it.

```ts
import { describe, it, expect } from "vitest";
import index from "~/pages/index.vue";

describe("add", () => {
  it("1 + 2 = 3", async () => {
    expect(1 + 2).toBe(3);
  });
});
```

Congratulations! You've just created your first test in Nuxt.

## Accessing Components

In Nuxt, almost everything is about components, so it _might_ be useful to access and test them in our tests. Let's say we have a component called `AppNumber.vue`, which generates a random number on every refresh and shows it.

```html
<template>
  <div>Number: {{ randomNumber() }}</div>
</template>

<script lang="ts" setup>
  function randomNumber() {
    return Math.random();
  }
</script>
```

Let's test if the component mounts successfully, by using the `mountSuspended` function.

```ts
import { AppNumber } from "~/components/AppNumber.vue";

describe("AppNumber", () => {
  it("can mount", async () => {
    const component = await mountSuspended(AppNumber);
    expect(component.html()).toContain("Number");
  });
});
```

## Mocking

I don't like mocking. Why, you ask? Because it often doesn't work the way I want it to (maybe it's just my stupidity). But mocking is still an important part of testing. And mocking components and Nuxt imports isn't that hard. Functions are.

### Functions

```ts
describe("number", () => {
  it("can mount", async () => {
    vi.mock("vue", async () => {
      // Import the actual 'vue' module
      const actual = await vi.importActual("vue");
      return {
        // Spread all the actual exports from 'vue'
        ...actual,
        // Override the 'onMounted' function with a mock
        // This mock immediately executes the callback function
        onMounted: vi.fn((fn) => fn()),
      };
    });

    // Create a spy on Math.random and make it return 0
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

    const component = await mountSuspended(number);

    expect(component.text()).toBe("Number: 0");

    // Verify that Math.random was called
    expect(randomSpy).toHaveBeenCalled();

    // Restore the original Math.random function
    randomSpy.mockRestore();
  });
});
```

### Components

You can mock whole components using `mockComponent`. The first argument can be the component name in PascalCase, or the relative path of the component. The second argument is a factory function that returns the mocked component.

```ts
import { mockComponent } from "@nuxt/test-utils/runtime";

mockComponent("MyComponent", {
  props: {
    value: String,
  },
  setup(props) {
    // ...
  },
});
```

### Nuxt Imports

To mock Nuxt's auto import functionality you can use `mockNuxtImport`. `mockNuxtImport` can only be used once per mocked import per test file.

```ts
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

mockNuxtImport("useStorage", () => {
  return () => {
    return { value: "mocked storage" };
  };
});
```

<br>
If you need to mock a Nuxt import and provide different implementations between tests, you can do it by creating and exposing your mocks using vi.hoisted, and then use those mocks in mockNuxtImport. You then have access to the mocked imports, and can change the implementation between tests. Be careful to restore mocks before or after each test to undo mock state changes between runs.

```ts
import { vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";

const { useStorageMock } = vi.hoisted(() => {
  return {
    useStorageMock: vi.fn().mockImplementation(() => {
      return { value: "mocked storage" };
    }),
  };
});

mockNuxtImport("useStorage", () => {
  return useStorageMock;
});

// Then, inside a test
useStorageMock.mockImplementation(() => {
  return { value: "something else" };
});
```

## End-To-End Testing

End-to-end (E2E) testing is a Software testing methodology to test a functional and data application flow consisting of several sub-systems working together from start to end. To write E2E tests in Nuxt, we usually use Vitest, Playwright and Happy-Dom.

### A First E2E-Test

```ts
import { describe, test } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils/e2e";

describe("My test", async () => {
  await setup({
    // test context options
  });

  test("my test", () => {
    const page = await createPage("/login");
    expect(await page.getByTestId("email").isVisible()).toBe(true);
    expect(await page.getByTestId("password").isVisible()).toBe(true);

    // This is NOT the $fetch you use in Nuxt components.
    const html = await $fetch("/");
    expect(html).toContain("Hello World");
  });
});
```

### Using APIs

You can use `$fetch` to get the HTML of a page, `fetch` to get the JSON of a page and `url` to get the full url of a page.

```ts
import { describe, test } from "vitest";
import { setup, $fetch, fetch, url } from "@nuxt/test-utils/e2e";

describe("My test", async () => {
  await setup({
    // test context options
  });

  test("my test", () => {
    // This is NOT the $fetch you use in Nuxt components.
    const html = await $fetch("/");
    expect(html).toContain("Hello World");

    const res = await fetch("/");
    const { body, headers } = res;

    const pageUrl = url("/page");
    // 'http://localhost:8000/page'
  });
});
```

## Advanced E2E with Playwright

Playwright is and advanced E2E-Testing framework. `@nuxt/test-utils` does have an direct integration of Playwright. Check out the [official Playwright documentation](https://playwright.dev/docs/api/class-page) to learn more.

Before we can use Playwright, we have to configure it by creating a `playwright.config.ts` inside the root directory. A minimal config looks like this:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";

export default defineConfig<ConfigOptions>({
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  // ...
});
```

<br>
Now we can start to write our E2E-Tests:

```ts
import { expect, test } from "@nuxt/test-utils/playwright";

test("test", async ({ page, goto }) => {
  await goto("/", { waitUntil: "hydration" });
  await expect(page.getByRole("heading")).toHaveText("Welcome to Playwright!");
});
```

<br>
To execute the tests run:
```sh
bun playwright test
```

## Show Of Knowledge

### The Power Of Expect

In this cheat sheet we have only scratched the surface of the power of Vitest's `expect`. Check out the [official documentation](https://vitest.dev/api/expect.html) to unlock the full potential of `expect`.
