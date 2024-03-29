const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskText');
const todoList = document.querySelector('#todoList');
const emptyList = todoList.querySelector('#emptyList');
const clearCacheBtn = document.querySelector('#clearCache');

taskForm.addEventListener('submit', addTask);
todoList.addEventListener('click', toggleCompleteTask);
todoList.addEventListener('click', deleteTask);
clearCacheBtn.addEventListener('click', clearCacheFromLS);

const tasks = [];
const tasksFromLS = JSON.parse(localStorage.getItem('tasks'));
if (tasksFromLS) {
    tasks.push(...tasksFromLS);
    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        renderTask(task);
    }
}

function addTask(evt) {
    evt.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText.length == 0) {
        return;
    }
    const task = {
        id: crypto.randomUUID(),
        text: taskText,
        isCompleted: false,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    renderTask(task);

    taskInput.value = '';
    taskInput.focus();
}

function toggleCompleteTask(evt) {
    if (evt.target.dataset.action !== 'done') {
        return;
    }
    const doneBtn = evt.target;
    const parentLi = doneBtn.closest('li');
    const taskId = parentLi.id;
    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        if (task.id == taskId) {
            //                 !false => true
            //                 !true  => false
            task.isCompleted = !task.isCompleted;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            break;
        }
    }

    parentLi.classList.toggle('text-decoration-line-through');
    parentLi.classList.toggle('bg-light');
}

function deleteTask(evt) {
    if (evt.target.dataset.action !== 'remove') {
        return;
    }
    const deleteBtn = evt.target;
    const parentLi = deleteBtn.closest('li');
    const taskId = parentLi.id;
    for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        if (task.id == taskId) {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            break;
        }
    }

    parentLi.remove();

    if (todoList.children.length == 1) {
        emptyList.classList.remove('d-none');
    }
}

function renderTask(task) {
    const classesForCompleted = task.isCompleted ? 'text-decoration-line-through bg-light' : '';

    todoList.insertAdjacentHTML(
        'beforeend',
        `
    <li id="${task.id}" class="list-group-item d-flex gap-2 align-items-center ${classesForCompleted}">
          ${task.text}
          <button data-action="done" class="ms-auto btn btn-sm btn-outline-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-check2-square" viewBox="0 0 16 16">
              <path
                d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z" />
              <path
                d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
            </svg>
          </button>
          <button data-action="remove" class="btn btn-sm btn-outline-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3"
              viewBox="0 0 16 16">
              <path
                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
            </svg> 
          </button>
        </li>
    `
    );
    if (todoList.children.length > 1) {
        emptyList.classList.add('d-none');
    }
}

function clearCacheFromLS() {
    const agree = confirm('Вы уверены? Это удалит все ваши данные о задач');
    if (agree) {
        localStorage.clear();
        window.location.reload();
    }
}

