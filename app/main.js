'use strict';

let isToggled = false;
let pageBody = document.body;
let note = document.getElementById('note');
let submitNew = document.getElementById('new-entry');

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

    if(isToggled) {
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
 * Function to save the note
 * Creates an element on the page to display it
 */
function saveNote() {
    let template = document.querySelector('template').content;
    let h2 = template.querySelector('h2');
    let p = template.querySelector('p');
    let data = getNoteData();

    h2.textContent = data.title;
    p.textContent = data.description;
    document.querySelector('#outlet')
        .appendChild(document.importNode(template, true));
}

/**
 * Method to retrieve a note's title and description
 */
function getNoteData() {
    let title = document.getElementById('title').value;
    let description = document.getElementById('note-description').value;

    return {title, description};
}

function listeners() {
    pageBody.addEventListener('click', function(ev) {
        toggle('close');
    });

    note.addEventListener('click', function(ev) {
        ev.stopPropagation();
        toggle('open');
    });

    submitNew.addEventListener('click', function(ev) {
        ev.stopPropagation();
        saveNote();
        toggle('close');
    });
}