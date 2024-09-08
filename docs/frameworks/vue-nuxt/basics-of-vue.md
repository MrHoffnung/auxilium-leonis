# Basics of Vue.js

<img src="https://cdn.iconscout.com/icon/free/png-256/free-vuejs-1175052.png" width="150px" height="auto">
<br>

## Disclaimer

Like all of my cheatsheets, this one is not guaranteed to be correct. The official documentation for Vue can be found [here](https://vuejs.org/).

## Creating a Vue App

To create a new Vue app with `npm`, use the following commands:

```bash
npm create vue@latest <project-name>
cd <project-name>
sudo npm install
npm run dev
```

## The Vue Component

Almost everything in Vue is a component. Any Vue component of three parts:

- `<script>`: Contains the logic of the component (data and methods)
- `<template>`: Defines the HTML markup of the component
- `<style>`: Contains component-specific CSS styles

```vue
<script setup></script>

<template>
  <h1>{{ foo }}</h1>
</template>

<style scoped>
h1 {
  color: #42b983;
}
</style>
```

<br>

A component can also wrap around other components using the `slot` tag.

```vue
<script setup>
defineProps({
  background: {
    type: String,
    default: "bg-gray-100",
  },
});
</script>

<template>
  <div v-bind:class="`${background} p-6 rounded-lg shadow-md`">
    <slot />
  </div>
</template>
```

## Directives

Vue provides many powerful directives for dynamic template manipulation. Here we cover only the most important ones. You can find a full list of them in the [Vue documentation](https://vuejs.org/api/built-in-directives.html). These optimized directives significantly improve the readability and efficiency of a Vue component.

### Conditionals

You can implement conditional logic into components by using `v-if`, `v-else` and `v-else-if`.

```vue
<p v-if="status === 'active'">Request Active</p>
<p v-else-if="status === 'pending'">Request Pending</p>
<p v-else="status === 'active'">Request Failed</p>
```

### Binding Expressions

Dynamically bind one or more attributes, or a component prop to an expression.

```html
<img v-bind:src="imageSrc" />

<!-- Shorthand -->
<img :src="imageSrc" />
```

### Loops

Vue supports looping over elements using `v-for`.

```js
<ul>
  <li v-for="task in tasks" :key="task">
    {{ task }}
  </li>
</ul>
```

### Events

Vue makes adding events to a component really easy, by using the `@` symbol.

```js
<button @:click="status = !status">Toggle</button>
```

### Forms

Efficient form handling in Vue is possible by using the `v-model` directive which creates a two-way data binding between a value in our template and a value in our data properties.

```vue
<script setup>
import { ref } from "vue";

const tasks = ref(["Task One", "Task Two", "Task Three", "Task Four"]);
const newTask = ref("");

const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push(newTask.value);
    newTask.value = "";
  }
};
</script>

<template>
  <form @submit.prevent="addTask">
    <label for="newTask">Add task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask" />
    <button type="submit">Submit</button>
  </form>

  <h3>Tasks:</h3>
  <ul>
    <li v-for="task in tasks" :key="task">
      {{ task }}
    </li>
  </ul>
</template>
```

## Reactivity

Reactivity enables automatic UI updates when data changes.

- `reactive/`: For complex, nested objects.
- `ref/`: For primitive values ​​and simple objects/arrays.

```js
import { ref, reactive } from "vue";

const count = ref(0);
const state = reactive({ count: 0 });
```

## Lifecycle Hooks

Vue automatically executes lifecycle hooks on various events. You can find a list of these lifecycle hooks in the [documentation](https://vuejs.org/api/composition-api-lifecycle).

```js
import { onMounted } from "vue";

onMounted(() => {
  // Do something
});
```

## Props

Vue Props allow you to pass data from a parent component to a child component.

```vue
<!-- Child component -->
<script setup>
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    default: "Become a Vue Dev",
  },
});
</script>

<template>
  <h1>
    {{ title }}
  </h1>
</template>
```

```vue
<!-- Parent component -->
<script setup>
import Hero from "@/components/Hero.vue";
</script>

<template>
  <Navbar />
  <Hero title="Test" />
</template>
```

## Efficient Computing

Because of the single-page functionality, it would not be a good idea to perform calculations every time _something_ changes. The `computed` function ensures that expressions are only updated when one of their dependencies changes.

```vue
<template>
  <p>Original Wert: {{ number }}</p>
  <p>Verdoppelter Wert: {{ doubledNumber }}</p>
</template>

<script setup>
import { ref, computed } from "vue";

const number = ref(5);
const doubledNumber = computed(() => number.value * 2);
</script>
```

## Router

The router in Vue.js allows navigating between different views or pages within a single-page application (SPA). The `vue-router` library is used to configure and manage these routes.

### Installation & Setup

```bash
npm install vue-router
```

```js
// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home.vue";
import JobsView from "@/views/Jobs.vue";
import NotFoundView from "@/views/NotFound.vue";

// Here we define all our routes
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/jobs",
    name: "Jobs",
    component: JobsView,
  },

  // This defines a 404 view
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
```

```js
<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>
```

### Route Params

To create a route with route params, you can use this syntax in the path: `/jobs/:id`. It's also possible to access these parameters in the template.

```js
import { useRoute } from "vue-router";

const route = useRoute();
const jobId = route.params.id;
```

### Router Links

Like the anchor tag (`a`), router links offer navigation between pages. However, they do not expect an `href` but rather a `to` attribute, which points to the view.

```vue
<RouterLink to="/jobs">Jobs</RouterLink>
```

### Pushing Users

It is possible to push users from one route to another.

```js
import router from "@/router";

router.push(`/jobs/${response.data.id}`);
```

## Showing Off Knowledge

### Proxying

To avoid hardcoding the backend ip-address you can use proxies. Proxies are defined in `vite.config.js`.

```js
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      // /api is now a proxy to our backend.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

### Spinner

Spinners are animated loading indicators used in Vue.js applications to provide visual feedback to the user while content is loading. There are several different types of Vue Spinners including top, ring, dot and bar spinners, all of which can be easily integrated into an application using Vue components or third-party libraries such as "vue-spinner" by including and configuring them in the template syntax.

```bash
npm install vue-spinner
```

```vue
<script setup>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
</script>

<template>
  <PulseLoader />
</template>
```

### Toasts

Toasts are short, temporary notifications or messages that usually appear at the bottom of the screen and automatically disappear after a short time.

```bash
npm install vue-toastification@next
```

```js
import { useToast } from "vue-toastification";

const toast = useToast();

toast.success("Job edited successfully");
```
