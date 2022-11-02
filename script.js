const nuevaTareaInput = document.querySelector("#nuevaTarea input");
const tareasDiv = document.querySelector("#tareas");
let eliminarTareas, editarTareas, tareas;
let updateNota = "";
let count;

window.onload = () => {
  updateNota = "";
  count = Object.keys(localStorage).length;
  displayTareas();
}

//Función para mostrar las tareas
const displayTareas = () => {
  if (Object.keys(localStorage).length > 0) {
    tareasDiv.style.display = "inline-block";
  } else {
    tareasDiv.style.display = "none";
  }

  //Limpiar las tareas
  tareasDiv.innerHTML = "";

  let tareas = Object.keys(localStorage);
  tareas = tareas.sort();
  for (let key of tareas) {
    let classValue = "";

    //Todos los valores
    let value = localStorage.getItem(key);
    let tareaInnerDiv = document.createElement("div");
    tareaInnerDiv.classList.add("tarea");
    tareaInnerDiv.setAttribute("id", key);
    tareaInnerDiv.innerHTML = `<span id="nombreTarea">${key.split("_")[1]}</span>`;

    let editBoton = document.createElement("button");
    editBoton.classList.add("edit");
    editBoton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editBoton.style.visibility = "visible";
    } else {
      editBoton.style.visibility = "hidden";
      tareaInnerDiv.classList.add("completada");
    }
    tareaInnerDiv.appendChild(editBoton);
    tareaInnerDiv.innerHTML += `<button class="eliminar"><i class="fa-solid fa-trash"></i></button>`;
    tareasDiv.appendChild(tareaInnerDiv);
  }
  //Tareas completadas
  tareas = document.querySelectorAll(".tarea");
  tareas.forEach((element, index) => {
    element.onclick = () => {

      //Update
      if (element.classList.contains("completada")) {
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    }
  })

  //Editar tareas
  editarTareas = document.getElementsByClassName("edit");
  Array.from(editarTareas).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      disableBotones(true);
      let parent = element.parentElement;
      nuevaTareaInput.value = parent.querySelector("#nombreTarea").innerText;
      updateNota = parent.id;
      parent.remove();
    })
  })

  //Eliminar tareas
  eliminarTareas = document.getElementsByClassName("eliminar");
  Array.from(eliminarTareas).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      let parent = element.parentElement;
      removerTarea(parent.id);
      parent.remove();
      count -= 1;
    })
  })
}
//Deshabilitar botón de edición
const disableBotones = (bool) => {
  let editBotones = document.getElementsByClassName("edit");
  Array.from(editBotones).forEach((element) => {
    element.disabled = bool;
  })
}

//Remover tarea del localStorage
const removerTarea = (tareaValue) => {
  localStorage.removeItem(tareaValue);
  displayTareas();
}

//Agregar tarea al localStorage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTareas();
}

//Función para agregar nueva tarea
document.querySelector("#push").addEventListener("click", () => {

  //Habilitar el botón de edición
  disableBotones(false);
  if (nuevaTareaInput.value.length == 0) {
    alert("Ingrese una tarea");
  } else {
    if (updateNota == "") {

      //Nueva tarea
      updateStorage(count, nuevaTareaInput.value, false);
    } else {

      //Update tarea
      let existingCount = updateNota.split("_")[0];
      removerTarea(updateNota);
      updateStorage(existingCount, nuevaTareaInput.value, false);
      updateNota = "";
    }
    count += 1;
    nuevaTareaInput.value = "";
  }
})