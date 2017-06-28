'use strict';

let isToggled = false;
let pageBody = document.body;
let note = document.getElementById('note');
let submitNew = document.getElementById('new-entry');
let notesArray = [];
let deleteId = 0;

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
    let itemSection = document.getElementById('item-section');

    if (isToggled) {
        title.style.display = 'none';
        itemSection.style.display = 'none';
        note.style.height = '46px';
    } else {
        title.style.display = 'block';
        note.style.height = '138px';
        itemSection.style.display = 'block';
    }

    isToggled = !isToggled;
}

/**
 * Function that renders a template
 */
function renderNote(data) {
    let template = document.querySelector('template').content;
    let h2 = template.querySelector('h2');
    let p = template.querySelector('p');
    let deleteBtn = template.querySelector('.js-delete');
    let deleteBtnId = 'delete_' + deleteId;

    h2.textContent = data.title;
    p.textContent = data.description;
    deleteBtn.id = deleteBtnId;

    document.querySelector('#outlet')
        .appendChild(document.importNode(template, true));

    setTemplateDelete(deleteBtnId);

    deleteId ++;
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
    let noteData = { title, description };
    retainData(noteData);

    return noteData;
}

/**
 * Save data to localstorage
 */
function retainData(data) {
    console.log(data);
    notesArray.push(data);
    localStorage.setItem('notes', JSON.stringify(notesArray));
}

/**
 * Retrieve data from localstorage
 */
function getStoredData() {
    notesArray = JSON.parse(localStorage.getItem('notes') || '[]');
    console.log(localStorage.getItem('notes'));
}

function init() {
    //clearMemory();
    getStoredData();
    renderStoredNotes();
}

function clearMemory() {
    localStorage.clear();
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
 * @param {event} event 
 */
function removeNotes(e) {
    let btn = e.target;
    let index = btn.id.split('_').pop();

    notesArray.splice(index, index.length);
    localStorage.setItem('notes', JSON.stringify(notesArray));
    init();
}

/**
 * Adds event listeners on template delete buttons
 */
function setTemplateDelete(deleteBtnId) {
    let deleteBtn = document.querySelector('#' + deleteBtnId);

    deleteBtn.addEventListener('click', function (ev) {
        removeNotes(ev);
        ev.stopPropagation();
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