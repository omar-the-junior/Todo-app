//--------------------------THEME SWITCHER---------------------------
const themeSwitch = document.getElementById('theme-switch');
const body = document.querySelector('body');

themeSwitch.addEventListener('click', () => {
    if (body.getAttribute('theme') === 'light') {
        body.setAttribute('theme', 'dark');
        themeSwitch.setAttribute('src', './resources/images/icon-sun.svg')
    } else {
        body.setAttribute('theme', 'light')
        themeSwitch.setAttribute('src', './resources/images/icon-moon.svg')
    }
});

//--------------------------------------------------------------------

//------------------------TODO LIST-----------------------------------

const taskInput = document.getElementById('task-input');
const tasksContainer = document.querySelector('.task__container');
const filterControls = document.querySelectorAll('input[name="filter"]');
const clearBtn = document.getElementById('clear-completed');


function createTask() {
    const task = document.createElement('li');
    task.classList.add('task', 'box', 'flex-row');

    const label = document.createElement('label');
    label.classList.add('checkbox');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const span = document.createElement('span');
    const checkMark = document.createElement('img');
    checkMark.classList.add('checkmark')
    checkMark.src = './resources/images/icon-check.svg';
    checkMark.alt = 'Check Mark';

    span.appendChild(checkMark);
    label.appendChild(checkbox);
    label.appendChild(span);

    const paragraph = document.createElement('p');
    paragraph.textContent = taskInput.value;
    paragraph.classList.add('text-box');

    const cross = document.createElement('img');
    cross.src = './resources/images/icon-cross.svg';
    cross.classList.add('cross-icon');

    task.appendChild(label);
    task.appendChild(paragraph);
    task.appendChild(cross);

    const inputCheckbox = taskInput.previousElementSibling;

    if (inputCheckbox.control.checked) {
        task.setAttribute('status', 'completed');
        task.firstElementChild.control.checked = true;
    } else {
        task.setAttribute('status', 'active');
        task.firstElementChild.control.checked = false;
    }

    tasksContainer.appendChild(task);
    taskInput.value = '';
    inputCheckbox.control.checked = false;
};

function countTasks() {
    const tasks = document.querySelectorAll('.task[status="active"]');
    const taskCount = document.getElementById('task-count');
    taskCount.textContent = `${tasks.length} items left`;
};

function completeTask() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const checkbox = task.children[0];
        checkbox.addEventListener('change', () => {
            if (checkbox.control.checked) {
                checkbox.parentElement.setAttribute('status', 'completed')
            } else {
                checkbox.parentElement.setAttribute('status', 'active');
            }
            countTasks();
            setTimeout(applyFilter, 250); // So the task doesn't disappear right away
        })
    });
};

function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.task[status = "completed"]');
    completedTasks.forEach(task => {
        task.remove();
    });
};

function addEventListenerToAllDeleteBtns() {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        let deleteBtn = task.lastElementChild;
        deleteBtn.addEventListener('click', e => {
            e.target.parentElement.remove();
            countTasks();
        });
    });
};

function convertParagraphToTextBox() {
    const tasks = document.querySelectorAll('.task');

    tasks.forEach(task => {
        const p = task.children[1];
        p.addEventListener('click', () => {
            const parent = p.parentElement;
            const text = p.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = text;
            input.classList.add('text-box');
            parent.replaceChild(input, p);
            input.focus();
            applyChangesToParagraph(input);
        });
    });
};

function applyChangesToParagraph(textBox) {
    textBox.addEventListener('change', () => {
        const parent = textBox.parentElement;
        const newText = textBox.value;
        if (newText === '') {
            parent.remove();
            countTasks();
        } else {
            let newParagraph = document.createElement('p');
            newParagraph.textContent = newText;
            newParagraph.classList.add('text-box');
            parent.replaceChild(newParagraph, textBox);
            convertParagraphToTextBox();
        };
    });
};


function applyFilter() {
    const completedTasks = document.querySelectorAll('.task[status = "completed"]');
    const activeTasks = document.querySelectorAll('.task[status = "active"]');
    const checkedFilter = document.querySelector('input[name="filter"]:checked');
    filterControls.forEach(() => {
        switch (checkedFilter.value) {
            case 'display-all':
                completedTasks.forEach(task => {
                    task.style.display = 'flex';
                });

                activeTasks.forEach(task => {
                    task.style.display = 'flex';
                });
                break;

            case 'display-active':

                completedTasks.forEach(task => {
                    task.style.display = 'none';
                });

                activeTasks.forEach(task => {
                    task.style.display = 'flex';
                });
                break;

            case 'display-completed':
                activeTasks.forEach(task => {
                    task.style.display = 'none';
                });

                completedTasks.forEach(task => {
                    task.style.display = 'flex';
                });
                break;
        }
    });
};


taskInput.addEventListener('change', () => {

    if (taskInput.value === '') {
        const errText = `Can't add an empty task 😑`
        const err = document.createElement('p');
        err.classList.add('error')
        err.textContent = errText;
        taskInput.parentElement.appendChild(err);
        setTimeout(() => {
            err.remove();
        }, 3500);
    } else {
        createTask();
        addEventListenerToAllDeleteBtns();
        convertParagraphToTextBox();
        completeTask();
        countTasks();
        applyFilter();
    }

});

filterControls.forEach(filter => {
    filter.addEventListener('change', () => {
        applyFilter();
    });
});

clearBtn.addEventListener('click', clearCompletedTasks);


convertParagraphToTextBox();
addEventListenerToAllDeleteBtns();
completeTask();
countTasks();