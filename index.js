(() => {
  let todos = [
    {
      id: 0,
      title: "take a cup of coffee",
      dueDate: getRandomFutureDate(10),
      isImportant: false,
      isCompleted: false
    },
    {
      id: 1,
      title: "take a cup of green tea",
      dueDate: getRandomFutureDate(10),
      isImportant: false,
      isCompleted: false
    },
    {
      id: 2,
      title: "visit the museum",
      dueDate: getRandomFutureDate(10),
      isImportant: true,
      isCompleted: false
    }
  ];

  function getRandomFutureDate(limit) {
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + Math.floor(Math.random() * limit));
    return tomorrow;
  }

  function getTodos(filter) {
    if (filter) {
      return todos[filter];
    }

    return todos;
  }

  function handleTodoStatusChange(e) {
    const todoElemContainer = e.target.closest(".todo");
    const todoId = todoElemContainer.dataset.todoId;
    const foundTodo = todos.find((todo) => todo.id === Number(todoId));
    console.log({ foundTodo });
    foundTodo.isCompleted = !foundTodo.isCompleted;
    renderTodos();
  }

  function handleEditTodo(e) {
    console.log("editing todo...");
    const todoElemContainer = e.target.closest(".todo");
    let titleElem = todoElemContainer.querySelector(".todo-title");
    const clonedTitleElem = titleElem.cloneNode("deep");
    const titleInputElem = document.createElement("input");
    titleInputElem.value = clonedTitleElem.textContent;
    titleInputElem.classList.add("todo-title");
    titleElem.parentElement.replaceChild(titleInputElem, titleElem);
    titleInputElem.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const newValue = titleInputElem.value;
        const todoId = todoElemContainer.dataset.todoId;
        const foundTodo = todos.find((todo) => todo.id === Number(todoId));
        foundTodo.title = newValue;
        renderTodos();
      }
    });
  }

  function handleDeleteTodo(e) {
    const todoElemContainer = e.target.closest(".todo");
    const confirmDelete = window.confirm(
      `Delete todo item "${todoElemContainer.textContent}"?`
    );

    if (confirmDelete) {
      console.log(todoElemContainer.innerText);
      const todoId = todoElemContainer.dataset.todoId;
      todos = todos.filter((todo) => todo.id !== Number(todoId));
      renderTodos();
    }
  }

  function addTodoCompletedIcon(parentElem, todoStatus) {
    const htmlStr = todoStatus
      ? '<i class="fas fa-check-circle"></i>'
      : '<i class="far fa-circle"></i>';
    const completedElem = document.createElement("div");
    completedElem.classList.add("todo-status");
    completedElem.innerHTML = htmlStr;
    completedElem.addEventListener("click", handleTodoStatusChange);
    parentElem.appendChild(completedElem);
  }

  function addTodoTitle(parentElem, text) {
    const titleElem = document.createElement("div");
    titleElem.textContent = text;
    titleElem.classList.add("todo-title");
    parentElem.appendChild(titleElem);
  }

  function addTodoEditIcon(parentElem) {
    const editElem = document.createElement("div");
    editElem.classList.add("edit-todo");
    editElem.innerHTML = '<i class="far fa-edit"></i>';
    editElem.addEventListener("click", handleEditTodo);
    parentElem.appendChild(editElem);
  }

  function addTodoDeleteIcon(parentElem) {
    const deleteElem = document.createElement("div");
    deleteElem.classList.add("delete-todo");
    deleteElem.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteElem.addEventListener("click", handleDeleteTodo);
    parentElem.appendChild(deleteElem);
  }

  function createTodoItem(todo) {
    const todoListElem = document.createElement("li");
    todoListElem.classList.add("todo");
    if (todo.isCompleted) {
      todoListElem.classList.add("todo-completed");
    } else {
      todoListElem.classList.remove("todo-completed");
    }
    todoListElem.dataset.todoId = todo.id;
    addTodoCompletedIcon(todoListElem, todo.isCompleted);
    addTodoTitle(todoListElem, todo.title);
    addTodoEditIcon(todoListElem);
    addTodoDeleteIcon(todoListElem);
    return todoListElem;
  }

  function createTodosContainer(todosArray) {
    const todosContainer = document.createElement("div");
    todosContainer.classList.add("todo-container");
    const todoList = document.createElement("ul");
    todoList.classList.add("todos");
    for (let todo of todosArray) {
      const todoItem = createTodoItem(todo);
      todoList.appendChild(todoItem);
    }
    todosContainer.appendChild(todoList);
    return todosContainer;
  }

  function renderTodos() {
    const root = document.getElementById("root");
    const todos = getTodos();
    let todosContainer = document.querySelector(".todo-container");
    if (todosContainer) {
      todosContainer.remove();
    }
    todosContainer = createTodosContainer(todos);
    root.appendChild(todosContainer);
  }

  function getNextId() {
    const currentIds = todos.map((todo) => todo.id);
    return Math.max(...currentIds) + 1;
  }

  function handleSubmitTodo(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const important = e.target.important.value;
    const dueDate = e.target["due-date"].value;
    const project = e.target.project.value || "default";
    const isCompleted = false;
    const id = getNextId();
    todos.push({
      title,
      dueDate,
      project,
      id,
      isImportant: important,
      isCompleted
    });
    e.target.reset();
    renderTodos();
  }

  function setupTodoForm() {
    const todoForm = document.getElementById("todo-form");
    todoForm.addEventListener("submit", handleSubmitTodo);
  }

  setupTodoForm();
  renderTodos();
})();
