// --- ЛОГИКА СМЕНЫ ТЕМЫ ---
const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', function () {
    document.body.classList.toggle('theme-blue');
});

// --- БАЗА ДАННЫХ (изначально пустая) ---
// Изменен ключ на 'myJsTasks', чтобы сбросить старые кэши браузера
let tasks = JSON.parse(localStorage.getItem('myJsTasks')) || [];

const newTaskInput = document.getElementById('newTaskInput');
const addBtn = document.getElementById('addBtn');
const removeBtn = document.getElementById('removeBtn');
const saveBtn = document.getElementById('saveBtn');

const btnPanel = document.getElementById('btnPanel');
const targetDisplay = document.getElementById('target');
const mainInput = document.getElementById('mainInput');
const descriptionBox = document.getElementById('descriptionBox');
const statusDisplay = document.getElementById('status');

let currentTargetIndex = 0;
let successes = 0;

// --- ФУНКЦИЯ СОХРАНЕНИЯ ---
saveBtn.addEventListener('click', function() {
    localStorage.setItem('myJsTasks', JSON.stringify(tasks));
    
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
        targetDisplay.textContent = "Добавь свой первый код!";
        descriptionBox.textContent = "Массив пуст.";
        mainInput.disabled = true;
        return;
    }

    mainInput.disabled = false;
    if (currentTargetIndex >= tasks.length) currentTargetIndex = tasks.length - 1;

    tasks.forEach((task, index) => {
        const btn = document.createElement('button');
        btn.className = 'task-btn';
        if (index === currentTargetIndex) btn.classList.add('active');

        btn.textContent = task.code.length > 15 ? task.code.substring(0, 15) + '...' : task.code;
        btn.dataset.index = index;

        btnPanel.appendChild(btn);
    });

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