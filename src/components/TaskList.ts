export class TaskList extends HTMLElement {
  private tasks: any[] = [];
  private status: 'pending' | 'completed' = 'pending';

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.status = (this.getAttribute("status") as 'pending' | 'completed') || 'pending';
    this.render();
  }

  setTasks(tasks: any[]) {
    console.log(`Setting tasks for ${this.status} list:`, tasks);
    

    this.tasks = tasks.filter(task => {
      console.log(`Task ${task.titulo} has status: ${task.status}`);
      return task.status === this.status;
    });
    
    console.log(`Filtered ${this.status} tasks:`, this.tasks);
    this.renderTasks();
  }

  render() {
    if (!this.shadowRoot) return;

    const title = this.status === 'pending' ? 'En Proceso' : 'Completadas';
    
    this.shadowRoot.innerHTML = `
      <style>
        .list-container {
          flex: 1;
          margin: 0 12px;
        }
        
        .list-header {
          background: ${this.status === 'pending' ? '#8b5cf6' : '#6b7280'};
          color: white;
          padding: 16px;
          border-radius: 12px 12px 0 0;
          text-align: center;
          font-size: 18px;
          font-weight: 600;
        }
        
        .list-content {
          background: #f8fafc;
          min-height: 400px;
          padding: 16px;
          border-radius: 0 0 12px 12px;
          border: 2px solid ${this.status === 'pending' ? '#8b5cf6' : '#6b7280'};
          border-top: none;
        }
        
        .tasks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .empty-state {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 40px 20px;
        }
      </style>
      
      <div class="list-container">
        <div class="list-header">${title}</div>
        <div class="list-content">
          <div class="tasks-grid" id="tasks-container">
            <div class="empty-state">No hay tareas ${this.status === 'pending' ? 'pendientes' : 'completadas'}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderTasks() {
    const container = this.shadowRoot?.querySelector("#tasks-container");
    if (!container) return;

    console.log(`Rendering ${this.tasks.length} tasks for ${this.status} list`);

    if (this.tasks.length === 0) {
      container.innerHTML = `<div class="empty-state">No hay tareas ${this.status === 'pending' ? 'pendientes' : 'completadas'}</div>`;
      return;
    }

    container.innerHTML = "";
    this.tasks.forEach(task => {
      console.log(`Creating task card for:`, task);
      const taskCard = document.createElement("task-card");
      taskCard.setAttribute("task-data", JSON.stringify(task));
      container.appendChild(taskCard);
    });
  }
}