const newTodo = document.querySelector("#new-todo");
const btnEnter = document.querySelector("#btn-enter");
const listNotReady = document.querySelector("#list-not-ready");
const listReady = document.querySelector("#list-ready");
const btnRemoveAll = document.querySelector("#btn-remove-all");
const btnRemoveСompleted = document.querySelector("#btn-remove-completed");

let tasks = [];
// let ready = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

function renderTask(task) {
  let chk = "";
  if (task.done) {
    chk = "checked";
  }
  const taskHtml = `
                  <li class="task" id="${task.id}">
                    <a class="del" href="#">×</a><input type="checkbox" ${chk}/>
                    <span>${task.text}</span>
                  </li>`;
  task.done
    ? listReady.insertAdjacentHTML("beforeend", taskHtml)
    : listNotReady.insertAdjacentHTML("beforeend", taskHtml);
}

//Добавление задачи по клику
btnEnter.addEventListener("click", addTask);

function addTask() {
  const taskText = newTodo.value;
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  if (taskText != "") {
    tasks.push(newTask);
    saveToLocalStorage();

    renderTask(newTask);

    newTodo.value = "";
    newTodo.focus();
  }
}

//Добавление задачи по нажатию Enter
newTodo.addEventListener("keypress", function (event) {
  if (event.keyCode == 13) {
    btnEnter.click();
  }
});

//Удаление задачи
listNotReady.addEventListener("click", deleteTask);
listReady.addEventListener("click", deleteTask);

function deleteTask(event) {
  if (event.target.className !== "del") return;

  const parentNode = event.target.closest(".task");

  const id = Number(parentNode.id);
  tasks = tasks.filter((task) => task.id !== id);
  saveToLocalStorage();

  parentNode.remove();
}

//Отмечаем задачу завершенной
listNotReady.addEventListener("click", doneTask);
listReady.addEventListener("click", doneTask);

function doneTask(event) {
  if (event.target.type !== "checkbox") return;

  const parentNode = event.target.closest(".task");

  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;
  saveToLocalStorage();

  const check = parentNode.querySelector("input");
  check.checked
    ? listReady.appendChild(parentNode)
    : listNotReady.appendChild(parentNode);
}

//Удалить выполненные
btnRemoveСompleted.addEventListener("click", removeСompleted);

function removeСompleted() {
  tasks = tasks.filter((task) => !task.done);
  saveToLocalStorage();
  listReady.innerHTML = "";
}

//Начать новый список
btnRemoveAll.addEventListener("click", removeAll);

function removeAll() {
  tasks = [];
  saveToLocalStorage();
  listNotReady.innerHTML = "";
  listReady.innerHTML = "";
}

// Записать в LocalStorage
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
