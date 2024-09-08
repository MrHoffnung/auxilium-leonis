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

```vue
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

```vue
<NuxtLink to="/">Nuxt Dojo</NuxtLink>
```

## Layouts

Layouts define the basic template structure of a Nuxt application by wrapping the pages. For example, they can include headers and footers on every page, thus avoiding a lot of boilerplate code. To create the default layout, just create `layouts/default.vue` in the root directory.

```vue
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

```vue
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
