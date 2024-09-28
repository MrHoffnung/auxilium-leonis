# Basics of Nuxt

<img src="https://nuxt.com/assets/design-kit/icon-green.svg" width="150px" height="auto">
<br>

> Based on the YouTube playlist "[Nuxt 3 Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9haQlqdCQyYmL_27TesCGPC)" by [Net Ninja](https://www.youtube.com/@NetNinja).

## Disclaimer

Like all of my cheatsheets, this one is not guaranteed to be correct. The official documentation for Nuxt can be found [here](https://nuxt.com/docs/getting-started/introduction). Please note also that the predecessor of this cheatsheet is "[Basics of Vue](./basics-of-vue.md)".

## Creating a Nuxt App

In this case we create our Nuxt project with Bun because it's Zig 🤣!

```
bun x nuxi@latest init <your-project-name>
cd <project-name>
sudo npm install
bun run dev
```

After installation, you should simply delete the `app.vue` file from the route directory as quickly as possible so that you have an empty Nuxt page.

## External Libraries

Nuxt has a large eco-system of easy-installable modules like [Tailwindcss](https://nuxt.com/modules/tailwindcss) or [Pinia](https://nuxt.com/modules/pinia). You can find every module on the [Nuxt modules page](https://nuxt.com/modules) including documentation and installation instructions.

## Pages & Routing

Nuxt makes page creation and routing easy compared to Vue by doing it automatically. All you have to do is to create a `pages/` folder inside the root-directory of you project. The routing which causes of the folder structure is straight forward:

```
pages/
    index.vue -> example.com/
    about.vue -> example.com/about
    products/
        hello.vue -> example.com/products/about
```

### Routing with Params

Nuxt also makes it easy to use route parameters. All you need to do is create a file or a folder with the same name as the route parameter but enclosed in square brackets. You can access these parameters by using and destructuring `useRoute().params`.

```
pages/
    products/
        [id].vue -> e.g. example.com/products/12
```

```html
<template>
  <div>
    <p>Product details for {{ id }}</p>
  </div>
</template>

<script lang="ts" setup>
const { id } = useRoute().params;
</script>

<style></style>
```

### Linking Pages

Like Vue (`RouterLink`), Nuxt has its own tag for creating links that increases efficiency and stays true to the philosophy of single-page applications: the `NuxtLink` tag. Additionally, this tag adds HTML classes, such as `router-link-active` and `router-link-exact-active`, that can help you style your application.

```html
<NuxtLink to="/">Nuxt Dojo</NuxtLink>
```

## Layouts

Layouts define the basic template structure of a Nuxt application by wrapping the pages. For example, they can include headers and footers on every page, thus avoiding a lot of boilerplate code. To create the default layout, just create `layouts/default.vue` in the root directory.

```html
<template>
  <div>
    <header>
      <nav>
        <NuxtLink to="/">Nuxt Dojo</NuxtLink>
        <ul>
          <li>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/about">About</NuxtLink>
            <NuxtLink to="/products">Products</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <div>
      <!-- The slot tag is replaced by the actual content of the side -->
      <slot />
    </div>
  </div>
</template>
```

### Overriding the Default Layout

Sometimes you want to override the default layout, and guess what: it's not hard 🙂! You just need to create your new layout (e.g. "products.vue") in the "layouts/" folder and add this code on the page whose layout you want to override:

```ts
definePageMeta({
  layout: "products",
});
```

## Components

As in Vue, components can also be created in Nuxt, which have a big advantage or disadvantage depending on your perspective: they are imported automatically. This results in less boilerplate code if the components are in `components/`, but creates [this boilerplate code](https://stackoverflow.com/questions/74078596/how-do-i-register-components-in-subfolders-in-nuxt) if they are in a subfolder.

## Errors

### Handling

Error Handling in Nuxt is really straight forward. All we have to do is to create a `error.vue` component in the root directory.

```html
<template>
  <div class="mt-7 max-w-sm mx-auto text-center card">
    <p class="mt-7 text-7xl font-bold">{{ error.statusCode }}</p>
    <p class="mt-7 text-6xl">Ooops.</p>
    <p class="mt-7">{{ error.message }}</p>
    <button class="btn my-7" @click="handleError">Go Home...</button>
  </div>
</template>

<script setup>
// Accepts the error from Nuxt
defineProps({
  error: Object,
});

// Clearing the error
const handleError = () => clearError({ redirect: "/" });
</script>
```

### Throwing

Throwing error is obviously easier than handling them.

```js
throw createError({
  statusCode: 404,
  statusMessage: "Product not found",
  fatal: true,
});
```

## Server Routes

Nuxt Server Routes let you handle backend tasks directly within Nuxt.js, such as data processing, creating API endpoints, simple server-side authentication, and database interactions. They’re great for small to medium projects where a full backend like Django isn’t needed. However, for larger, more complex applications, a dedicated backend framework like Django is more scalable and robust. In this case they are still often used as proxies to avoid exposing sensible data to the frontend.

Server routes are created in the `server/api/` folder. Every endpoint is a seperate TypeScript file. You can access the server with e.g. `useFetch('/api/yourendpoint')`.

### GET-Requets

```ts
export default defineEventHandler((event) => {
  // Get query params
  const { name } = useQuery(event);

  return {
    message: `Hello, ${name}!`,
  };
});
```

### POST-Requests

```ts
// Post requests must be asynchronous to access the body.
export default defineEventHandler(async (event) => {
  const { name } = useQuery(event);

  // Get body
  const { age } = await useBody(event);

  return {
    message: `Hello, ${name}! You are ${age} years old.`,
  };
});
```

### Dynamic Routes

Like in the frontend you can also use dynamic routes, by naming your TypeScript in square brackets. These routes are then accessible in the endpoint:

```ts
// server/api/[code].ts
const { code } = event.context.params;
```

### Environment Variables

Server routes also allow us to use environment variables using `.env` files. Before we can use environment variables we have to define them in the `nuxt.config.ts` file.

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    variable: process.env.VARIABLE,
  },
});
```

After this we can use them in the backend.

```ts
const { variable } = useRuntimeConfig();
```

> Please note that you should use `$fetch` in the Nuxt "backend" instead of `useFetch` if you want to communicate with the real backend.

## Showing Off Knowledge

### Editing the Head

You can gloabally edit the HTML-head by editing the `nuxt.config.ts` file.

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Nuxt Dojo",
      meta: [{ name: "description", content: "Everything about Nuxt 3" }],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      ],
    },
  },
});
```

Or use `useHead` if you just want to change the head on a single page.

```ts
useHead({
  title: "Nuxt Dojo | Merch",
});
```

If you are a really cool frontend developer and want to stay with components use the [build-in components](https://nuxt.com/docs/getting-started/seo-meta#components), like `Head` or `Title`.


### Fetching Data - Which Method Should I Use?
When it comes to fetching data in Nuxt, many people (like me) are confused, because there are three different ways to fetch data: `useFetch`, `$fetch` and `useAsyncData`. 

That's why here’s a table comparing `useAsyncData`, `useFetch`, and `$fetch` in Nuxt.js:

| **Feature**        | **`useAsyncData`**                                | **`useFetch`**                                | **`$fetch`**                                     |
|--------------------|------------------------------------------------|-----------------------------------------------|------------------------------------------------|
| **Purpose**        | Fetch data before the page is rendered (SSR).  | Fetch data on both server (SSR) and client (CSR). | Fetch data dynamically after page render (CSR). |
| **Execution**      | Runs on server-side during SSR or static generation. | Automatically detects environment and runs on server or client. | Runs during client-side rendering.             |
| **Blocks Rendering**| Yes, blocks page rendering until data is fetched. | Blocks SSR, non-blocking on CSR.              | Non-blocking (runs after initial render).      |
| **Context Access** | Cannot access `this` in the component.          | Part of Vue 3 Composition API, can access all composable features. | Can access `this` and works within the component. |
| **When to Use**    | For static or pre-rendered data that must be available at the start. | For composable and flexible data fetching across environments. | For dynamic or client-side interactions where data is fetched post-render. |
| **Ideal For**      | Initial page load with server-rendered content. | Scenarios requiring data fetching both during SSR and CSR. | Client-side updates or interactive components. |

### Application Structure Utilities
You can find different application structure utilities in a Nuxt application: composables, plugins and utils. And I don't know if it's just my problem, but I find it incredible hard, do understand which one has which purpose. That's why I've created this table:

| **Feature**        | **Plugins**                                | **Composables**                             | **Utils**                                  |
|--------------------|--------------------------------------------|---------------------------------------------|--------------------------------------------|
| **Purpose**        | Extend Vue/Nuxt functionality globally by injecting dependencies or custom logic. | Reusable logic functions with Vue 3's Composition API for handling state or utilities. | General helper functions that are often imported directly into components. |
| **Scope**          | Globally available throughout the entire app. | Scoped to components that import them, promoting code modularity. | Scoped to components or specific logic areas where they are used. |
| **Lifecycle Access** | Can access Nuxt lifecycle hooks (`beforeNuxtRender`, `nuxtServerInit`). | Access to Vue 3 Composition API lifecycle hooks (e.g., `onMounted`). | Typically not lifecycle aware, but can be used within lifecycle hooks when needed. |
| **Use Case**       | Registering third-party libraries (e.g., Axios, Vuex). | Abstracting complex logic (e.g., state management, data fetching). | Utility functions like date formatting or data manipulation. |
| **Access Method**  | Automatically injected into components as `$` prefixed variables. | Imported explicitly in components and used as functions or state handlers. | Imported like standard JavaScript functions in any component. |
| **When to Use**    | For initializing third-party libraries or global-level logic. | For reusable, component-agnostic state or logic that is used across many parts of the app. | For small, utility-specific functions that do not rely on the Vue/Nuxt ecosystem. |
| **Global vs Local**| Global, available across the entire application. | Local to the components that use/import them. | Local, only imported where needed. |
| **Ideal For**      | Dependency injection, authentication, or initializing external services like APIs. | Sharing state, composable logic, and reusable pieces of functionality like data fetching. | Helper utilities like string manipulation, math operations, etc. |
