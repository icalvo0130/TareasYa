import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskCard } from "./components/TaskCard";
import { LoginForm } from "./pages/LoginForm";
import { TasksPage } from "./pages/TasksPage";
import RootApp from "./Root/Root";

customElements.define("task-form", TaskForm);
customElements.define("task-list", TaskList);
customElements.define("task-card", TaskCard);
customElements.define("login-form", LoginForm);
customElements.define("tasks-page", TasksPage);
customElements.define("root-app", RootApp)

export {
  RootApp,
  LoginForm,
  TasksPage,
  TaskCard,
  TaskForm,
  TaskList
};