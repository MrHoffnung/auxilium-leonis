# Basics of Vue.js

<img src="https://cdn.iconscout.com/icon/free/png-256/free-vuejs-1175052.png" width="150px" height="auto">
<br>
Vue (pronounced /vjuː/, like view) is a JavaScript framework for building user interfaces. It builds on top of standard HTML, CSS, and JavaScript and provides a declarative, component-based programming model that helps you efficiently develop user interfaces of any complexity.
This markdown is based on the Vue Crash Course by Traversy Media.

## Table of Contents

- [Creating a Vue App](#creating-a-vue-app)
- [Project Structure](#project-structure)
- [Setting up the Project](#setting-up-the-project)
- [v-Directives](#v-directives)
  - [v-if, v-else-if, v-else](#v-if-v-else-if-v-else)
  - [v-bind](#v-bind)
  - [v-for](#v-for)
  - [v-on](#v-on)
- [Composition-API](#composition-api)
- [Forms & v-Model](#forms--v-model)
- [Reactivity in Vue.js](#reactivity-in-vuejs)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Tailwind CSS Setup](#tailwind-css-setup)
- [Props](#props)
  - [Hero.vue](#herovue)
  - [App.vue](#appvue)
- [Wrapper-Components](#wrapper-components)
- [The computed-Function](#the-computed-function)
- [Router](#router)
  - [Installation](#installation)
  - [Setting up the Router](#setting-up-the-router)
  - [Application in Main Application](#application-in-main-application)
  - [RouterView in App.vue](#routerview-in-appvue)
  - [User Based Routes](#user-based-routes)
  - [Router Links](#router-links)
  - [404 Route](#404-route)
  - [Parameters](#parameters)
  - [Sending Users](#sending-users)
- [JSON-APIs using Axios](#json-apis-using-axios)
- [Proxying](#proxying)
- [Spinner](#spinner)
  - [Installation](#installation-1)
  - [Import](#import)
  - [Usage](#usage)
- [Toasts](#toasts)
  - [Installation](#installation-2)
  - [Usage](#usage-1)

## Creating a Vue App

To create a new modern Vue app, use the following commands:

```bash
npm create vue@latest <Projektname>
cd <Projektname>
sudo npm install
npm run <Typ>
```

## Project Structure

### src

The main folder that contains the source code of your Vue application.

- **assets**: Contains static assets like images, fonts, etc.
- **components**: Hosts reusable Vue components
- **router**: Contains routing configuration files (if using Vue Router)
- **store**: Contains Vuex store files for state management (if using Vuex)
- **views**: Contains Vue components that render entire pages/views
- **App.vue**: The root component of your application
- **main.js**: The entry point of your application where Vue is initialized

### public

Contains publicly accessible files like index.html and favicon.ico

### tests

For unit and integration tests

### node_modules

Contains all npm packages installed for your project

### Configuration files

- **package.json**: Defines project dependencies and scripts
- **babel.config.js**: Configuration for the Babel transpiler
- **vue.config.js**: Vue CLI configuration file (optional)

### Additional useful folders for larger projects

- **constants**: For storing constant values ​​used throughout the application
- **utils**: For utility/helper functions
- **plugins**: For Vue plugins or third-party service integrations
- **locales**: For internationalization files if your app supports multiple languages

## Setting up the Project

Setting up a Vue.js project involves the following main steps:

### Initialization

The main app instance is created in the main.js file. This is where the CSS file is imported, the Vue app is initialized using createApp and bound to the DOM element with the ID 'app'.

```js
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

### HTML Structure

The index.html file serves as the entry point. It contains a `div` with the ID 'app', into which Vue renders the app.
The main.js is integrated as a module using a `script` tag.

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite App</title>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>

</html>
```

### Component Structure

The App.vue file defines the main component. It consists of three parts:

- <script>: Contains the logic of the component (data and methods)
- <template>: Defines the HTML markup of the component
- <style>: Contains component-specific CSS styles

```js
<script>
export default {
  data() {
    return {
      // Variables go here
    };
  },

  methods() {
	// Methods go here
  }
}
</script>

<template>
  <h1>{{ Variable }}</h1>
</template>

<style scoped>
h1 {
  color: #42b983;
}
</style>
```

## v-Directives

Vue.js provides powerful v-directives for dynamic template manipulation:

### v-if, v-else-if, v-else

Enables conditional rendering of elements:

```js
<p v-if="status === 'active'">Request Active</p>
<p v-else-if="status === 'pending'">Request Pending</p>
<p v-else="status === 'active'">Request Failed</p>
```

### v-bind

Dynamically binds attributes or component props:

```html
<a v-bind:href="link">Google</a>
```

Shorthand: `:` instead of `v-bind`:

### v-for

Renders list items based on an iterable object:

```js
<ul>
  <li v-for="task in tasks" v-bind:key="task">
    {{ task }}
  </li>
</ul>
```

### v-on

Adds event listeners:

```js
<button v-on:click="status = !status">Toggle</button>
```

**Short form**: `@` instead of `v-on:` <br>
**Note**: Use `@submit.prevent` for submit events to prevent standard form behavior. <br><br>
These optimized v-directives significantly improve the readability and efficiency of the Vue.js template.

### Composition-API

The Compositions API represents the structure of a Vue template.

```js
<script setup>
import { ref } from 'vue';

const name = ref('John Doe');
const status = ref('active');
const tasks = ref(['Task One', 'Task Two', 'Task Three', 'Task Four']);
const link = ref('https://google.com');

const toggleStatus = () => {
  if (status.value === 'active') {
    status.value = 'pending';
  } else if (status.value === 'pending') {
    status.value = 'inactive';
  } else {
    status.value = 'active';
  }
};
</script>
```

The Composition API offers improved typing, good code reusability and a clear structure for complex components.

## Forms & v-Model

The v-Model directive enables bidirectional data binding between form elements and component data.

```js
<script setup>
import { ref } from 'vue';

const tasks = ref(['Task One', 'Task Two', 'Task Three', 'Task Four']);
const newTask = ref('');

const addTask = () => {
  if (newTask.value.trim() !== '') {
    tasks.value.push(newTask.value);
    newTask.value = '';
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

## Reactivity in Vue.js

Reactivity enables automatic UI updates when data changes.

- **reactive**: For complex, nested objects.
- **ref**: For primitive values ​​and simple objects/arrays.

## Lifecycle Hooks

Important component lifecycle hooks:

- **beforeCreate:** Logs a message before the instance is initialized.
- **created:** Logs a message after the instance is created and the data is available.
- **beforeMount:** Logs a message before the template is attached to the DOM.
- **mounted:** Logs a message after the template is in the DOM.
- **beforeUpdate:** Logs a message before reactive data triggers the DOM update.
- **updated:** Logs a message after the DOM update has occurred.
- **beforeUnmount:** Logs a message before the instance is destroyed.
- **unmounted:** Logs a message after the instance is destroyed.

A lifecycle hook can be used as follows:

```js
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Komponente montiert');
});

onUpdated(() => {
  console.log('Komponente aktualisiert');
});

onUnmounted(() => {
  console.log('Komponente entfernt');
});
</script>
```

## Tailwind CSS Setup

The following tutorial shows how to integrate Tailwind CSS into Vue: [Tailwind Integration Tutorial](https://v2.tailwindcss.com/docs/guides/vue-3-vite)

## Props

Vue Props allow you to pass data from a parent component to a child component. Here is a simple example with two components: `Hero.vue` and `App.vue`.

### Hero.vue

```js
<script setup>
import { defineProps } from 'vue'

defineProps({
    title: {
        type: String,
        default: 'Become a Vue Dev',
    },
    subtitle: {
        type: String,
        default: 'Find the Vue job that fits your skills and needs',
    },
})
</script>

<template>
    <section class="bg-green-700 py-20 mb-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            <div class="text-center">
                <h1 class="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                    {{ title }}
                </h1>
                <p class="my-4 text-xl text-white">

                    {{ subtitle }}
                </p>
            </div>
        </div>
    </section>
</template>
```

### App.vue

```js
<script setup>
import Hero from '@/components/Hero.vue'
</script>

<template>
  <Navbar />
  <Hero title="Test" subtitle="Test"/>
</template>
```

## Wrapper-Components

Wrapper components in Vue allow you to use components like normal HTML tags (e.g. `p` or `span`). This is made possible by the `slot` tag.

```js
<script setup>
defineProps({
    background: {
        type: String,
        default: 'bg-gray-100',
    },
})
</script>

<template>
    <div v-bind:class="`${background} p-6 rounded-lg shadow-md`">
        <slot></slot>
    </div>
</template>
```

## The computed-Function

`computed` in Vue.js is used to calculate reactive values ​​based on other reactive sources and stores the results for optimization. It is updated only when one of its dependencies changes, which avoids unnecessary calculations and improves performance.

```js
<template>
  <p>Original Wert: {{ number }}</p>
  <p>Verdoppelter Wert: {{ doubledNumber }}</p>
</template>

<script setup>
import { ref, computed } from 'vue';

const number = ref(5);
const doubledNumber = computed(() => number.value * 2);
</script>
```

## Router

The router in Vue.js allows navigating between different views or pages within a single-page application (SPA). The `vue-router` library is used to configure and manage these routes.

### Installation

```bash
npm install vue-router
```

### Setting up the Router

```js
// router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

### Application in Main Application

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
```

### RouterView in App.vue

```js
<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>
```

### User Based Routes

To create a route that depends on a user's input in the URL, you can use the path e.g. `/jobs/:id`.

### Router Links

Like the a tag, router links offer navigation between pages. However, they do not expect an `href` but rather a `to` attribute, which points to the view.

```js
<script setup>

import logo from '@/assets/img/logo.png';
import { RouterLink, useRoute } from 'vue-router';

const isActiveLink = (route) => {
  const currentRoute = useRoute();
  return route === currentRoute.path;
}

</script>

<template>
  <nav class="bg-green-700 border-b border-green-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" v-bind:src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2">Vue Jobs</span>
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink to="/" :class="[isActiveLink('/') ? 'bg-green-900' : 'hover:bg-gray-900 hover:text-white', 'text-white', 'px-3', 'py-2', 'rounded-md']">Home</RouterLink>
              <RouterLink to="/jobs" :class="[isActiveLink('/jobs') ? 'bg-green-900' : 'hover:bg-gray-900 hover:text-white', 'text-white', 'px-3', 'py-2', 'rounded-md']">Jobs
              </RouterLink>
              <RouterLink to="/jobs/add" :class="[isActiveLink('/jobs/add') ? 'bg-green-900' : 'hover:bg-gray-900 hover:text-white', 'text-white', 'px-3', 'py-2', 'rounded-md']">Add
                Job</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
```

### 404 Route

To catch a page not found (Error 404), you can define a route that catches all routes that are not
defined:

```js
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: "/:catchAll(.*)*",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});
```

### Parameters

To access the parameters of a route you can do the following:

```js
import { useRoute } from "vue-router";

const route = useRoute();

const jobId = route.params.id;
```

### Sending Users

To send users (send them on a route), you can execute the following code:

```js
import router from "@/router";

router.push(`/jobs/${response.data.id}`);
```

## JSON-APIs using Axios

Axios ist eine alternative zu Fetch-Anfragen. Um axios nutzen zu können, muss es zuerst installiert werden:

```bash
npm install axios
```

Here is an example of how to use axios:

```js
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:5000/jobs");
    state.jobs = response.data;
  } catch (error) {
    console.error("Error fetching jobs", error);
  } finally {
    state.isLoading = false;
  }
});
```

In general, Axios has all RESTful requests (post, get, put, delete).

## Proxying

When you deploy the site, you want to avoid hardcoding sensitive addresses for communication with the backend. That's why you use proxies. These are defined in `vite.config.js`.

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

## Spinner

Vue Spinners are animated loading indicators used in Vue.js applications to provide visual feedback to the user while content is loading. There are several different types of Vue Spinners including top, ring, dot and bar spinners, all of which can be easily integrated into an application using Vue components or third-party libraries such as "vue-spinner" by including and configuring them in the template syntax.

### Installation

```bash
npm install vue-spinner
```

### Import

```js
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
```

### Usage

Like a normal component

## Toasts

Toasts are short, temporary notifications or messages that usually appear at the bottom of the screen and automatically disappear after a short time.

### Installation

```bash
npm install vue-toastification@next
```

### Usage

```js
import { useToast } from "vue-toastification";

const toast = useToast();

toast.success("Job edited successfully");
```
