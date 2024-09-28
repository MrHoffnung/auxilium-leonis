import { defineStore } from "pinia";

interface Task {
  id: string;
  title: string;
  isFavorite: boolean;
}

export const useTaskStore = defineStore({
  id: "taskStore",
  state: () => ({
    tasks: [] as Task[],
    message: "Hello, Pinia!",
  }),
  actions: {},
});
