# State Management

<img src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Pinialogo.svg" width="150px" height="auto">
<br>

> Based on the youtube playlist [Pinia Crash Course](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hp28dYyYBy3xoOdoeNw-hD) by [Net Ninja](https://www.youtube.com/@NetNinja) and the blog entry [Understanding useState in Nuxt 3](https://masteringnuxt.com/blog/understanding-usestate-in-nuxt-3) by [Mastering Nuxt](https://masteringnuxt.com/).

## What Is State Management?

> "State management is a way to handle and track changes to data (state) within an application. It ensures that components have consistent and synchronized data, making it easier to manage complex interactions. State management is essential for apps with dynamic user interfaces, where multiple components depend on the same data."

## Installing Pinia

Install Pinia by running:

```sh
# Vue
bun install pinia

# Nuxt
npx nuxi@latest module add pinia
```

## Your First Store
Pinia stores are typically created in the `stores/` folder inside the root directory. The store file name is written in PascalCase. A simple store looks like the following:

```ts
// ./stores/MySuperStore.ts
import { defineStore } from "pinia";

export const useMySuperStore = defineStore({
  id: "mySuperStore",
  state: () => ({
    message: "Hello, Pinia!"
  }),
  actions: {
    // Actions here
  },
});
```

## Accessing Store State

### By Property
Accessing properties of a store is straight-forward.

```html
<template>
{{ mySuperStore.message }}
<!-- Hello, Pinia! -->
</template>

<script lang="ts" setup>
const mySuperStore = useMySuperStore();
</script>
```

### By Getter
Let's say we have have a list of numbers. Sometimes we want to get only numbers, that are greater than $10$. Pinia's getters make this really easy for us.

```ts

export const useNumberStore = defineStore({
  id: "numberStore",
  state: () => ({
    numbers: number[],
  }),
  getters: {
    largeNums(): number[] {
        return this.numbers.filter(number => number > 10);
    }
    // You can access the getter in a template by using `numberStore.largeNums`
  }
});
```

## Modifying Store State
To modify the state of a store, Pinia uses the so called _actions_. Let's reuse our number-store from the [previous sections](#accessing-store-state).

```ts
export const useNumberStore = defineStore({
  id: "numberStore",
  state: () => ({
    numbers: number[],
  }),
  getters: {
    largeNums(): number[] {
        return this.numbers.filter(number => number > 10);
    }
  },
  actions: {
    addNumber(num: number) {
        this.numbers.push(num)
    }
    // You can add new elements to the list in a template
    // by using e.g. `numberStore.addNumber(3)`
  },
});
```

## Nuxt Only: useState

Nuxt's `useState` composable has two different use cases:

1. Client-side: sharing state between multiple components
2. Server-side: sharing state from server to client

### Client-Side

```ts
// ComponentA.vue
const message = useState<string>("message", () => "Hello");

// ComponentB.vue
const sharedMessage = useState<string>("message");
```

### Server-Side

If you want to learn about `useState` in the server-side context, check out [this blog entry](https://masteringnuxt.com/blog/understanding-usestate-in-nuxt-3).

### useState vs Pinia

While Pinia is a complete state management library, `useState` only has a key-value store. Therefore, unlike Pinia, `useState` is not suitable if it goes beyond a simple state.


## Showing Off Knowledge

### Resetting State
Pinia offers the `$reset` method to easily reset a store to it's defaults. It can be called using e.g. `numberStore.$reset`. This method __can__ be overwritten.

### Store To Refs
You are too lazy to always type out e.g. `numberStore.numbers`? No problem, Pinia got you. Just use the `storeToRefs` function. But be aware, that there might be complications if you try to use actions. If you want to use actions, you can't be lazy!

```ts
import { storeToRefs } from "pinia";

const { numbers } = storeToRefs(numberStore)
// You can use `numbers` now without called `numberStore`
```