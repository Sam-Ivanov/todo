renderBig(getArrayLS());
switchCurrentNavBtn();

document.querySelector('.todos').addEventListener('click', (e) => {
   e.stopPropagation();
   let target = e.target;
   if (target.classList.contains('remove-btn')) {
      removeTodo(target.dataset.id);
      deleteElement(target);
   }
   if (target.classList.contains('done-btn')) {
      let arr = switchState(target.dataset.id);
      let rgba;
      arr.forEach(el => {
         if (el.id == target.dataset.id) {
            if (el.state == 'active') {
               rgba = el.activeRGBA;
            } else {
               rgba = el.doneRGBA;
            }
         }
      })
      switchElement(target, rgba);
      hideElements(getCurrentNavBtn());
   }
})

document.querySelector('.header__form').addEventListener('submit', function (e) {
   e.preventDefault();
   let text = document.querySelector('.inp');
   if (text.value == '') return;
   createNewTodo(text.value);
   e.target.reset();
   text.focus();
   hideElements(getCurrentNavBtn());
})



function getArrayLS() {                                       //===Получение массива todos из LS===
   let arrTodos = [];
   if (localStorage.length === 0) {                           //если LS пуст, сразу возвращаем пустой массив
      return arrTodos;
   } else {
      arrTodos = JSON.parse(localStorage.getItem('todos'));   //иначе извлекаем массив todos из ls
      if (!validLsArr(arrTodos)) {
         localStorage.clear();
         return;
      }
      return arrTodos;
   }
}

function validLsArr(arr) {
   if (arr.length == 0) return true
   return (arr[0].hasOwnProperty('id') &&
      arr[0].hasOwnProperty('text') &&
      arr[0].hasOwnProperty('state') &&
      arr[0].hasOwnProperty('activeRGBA') &&
      arr[0].hasOwnProperty('doneRGBA'))
}

function setArrayLS(arr) {                                    //===Отправление массива todos в LS===
   localStorage.setItem('todos', JSON.stringify(arr));        //отправляем обновленный массив todos в LS
}

function createNewTodo(text) {                                //===Создание нового todo===
   let arrTodos = getArrayLS();                               //получаем массив todos из LS
   let id = generateID();                                     //генерим id
   let newTodo = {                                            //создаем новую todo
      id: id,
      text: text,
      state: 'active',
      activeRGBA: [getRand(0, 255), getRand(0, 255), getRand(0, 255), 0.2],
      doneRGBA: [250, 250, 250, 1]
   };
   arrTodos.push(newTodo);                                    //пушим новую todo в массив todos
   setArrayLS(arrTodos);                                      //отправляем обновленный массив todos в LS
   createNewElement(id, text, newTodo.state, newTodo.activeRGBA, 'done', 'done-btn');
}

function generateID() {                                       //===Генерация id по дате в мс===
   return Date.now();
}

function removeTodo(id) {                                     //===Удаление todo===
   let arrTodos = getArrayLS();                               //получаем массив todos из LS

   for (let i = 0; i < arrTodos.length; i++) {                //ищем todo по id
      if (arrTodos[i].id == id) {

         arrTodos.splice(i, 1);                               //если нашли, удаляем данный todo и выходим из цикла
         break;
      }
   }
   setArrayLS(arrTodos);                                      //отправляем обновленный массив todos в LS


}

function render() {                                           //Хуендер
   let arr = JSON.parse(localStorage.getItem('todos'));
   if (arr === null || arr.length === 0) {
      console.log('Массив тудух пуст!');
      return;
   }
   arr.forEach(el => console.log(el));
}

function switchState(id) {                                    //===Переключение состояния state в todo===
   let arrTodos = getArrayLS();                               //получаем массив todos из LS
   for (let i = 0; i < arrTodos.length; i++) {                //ищем todo по id
      if (arrTodos[i].id == id) {
         if (arrTodos[i].state === 'active') {                              //если нашли, меняем состояние данного todo и выходим из цикла
            arrTodos[i].state = 'done';
         } else {
            arrTodos[i].state = 'active';
         }
         break;
      }
   }
   setArrayLS(arrTodos);                                      //отправляем обновленный массив todos в LS
   return (arrTodos);
}

function getRand(min, max) {                                  //Генерация псевдослучайного числа для фона todo
   let rand = ((max + 1 - min) * Math.random()) + min;
   return (Math.floor(rand));
}

function switchCurrentNavBtn() {                             //Переключение текущей вкладки навигации
   let active = document.querySelector('.nav__active');
   let all = document.querySelector('.nav__all');
   let done = document.querySelector('.nav__done');
   active.classList.add('nav-current-btn');
   hideElements(getCurrentNavBtn());
   document.querySelector('.nav').addEventListener('click', (e) => {
      let navBtnTarget = e.target;
      if (navBtnTarget.classList.contains('nav__all')) {
         all.classList.add('nav-current-btn');
         done.classList.remove('nav-current-btn');
         active.classList.remove('nav-current-btn');
      } else
         if (navBtnTarget.classList.contains('nav__done')) {
            all.classList.remove('nav-current-btn');
            done.classList.add('nav-current-btn');
            active.classList.remove('nav-current-btn');
         } else
            if (navBtnTarget.classList.contains('nav__active')) {
               all.classList.remove('nav-current-btn');
               done.classList.remove('nav-current-btn');
               active.classList.add('nav-current-btn');
            }
      if (navBtnTarget.classList.contains('nav-btn')) {
         hideElements(getCurrentNavBtn());
      }
   })
}

function hideElements(currentNavBtn) {
   let todoBlocks = document.querySelectorAll('.all');
   todoBlocks.forEach(el => {
      if (!el.classList.contains(currentNavBtn)) {
         el.classList.add('hide')
      } else {
         el.classList.remove('hide')
      }
   })
}

function getCurrentNavBtn() {                                 //Получить текущую вкладку/класс навигации
   let btnsList = document.querySelectorAll('.nav-btn');
   let currBtn;
   btnsList.forEach(el => {
      if (el.classList.contains('nav-current-btn')) {
         currBtn = el;
      }
   })
   // return currBtn;
   return currBtn.dataset.nav;
}

function renderBig(arr) {
   let rgba;
   let statusBtnText;
   let statusBtnClass;

   arr.forEach(el => {
      if (el.state === 'active') {
         rgba = el.activeRGBA;
         statusBtnText = 'done';
         statusBtnClass = 'done-btn';
      } else {
         rgba = el.doneRGBA;
         statusBtnText = 'in active';
         statusBtnClass = 'done-btn bgGreenBtn';


      }
      createNewElement(el.id, el.text, el.state, rgba, statusBtnText, statusBtnClass);
   })
}

function createNewElement(id, text, state, rgba, statusBtnText, statusBtnClass) { //создание всех элементов после изменения массива тудух
   let todos = document.querySelector('.todos');
   let newTodo = document.createElement('div');
   // newTodo.dataset.id = id;
   newTodo.setAttribute(`class`, `all ${state}`);                 //ToDo Изменять цвет кнопки при switchState не атрибутом style а классом!(class="statusBtnBgClr")
   newTodo.innerHTML = `<div class="todo" style="background: rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]});">${text}</div>
   <button data-id="${id}" class="${statusBtnClass}">${statusBtnText}</button>
   <button data-id="${id}" class="remove-btn">del</button>
`
   todos.prepend(newTodo);
}
function deleteElement(targetBtn) {
   targetBtn.closest('.all').remove();
}

function switchElement(target, rgba) {
   let t = target.closest('.all');
   if (t.classList.contains('active')) {
      t.classList.remove('active');
      t.classList.add('done');
   } else {
      t.classList.remove('done');
      t.classList.add('active');
   }
   target.classList.toggle('bgGreenBtn');
   target.textContent = target.textContent == 'done' ? 'in active' : 'done';
   target.previousElementSibling.style.background = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
}



// document.querySelector('.todos').addEventListener('mousedown', function (mouseEvent) {
//    var todoItem = mouseEvent.target.closest('.all');

//    if (todoItem) {
//       UiDrag.begin({
//          initialX: mouseEvent.clientX,
//          initialY: mouseEvent.clientY,
//          dragSource: todoItem,
//          dragBoundarySelector: '.todos',
//          dropTargetSelector: '.todos',
//          drop: function (todoItem, todos) {
//             todoItem.remove();
//             todos.append(todoItem);
//          }
//       });
//    }
// });

//====ВРЕМЕННО!================================================
function C() {
   localStorage.clear();
}

