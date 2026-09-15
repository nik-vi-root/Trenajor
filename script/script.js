// --- ЛОГИКА СМЕНЫ ТЕМЫ ---
const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', function () {
    document.body.classList.toggle('theme-blue');
});

// --- БАЗА ДАННЫХ ---
const defaultTasks = [
    {
        code: "document.querySelector('.class');",
        desc: "Ищет и берет в работу ПЕРВЫЙ элемент на странице, подходящий под запрос (класс, тег или id)."
    },
    {
        code: "document.querySelectorAll('.class');",
        desc: "Находит ВСЕ элементы с таким селектором и собирает их в список, по которому потом можно пройтись циклом."
    },
    {
        code: "document.getElementById('id-name');",
        desc: "Ищет элемент по его уникальному ID (символ # внутри скобок писать не нужно)."
    },
    {
        code: "element.classList.add('active');",
        desc: "Добавляет класс элементу (точку перед именем класса писать не нужно)."
    },
    {
        code: "element.classList.remove('active');",
        desc: "Безвозвратно удаляет класс у элемента."
    },
    {
        code: "element.classList.toggle('active');",
        desc: "Переключатель: добавляет класс, если его нет, и убирает, если он уже висит."
    },
    {
        code: "element.classList.contains('active');",
        desc: "Проверяет, есть ли такой класс на элементе (возвращает true или false)."
    },
    {
        code: "element.style.backgroundColor = 'red';",
        desc: "Меняет CSS-стиль напрямую. Важно: свойства, которые в CSS пишутся через дефис, в JS пишутся слитно (camelCase)."
    },
    {
        code: "element.textContent = 'Новый текст';",
        desc: "Полностью заменяет текст внутри тега. Это самый безопасный способ вывода данных."
    },
    {
        code: "element.innerHTML = '<span>Текст</span>';",
        desc: "Заменяет содержимое тега, позволяя встраивать внутрь новые HTML-элементы."
    },
    {
        code: "element.setAttribute('disabled', 'true');",
        desc: "Добавляет тегу атрибут (например, можно сделать кнопку неактивной)."
    },
    {
        code: "element.removeAttribute('disabled');",
        desc: "Снимает атрибут с тега."
    },
    {
        code: "element.addEventListener('click', function() {...});",
        desc: "Вешает слушатель. Ждет клика по элементу, чтобы запустить код внутри функции."
    },
    {
        code: "element.addEventListener('input', function() {...});",
        desc: "Отслеживает ввод. Срабатывает каждый раз, когда пользователь печатает новый символ в поле ввода."
    },
    {
        code: "element.style.Свойство CSS = 'значение СSS';",
        desc: "Прямые манипуляции со стилями. Вместо 'Свойство CSS' пишем нужное свойство."
    },
    {
        code: "window.getComputedStyle(element).color;",
        desc: "Своеобразный мультиметр. Узнает, какой стиль у элемента сейчас (даже если он задан в CSS-файле)."
    }
];

// Пытаемся получить сохраненные данные из localStorage. Если их нет, берем defaultTasks.
let tasks = JSON.parse(localStorage.getItem('jsTrainerTasks')) || defaultTasks;

const newTaskInput = document.getElementById('newTaskInput');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const saveBtn = document.getElementById('saveBtn'); // Новая кнопка

const btnPanel = document.getElementById('btnPanel');
const targetDisplay = document.getElementById('target');
const mainInput = document.getElementById('mainInput');
const descriptionBox = document.getElementById('descriptionBox');
const statusDisplay = document.getElementById('status');

let currentTargetIndex = 0;
let successes = 0;

// --- ФУНКЦИЯ СОХРАНЕНИЯ ---
saveBtn.addEventListener('click', function() {
    localStorage.setItem('jsTrainerTasks', JSON.stringify(tasks));
    
    // Визуальный эффект для пользователя (меняем дискету на галочку на 1 секунду)
    const originalIcon = saveBtn.textContent;
    saveBtn.textContent = '✔️';
    setTimeout(() => {
        saveBtn.textContent = originalIcon;
    }, 1000);
});

// --- ФУНКЦИЯ ОТРИСОВКИ ---
function renderButtons() {
    btnPanel.innerHTML = '';

    if (tasks.length === 0) {
        targetDisplay.textContent = "Массив пуст!";
        descriptionBox.textContent = "";
        mainInput.disabled = true;
        return;
    }

    mainInput.disabled = false;
    if (currentTargetIndex >= tasks.length) currentTargetIndex = tasks.length - 1;

    tasks.forEach((task, index) => {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        if (index === currentTargetIndex) btn.classList.add('active');

        // Обрезаем длинный код для красивой кнопки
        btn.textContent = task.code.length > 15 ? task.code.substring(0, 15) + '...' : task.code;
        btn.dataset.index = index;

        btnPanel.appendChild(btn);
    });

    // Выводим код и описание на экран
    targetDisplay.textContent = tasks[currentTargetIndex].code;
    descriptionBox.textContent = tasks[currentTargetIndex].desc;
}

// --- ЛОГИКА ДОБАВЛЕНИЯ/УДАЛЕНИЯ ЗАДАНИЙ ---
addBtn.addEventListener('click', function () {
    const newVal = newTaskInput.value.trim();
    if (newVal !== "") {
        tasks.push({ code: newVal, desc: "Моё добавленное задание" });
        newTaskInput.value = "";
        currentTargetIndex = tasks.length - 1; 
        renderButtons();
        resetProgress();
    }
});

removeBtn.addEventListener('click', function () {
    if (tasks.length > 0) {
        tasks.pop();
        renderButtons();
        resetProgress();
    }
});

// Клик по кнопке-заданию
btnPanel.addEventListener('click', function (e) {
    if (e.target.classList.contains('task-btn')) {
        currentTargetIndex = parseInt(e.target.dataset.index);
        renderButtons();
        resetProgress();
        mainInput.focus();
    }
});

// --- ЛОГИКА ТРЕНАЖЕРА (ПЕЧАТЬ) ---
mainInput.addEventListener('input', function () {
    if (tasks.length === 0) return;

    const currentTarget = tasks[currentTargetIndex].code;

    if (mainInput.value === currentTarget) {
        successes++;
        mainInput.value = "";

        if (successes >= 10) {
            statusDisplay.innerHTML = `<span class="success">Идеально! 10 из 10! 🎉</span>`;
            successes = 0;
        } else {
            statusDisplay.innerHTML = `Успешно: ${successes}/10`;
        }
    }
    else if (!currentTarget.startsWith(mainInput.value)) {
        statusDisplay.innerHTML = `<span class="error">Ошибка! Счетчик сброшен.</span>`;
        successes = 0;
        mainInput.value = "";
    }
});

function resetProgress() {
    successes = 0;
    mainInput.value = "";
    statusDisplay.innerHTML = `Успешно: 0/10`;
}

// Запускаем отрисовку при первой загрузке страницы
renderButtons();