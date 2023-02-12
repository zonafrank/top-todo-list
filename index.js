(() => {
  const storedSelectedProject = window.localStorage.getItem("selectedProject");
  let selectedProject = JSON.parse(storedSelectedProject) || "";
  const storedTodos = window.localStorage.getItem("todos");
  let todos = JSON.parse(storedTodos) || [
    {
      id: 0,
      title: "take a cup of coffee",
      dueDate: getRandomFutureDate(10),
      isImportant: false,
      isCompleted: false,
      project: "default"
    },
    {
      id: 1,
      title: "take a cup of green tea",
      dueDate: getRandomFutureDate(10),
      isImportant: false,
      isCompleted: false,
      project: "default"
    },
    {
      id: 2,
      title: "visit the museum",
      dueDate: getRandomFutureDate(10),
      isImportant: true,
      isCompleted: false,
      project: "default"
    }
  ];

  function getRandomFutureDate(limit) {
    let tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + Math.floor(Math.random() * limit));
    return tomorrow;
  }

  function getTodos() {
    if (selectedProject) {
      if (selectedProject === "all") {
        return todos;
      } else {
        return todos.filter((todo) => todo.project === selectedProject);
      }
    }
    return todos;
  }

  function handleTodoStatusChange(e) {
    const todoElemContainer = e.target.closest(".todo");
    const todoId = todoElemContainer.dataset.todoId;
    const foundTodo = todos.find((todo) => todo.id === Number(todoId));
    foundTodo.isCompleted = !foundTodo.isCompleted;
    renderTodos();
  }

  function handleEditTodo(e) {
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

  function addTodoTitle(parentElem, todo) {
    const handleShowDetail = () => {
      const detailElement = parentElem.querySelector(".todo-detail");
      detailElement.classList.toggle("hidden");
    };

    const handleHideDetail = () => {
      const detailElement = parentElem.querySelector(".todo-detail");
      detailElement.classList.add("hidden");
    };

    const handleTogglePriority = () => {
      todo.isImportant = !todo.isImportant;
      window.localStorage.setItem("todos", JSON.stringify(todos));
      renderTodos();
    };

    const todoTitle = document.createElement("div");
    todoTitle.classList.add("title");
    const todoTitleText = document.createElement("div");
    todoTitleText.textContent = todo.title;
    todoTitleText.classList.add("todo-title");
    todoTitleText.addEventListener("click", handleShowDetail);
    todoTitle.appendChild(todoTitleText);
    const todoDetail = document.createElement("div");
    todoDetail.classList.add("todo-detail");
    const dueDateElem = document.createElement("div");
    dueDateElem.textContent =
      "Due date:" + new Date(todo.dueDate).toLocaleDateString();
    const priorityElem = document.createElement("div");
    priorityElem.classList.add("todo-priority");
    priorityElem.textContent = todo.isImportant ? "Important" : "Not important";
    priorityElem.addEventListener("click", handleTogglePriority);
    const hideBtn = document.createElement("button");
    hideBtn.classList.add("hide-detail-btn");
    hideBtn.textContent = "Hide";
    hideBtn.addEventListener("click", handleHideDetail);
    todoDetail.appendChild(dueDateElem);
    todoDetail.appendChild(priorityElem);
    todoDetail.appendChild(hideBtn);
    todoDetail.classList.add("hidden");
    todoTitle.appendChild(todoDetail);
    parentElem.appendChild(todoTitle);
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
    addTodoTitle(todoListElem, todo);
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

  function handleFilterChange(e) {
    const { value } = e.target;
    if (value) {
      selectedProject = value;
      window.localStorage.setItem("selectedProject", JSON.stringify(value));
      renderTodos();
    }
  }

  function buildAndAttachFilter() {
    const projects = new Set(todos.map((todo) => todo.project));
    projects.add("all");
    const filterSelectElem = document.getElementById("filter");
    filterSelectElem.innerHTML = "";
    filterSelectElem.innerHTML = '<option value="">Select project</option>';
    for (let project of projects) {
      const option = document.createElement("option");
      option.innerText =
        project[0].toUpperCase() + project.substring(1).toLowerCase();
      option.setAttribute("value", project);
      if (project === selectedProject) {
        option.setAttribute("selected", "selected");
      }
      filterSelectElem.appendChild(option);
    }
    filterSelectElem.addEventListener("change", handleFilterChange);
  }

  function renderTodos() {
    const root = document.getElementById("main");
    const todos = getTodos();
    let todosContainer = document.querySelector(".todo-container");
    if (todosContainer) {
      todosContainer.remove();
    }
    todosContainer = createTodosContainer(todos);
    root.appendChild(todosContainer);
    buildAndAttachFilter();
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
    const todos = getTodos();
    todos.push({
      title,
      dueDate,
      project,
      id,
      isImportant: important,
      isCompleted
    });
    e.target.reset();
    window.localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos();
  }

  function setupTodoForm() {
    const todoForm = document.getElementById("todo-form");
    todoForm.addEventListener("submit", handleSubmitTodo);
  }

  setupTodoForm();
  renderTodos();
})();
