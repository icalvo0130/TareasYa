import { Task } from "../types/types";
import { TaskService } from "../services/taskService";

export class TaskCard extends HTMLElement {
    private task?: Task;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.task = JSON.parse(this.getAttribute("task-data") || "{}");
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const completeBtn = this.shadowRoot?.querySelector(".complete-btn");
    const deleteBtn = this.shadowRoot?.querySelector(".delete-btn");

    completeBtn?.addEventListener("click", () => this.toggleComplete());
    deleteBtn?.addEventListener("click", () => this.deleteTask());
  }

  async toggleComplete() {
    try {
      const newStatus = this.task?.status === "pending" ? "completed" : "pending";
      await TaskService.updateTaskStatus(this.task?.id!, newStatus);
      
      this.dispatchEvent(new CustomEvent("task-updated", { 
        bubbles: true, 
        composed: true,
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async deleteTask() {
    try {
      await TaskService.deleteTask(this.task?.id!);
      this.dispatchEvent(new CustomEvent("task-updated", { 
        bubbles: true, 
        composed: true 
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    const isCompleted = this.task?.status === "completed";
    
    this.shadowRoot.innerHTML = `
      <style>
        .task-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(67, 97, 238, 0.1);
          border-left: 4px solid ${isCompleted ? '#8b5cf6' : '#a78bfa'};
          transition: all 0.3s ease;
        }
        
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(67, 97, 238, 0.15);
        }
        
        .task-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
          text-decoration: ${isCompleted ? 'line-through' : 'none'};
          opacity: ${isCompleted ? '0.7' : '1'};
        }
        
        .task-description {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
          text-decoration: ${isCompleted ? 'line-through' : 'none'};
          opacity: ${isCompleted ? '0.7' : '1'};
        }
        
        .task-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .complete-btn {
          background: ${isCompleted ? '#8b5cf6' : '#a78bfa'};
          color: white;
        }
        
        .complete-btn:hover {
          background: ${isCompleted ? '#7c3aed' : '#8b5cf6'};
        }
        
        .delete-btn {
          background: #ef4444;
          color: white;
        }
        
        .delete-btn:hover {
          background: #dc2626;
        }
      </style>
      
      <div class="task-card">
        <div class="task-title">${this.task?.titulo}</div>
        <div class="task-description">${this.task?.descripcion}</div>
        <div class="task-actions">
          <button class="btn complete-btn">
            ${isCompleted ? 'Marcar Pendiente' : 'Completar'}
          </button>
          <button class="btn delete-btn">Eliminar</button>
        </div>
      </div>
    `;
  }
}