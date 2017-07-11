'use strict';

const pageBody = document.body;
const noteElem = document.getElementById('note');
const submitNew = document.getElementById('new-entry');
const titleElem = document.getElementById('title');
const noteDescriptionElem = document.getElementById('note-description');
const btnItems = document.getElementById('item-section');

const template = document.querySelector('template').content;
const h2 = template.querySelector('h2');
const p = template.querySelector('p');
const element = template.querySelector('.js-note-area-content');
const deleteBtnElm = template.querySelector('.js-delete');
const colorLensElm = template.querySelector('.js-color-lens');
const backgroundColors = ['#ffffff', '#ff8a80', '#ffd180', '#ffff8d', '#cfd8dc', '#80d8ff', '#a7ffeb', '#ccff90'];

let isToggled = false;
let isColorPalette = false;
let notesArray = [];

// Load stored notes
init();

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

    changeInputOnToggleState(titleElem, btnItems);
    isToggled = !isToggled;
}

function changeInputOnToggleState(title, btnItems) {
    if (isToggled) {
        title.style.display = 'none';
        noteElem.style.height = '46px';
        btnItems.style.display = 'none';
    } else {
        title.style.display = 'block';
        noteElem.style.height = '138px';
        btnItems.style.display = 'block';
    }
}

/**
 * Function that renders a template
 */
function renderNote(data) {
    const deleteBtnId = 'delete_' + data.id;
    const colorLensId = 'colorlens_' + data.id;

    element.id = data.id;
    h2.textContent = data.title;
    p.textContent = data.description;
    element.style.background = data.color;
    deleteBtnElm.id = deleteBtnId;
    colorLensElm.id = colorLensId;

    document.querySelector('#outlet')
        .appendChild(document.importNode(template, true));

    setTemplateBinders(deleteBtnId, colorLensId);
}

/**
 * Function to save the note
 */
function saveNote() {
    const data = getNoteData();
    notesArray.push(data);
    renderNote(data);
}

/**
 * Method to retrieve a note's title and description
 */
function getNoteData() {
    const title = titleElem.value;
    const description = noteDescriptionElem.value;
    const color = '#ffffff';
    const id = guid();
    const noteData = { id, title, description, color };

    resetInputFields();

    return noteData;
}

/**
 * Method to generate GUID
 */
function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function resetInputFields() {
    document.getElementById('title').value = '';
    document.getElementById('note-description').value = '';
}

/**
 * Save data to localstorage
 */
function retainData() {
    localStorage.setItem('notes', JSON.stringify(notesArray));
}

/**
 * Retrieve data from localstorage
 */
function getStoredData() {
    notesArray = JSON.parse(localStorage.getItem('notes') || '[]');
}

function init() {
    getStoredData();
    renderStoredNotes();
    bindEvents();
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
    const btn = e.target;
    const target = btn.parentNode.parentNode;
    const id = btn.id.split('_').pop();

    for (let i = 0; i < notesArray.length; i++) {
        if (notesArray[i].id === id) {
            notesArray.splice(i, 1);
            removeElements();
            return;
        }
    }
}

/**
 * Remove elements from page
 */
function removeElements() {
    const area = document.getElementById('outlet');

    area.innerHTML = '';
    renderStoredNotes();
}

/**
 * Toggle color palette view
 */
function showColors(target) {
    const parent = target.parentNode;
    const colorPaletteElm = parent.querySelector('.color-palette');

    colorPaletteElm.style.display = isColorPalette ? 'none' : 'block';
    renderColors(colorPaletteElm);

    isColorPalette = !isColorPalette;
}

function renderColors(target) {
    const colorListWrapElement = document.createElement('ul');
    colorListWrapElement.className += 'label-list';

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
    colorListElement.addEventListener('click', handleColorPaletteClick);

    function handleColorPaletteClick(ev) {
        ev.stopPropagation();
        const elementToChange = target.parentNode.parentNode;
        const color = colorListElement.getAttribute('data-color');

        handleChangeElementColor(elementToChange, color)
    }

}

function handleChangeElementColor(element, color) {
    element.style.background = color;
    setColorValue(element, color);
}


function setColorValue(element, color) {
    const colorPaletteElm = element.querySelector('.color-palette');
    const elemId = element.id.split('_').pop();

    notesArray.forEach(function (note) {
        if (note.id === element.id) {
            note.color = color;
        }
    });

    colorPaletteElm.style.display = 'none';
}

/**
 * Adds event listeners on template delete buttons
 */
function setTemplateBinders(deleteBtnId, colorLensId) {
    const deleteBtn = document.querySelector('#' + deleteBtnId);
    const colorLensElm = document.querySelector('#' + colorLensId);

    deleteBtn.addEventListener('click', handleDeleteBtnClick);
    colorLensElm.addEventListener('click', handleColorLensClick);

    function handleDeleteBtnClick(ev) {
        ev.stopPropagation();
        removeNotes(ev);
    }

    function handleColorLensClick(ev) {
        ev.stopPropagation();
        showColors(colorLensElm);
    }
}

function bindEvents() {
    window.addEventListener('unload', handleUnload);
    pageBody.addEventListener('click', handlePageBodyClick);
    noteElem.addEventListener('click', handleNewNoteClick);
    submitNew.addEventListener('click', handleNewSubmitClick);

    function handlePageBodyClick(ev) {
        toggle('close')
    }

    function handleNewNoteClick(ev) {
        ev.stopPropagation();
        toggle('open');
    }

    function handleNewSubmitClick(ev) {
        ev.stopPropagation();
        saveNote();
        toggle('close');
    }

    // Saves data to local storage after refresh or closing the page
    function handleUnload(ev) {
        retainData();
    }
}
