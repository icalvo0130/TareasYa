import { TaskService } from "../services/taskService";
import { AuthService } from "../services/authService";

export class TaskForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.shadowRoot?.querySelector("#task-form");
    form?.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e: Event) {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    if (!form) return;
    
    const formData = new FormData(form);
    const titulo = formData.get("titulo") as string;
    const descripcion = formData.get("descripcion") as string;
    
    if (!titulo.trim()) return;
    
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser) return;
      
      await TaskService.createTask(titulo, descripcion, currentUser.uid);
      
      form.reset();
      
      this.dispatchEvent(new CustomEvent("task-created", { 
        bubbles: true, 
        composed: true
      }));

    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .form-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(67, 97, 238, 0.1);
          margin-bottom: 24px;
        }
        
        .form-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }
        
        input, textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
        }
        
        input:focus, textarea:focus {
          outline: none;
          border-color: #8b5cf6;
        }
        
        textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #8b5cf6, #a78bfa);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .submit-btn:hover {
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
          transform: translateY(-1px);
        }
      </style>
      
      <div class="form-container">
        <h2 class="form-title">Crear Nueva Tarea</h2>
        <form id="task-form">
          <div class="form-group">
            <label for="titulo">Título *</label>
            <input type="text" id="titulo" name="titulo" required>
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" placeholder="Descripción opcional..."></textarea>
          </div>
          <button type="submit" class="submit-btn">Crear Tarea</button>
        </form>
      </div>
    `;
  }
}