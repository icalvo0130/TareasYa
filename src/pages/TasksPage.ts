import { TaskService } from "../services/taskService";
import { AuthService } from "../services/authService";
import { Task } from "../types/types";

export class TasksPage extends HTMLElement {
  private unsubscribe: (() => void) | null = null;
  private currentUser: any = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.currentUser = AuthService.getCurrentUser();
    if (!this.currentUser) {
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        detail: { path: "/login" }
      }));
      return;
    }

    this.render();
    this.setupEventListeners();
    this.subscribeToTasks();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setupEventListeners() {
    const logoutBtn = this.shadowRoot?.querySelector("#logout-btn");
    logoutBtn?.addEventListener("click", () => this.handleLogout());


    this.addEventListener("task-created", (e) => {
      console.log("Task created event received!");

    });

    this.addEventListener("task-updated", (e) => {
      console.log("Task updated event received!");

    });
  }

  async handleLogout() {
    try {
      await AuthService.logout();
      this.dispatchEvent(new CustomEvent("route-change", {
        bubbles: true,
        detail: { path: "/login" }
      }));
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  subscribeToTasks() {
    if (!this.currentUser) return;

    console.log("Subscribing to tasks for user:", this.currentUser.uid);
    
    this.unsubscribe = TaskService.subscribeToUserTasks(
      this.currentUser.uid,
      (tasks: Task[]) => {
        console.log("Tasks received from Firebase:", tasks);
        this.updateTaskLists(tasks);
      }
    );
  }

  updateTaskLists(tasks: Task[]) {
    const pendingList = this.shadowRoot?.querySelector("#pending-list") as any;
    const completedList = this.shadowRoot?.querySelector("#completed-list") as any;

    console.log("Updating task lists with tasks:", tasks);
    
    if (pendingList) {
      console.log("Updating pending list");
      pendingList.setTasks(tasks);
    }
    if (completedList) {
      console.log("Updating completed list");
      completedList.setTasks(tasks);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .tasks-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        .header {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(67, 97, 238, 0.1);
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .app-title {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .welcome-text {
          font-size: 16px;
          color: #6b7280;
        }
        
        .logout-btn {
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .logout-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
        }
        
        .content {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        
        .form-section {
          flex: 0 0 350px;
        }
        
        .lists-section {
          flex: 1;
          display: flex;
          gap: 24px;
        }
        
        @media (max-width: 1200px) {
          .content {
            flex-direction: column;
          }
          
          .form-section {
            flex: none;
            width: 100%;
          }
          
          .lists-section {
            width: 100%;
            flex-direction: column;
          }
        }
      </style>
      
      <div class="tasks-container">
        <div class="header">
          <h1 class="app-title">TareasYa!</h1>
          <div class="user-info">
            <span class="welcome-text">Bienvenido, ${this.currentUser?.email}</span>
            <button id="logout-btn" class="logout-btn">Cerrar Sesión</button>
          </div>
        </div>
        
        <div class="content">
          <div class="form-section">
            <task-form></task-form>
          </div>
          
          <div class="lists-section">
            <task-list id="pending-list" status="pending"></task-list>
            <task-list id="completed-list" status="completed"></task-list>
          </div>
        </div>
      </div>
    `;
  }
}