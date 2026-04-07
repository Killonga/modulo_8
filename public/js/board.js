document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.querySelector('.row.g-4');
    
    // Initial Load
    loadTasks();

    // Event Delegation for Kanban Actions
    boardContainer?.addEventListener('click', async (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.getAttribute('data-action');
        const taskId = target.getAttribute('data-task-id');

        if (action === 'delete') {
            console.log('Action: Delete task', taskId);
            const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
            if (res.ok) {
                console.log('Task deleted successfully');
                loadTasks();
            } else {
                console.error('Delete failed', await res.text());
            }
        } 
        else if (action === 'move-status') {
            const status = target.getAttribute('data-status');
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) loadTasks();
        }
        else if (action === 'add-comment') {
            const input = document.getElementById(`comment-input-${taskId}`);
            const text = input.value.trim();
            if (!text) return;

            const res = await fetch(`/api/tasks/${taskId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (res.ok) {
                input.value = '';
                loadTasks();
            }
        }
    });

    // Handle Task Form Submission
    document.getElementById('addTaskForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const res = await fetch('/api/tasks', {
            method: 'POST',
            body: formData
        });
        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
            e.target.reset();
            loadTasks();
        } else {
            const error = await res.json();
            alert('Error: ' + (error.error || 'No se pudo crear la tarea'));
        }
    });
});

async function loadTasks() {
    try {
        const res = await fetch('/api/tasks');
        if (res.status === 401) return window.location.href = '/login';
        const tasks = await res.json();
        
        const cols = {
            'todo': document.getElementById('col-todo'),
            'in-progress': document.getElementById('col-in-progress'),
            'done': document.getElementById('col-done')
        };
        
        if (!cols.todo) return; // Not on board page

        if (!Array.isArray(tasks)) {
            console.error('Error: tasks is not an array', tasks);
            return;
        }

        const counts = { 'todo': 0, 'in-progress': 0, 'done': 0 };
        Object.values(cols).forEach(c => c.innerHTML = '');

        tasks.forEach(task => {
            counts[task.status]++;
            const div = document.createElement('div');
            div.className = 'card card-task p-3 transition-all';
            
            let nextStatus = null;
            let nextLabel = '';
            if (task.status === 'todo') { nextStatus = 'in-progress'; nextLabel = 'Avanzar'; }
            else if (task.status === 'in-progress') { nextStatus = 'done'; nextLabel = 'Finalizar'; }

            // Enhanced Comments UI
            const commentsHtml = (task.comments || []).slice(0, 3).map(c => `
                <div class="comment-item mb-2 p-2 rounded bg-opacity-10 bg-light border-start border-primary border-4">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="fw-bold text-primary small">${c.user?.username || 'Usuario'}</span>
                        <span class="text-white-50 tiny" style="font-size: 0.6rem;">${new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div class="comment-text text-white small">${c.text}</div>
                </div>
            `).join('');

            div.innerHTML = `
                <div class="d-flex justify-content-between mb-2">
                    <h6 class="fw-bold mb-0">${task.title}</h6>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-link text-danger p-0 border-0 op-70 hover-op-100 transition-all border-0" 
                           data-action="delete" data-task-id="${task.id}" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                        <div class="dropdown">
                            <i class="bi bi-three-dots text-white cursor-pointer" data-bs-toggle="dropdown"></i>
                            <ul class="dropdown-menu border-0 shadow">
                                <li><a class="dropdown-item small" href="#" data-action="move-status" data-task-id="${task.id}" data-status="todo">Pendiente</a></li>
                                <li><a class="dropdown-item small" href="#" data-action="move-status" data-task-id="${task.id}" data-status="in-progress">Progreso</a></li>
                                <li><a class="dropdown-item small" href="#" data-action="move-status" data-task-id="${task.id}" data-status="done">Completado</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item small text-danger" href="#" data-action="delete" data-task-id="${task.id}">Eliminar</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                ${task.imageUrl ? `
                    <div class="task-image-container mb-3 overflow-hidden rounded-3" style="max-height: 150px;">
                        <img src="${task.imageUrl}" class="w-100 h-100 object-fit-cover shadow-sm hover-scale-110 transition-all cursor-pointer" 
                             alt="Imagen de tarea" data-bs-toggle="modal" data-bs-target="#imageModal-${task.id}">
                    </div>
                ` : ''}
                <p class="text-white-50 small mb-3">${task.description || 'Sin descripción'}</p>
                
                <div class="comments-section mb-3">
                    <div class="comments-list mb-2">${commentsHtml}</div>
                    <div class="input-group input-group-sm">
                        <textarea class="form-control border-0 bg-dark text-white p-2" id="comment-input-${task.id}" placeholder="Escribe un comentario..." rows="1" style="font-size: 0.8rem;"></textarea>
                        <button class="btn btn-primary" data-action="add-comment" data-task-id="${task.id}">
                            <i class="bi bi-chat-dots-fill"></i>
                        </button>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    ${nextStatus ? `
                        <button class="btn btn-primary btn-sm rounded-pill w-100 py-2 small" data-action="move-status" data-task-id="${task.id}" data-status="${nextStatus}">
                            <i class="bi bi-arrow-right-circle me-1"></i> ${nextLabel}
                        </button>
                    ` : `
                        <button class="btn btn-outline-success btn-sm rounded-pill w-100 py-2 small disabled">
                            <i class="bi bi-check-circle me-1"></i> Completado
                        </button>
                    `}
                </div>
            `;
            cols[task.status].appendChild(div);
        });

        document.getElementById('todo-count').textContent = counts.todo;
        document.getElementById('progress-count').textContent = counts['in-progress'];
        document.getElementById('done-count').textContent = counts.done;
    } catch (err) {
        console.error('Error loading tasks:', err);
    }
}
