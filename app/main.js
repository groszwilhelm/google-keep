'use strict';

let isToggled = false;
let isColorPalette = false;
let pageBody = document.body;
let note = document.getElementById('note');
let submitNew = document.getElementById('new-entry');
let notesArray = [];
let counter = 0;
let backgroundColors = ['#ffffff', '#ff8a80', '#ffd180', '#ffff8d', '#cfd8dc', '#80d8ff', '#a7ffeb', '#ccff90'];

// Load stored notes
init();

// Call event listeners
listeners();

/**
 * Function will toggle note element's hidden items
 * If the note isn't toggled and the click was on the note it will display the whole note
 * Else if the note was toggled and the click happens on the body of the page the note gets hidden
 */
function toggle(param) {
    if (!isToggled && param === 'close') {
        return;
    }

    if (isToggled && param === 'open') {
        return;
    }

    let title = document.getElementById('title');
    let btnItems = document.getElementById('item-section');

    changeInputOnToggleState(title, btnItems);
    isToggled = !isToggled;
}

function changeInputOnToggleState(title, btnItems) {
    if (isToggled) {
        title.style.display = 'none';
        note.style.height = '46px';
        btnItems.style.display = 'none';
    } else {
        title.style.display = 'block';
        note.style.height = '138px';
        btnItems.style.display = 'block';
    }
}

/**
 * Function that renders a template
 */
function renderNote(data) {
    let template = document.querySelector('template').content;
    let h2 = template.querySelector('h2');
    let p = template.querySelector('p');
    let element = template.querySelector('.js-note-area-content');
    let deleteBtnElm = template.querySelector('.js-delete');
    let colorLensElm = template.querySelector('.js-color-lens');
    let deleteBtnId = 'delete_' + counter;
    let colorLensId = 'colorlens_' + counter;

    element.id = data.id;
    h2.textContent = data.title;
    p.textContent = data.description;
    element.style.background = data.color;
    deleteBtnElm.id = deleteBtnId;
    colorLensElm.id = colorLensId;

    document.querySelector('#outlet')
        .appendChild(document.importNode(template, true));

    setTemplateListeners(deleteBtnId, colorLensId);
    counter++;
}

/**
 * Function to save the note
 */
function saveNote() {
    let data = getNoteData();
    renderNote(data);
}

/**
 * Method to retrieve a note's title and description
 */
function getNoteData() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('note-description').value;
    let color = '#ffffff';
    let id = 'note-content_' + counter;
    let noteData = { id, title, description, color };

    retainData(noteData);
    resetInputFields();

    return noteData;
}

function resetInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('note-description').value = '';
}

/**
 * Save data to localstorage
 */
function retainData(data) {
    notesArray.push(data);
    localStorage.setItem('notes', JSON.stringify(notesArray));
}

/**
 * Retrieve data from localstorage
 */
function getStoredData() {
    notesArray = JSON.parse(localStorage.getItem('notes') || '[]');
}

function init() {
    counter = 0;
    getStoredData();
    renderStoredNotes();
}

/**
 * Render the templates for stored notes
 */
function renderStoredNotes() {
    notesArray.forEach(function (note) {
        renderNote(note);
    });
}

/**
 * Function to remove a note
 */
function removeNotes(e) {
    let btn = e.target;
    let target = btn.parentNode.parentNode;
    let index = btn.id.split('_').pop();

    notesArray.splice(index, index.length);
    localStorage.setItem('notes', JSON.stringify(notesArray));

    removeElements();
}

/**
 * Remove elements from page
 */
function removeElements() {
    let area = document.querySelectorAll('.js-note-area-content');

    area.forEach(function (area) {
        area.remove();
    })

    init();
}

/**
 * Toggle color palette view
 */
function showColors(target) {
    let parent = target.parentNode;
    let colorPaletteElm = parent.querySelector('.color-palette');

    isColorPalette ? colorPaletteElm.style.display = 'none' : colorPaletteElm.style.display = 'block';
    renderColors(colorPaletteElm);

    isColorPalette = !isColorPalette;
}

function renderColors(target) {
    let colorListWrapElement = document.createElement('ul');
    colorListWrapElement.className += 'label-list card-panel';

    if (!target.firstChild) {
        target.appendChild(colorListWrapElement);

        for (let i = 0; i < backgroundColors.length; i++) {
            let colorListElement = document.createElement('li');
            colorListElement.className = 'js-color-palette_' + i;
            colorListElement.setAttribute('data-color', backgroundColors[i]);
            colorListElement.setAttribute('style', 'background-color: ' + backgroundColors[i]);
            colorListWrapElement.appendChild(colorListElement);
            onColorChangeListener(target, colorListElement);
        }
    }
}

/**
 * Event listener for color change
 */
function onColorChangeListener(target, colorListElement) {
    colorListElement.addEventListener('click', function (ev) {
        ev.stopPropagation();
        let elementToChange = target.parentNode.parentNode;
        let color = colorListElement.getAttribute('data-color');

        handleChangeElementColor(elementToChange, color)
    });

}

function handleChangeElementColor(element, color) {
    element.style.background = color;
    saveColorValue(element, color);
}

function saveColorValue(element, color) {
    let colorPaletteElm = element.querySelector('.color-palette');
    let elemId = element.id;

    notesArray.forEach(function(note) {
        if(note.id === elemId) {
            note.color = color;
        }
    });

    localStorage.setItem('notes', JSON.stringify(notesArray));
    colorPaletteElm.style.display = 'none';
}


/**
 * Adds event listeners on template delete buttons
 */
function setTemplateListeners(deleteBtnId, colorLensId) {
    let deleteBtn = document.querySelector('#' + deleteBtnId);
    let colorLensElm = document.querySelector('#' + colorLensId);

    deleteBtn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        removeNotes(ev);
    });

    colorLensElm.addEventListener('click', function (ev) {
        ev.stopPropagation();
        showColors(colorLensElm);
    });
}

function listeners() {
    pageBody.addEventListener('click', function (ev) {
        toggle('close');
    });

    note.addEventListener('click', function (ev) {
        ev.stopPropagation();
        toggle('open');
    });

    submitNew.addEventListener('click', function (ev) {
        ev.stopPropagation();
        saveNote();
        toggle('close');
    });
}
