const todoInput = document.querySelector('.todo-input');
const addButton = document.querySelector('.add-button');
const todoList = document.querySelector('.todo-list');


let todos = JSON.parse(localStorage.getItem('todos')) || [];


function updateDateTime() {
    const dayElement = document.querySelector('.day');
    const timeElement = document.querySelector('.time');
    const now = new Date();
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayElement.textContent = days[now.getDay()];
    
    timeElement.textContent = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}


updateDateTime();
setInterval(updateDateTime, 1000);


function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    todoItem.dataset.id = todo.id;

    todoItem.innerHTML = `
        <div class="todo-content">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text" style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.text}</span>
        </div>
        <div class="todo-actions">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    return todoItem;
}


function addTodo(text) {
    if (text.trim() !== '') {
        const todo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        todos.push(todo);
        saveTodos();
        todoList.appendChild(createTodoElement(todo));
        todoInput.value = '';
    }
}


function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    document.querySelector(`[data-id="${id}"]`).remove();
}

function editTodo(id, newText) {
    const todo = todos.find(todo => todo.id === id);
    if (todo && newText.trim()) {
        todo.text = newText;
        saveTodos();
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        todoItem.querySelector('.todo-text').textContent = newText;
    }
}


function toggleTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        const todoText = todoItem.querySelector('.todo-text');
        todoText.style.textDecoration = todo.completed ? 'line-through' : 'none';
    }
}

addButton.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text !== '') {
        addTodo(text);
    }
});

todoInput.addEventListener('keypress', (e) => {
    const text = todoInput.value.trim();
    if (e.key === 'Enter' && text !== '') {
        addTodo(text);
    }
});

todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;
    
    const id = parseInt(todoItem.dataset.id);

    if (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-btn')) {
        deleteTodo(id);
    }
    
    if (e.target.classList.contains('edit-btn') || e.target.parentElement.classList.contains('edit-btn')) {
        const newText = prompt('Edit task:', todoItem.querySelector('.todo-text').textContent);
        if (newText !== null) {
            editTodo(id, newText);
        }
    }
    
    if (e.target.classList.contains('todo-checkbox')) {
        toggleTodo(id);
    }
});



window.addEventListener('load', () => {
    todos.forEach(todo => {
        todoList.appendChild(createTodoElement(todo));
    });
});
