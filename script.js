let myLibrary = [];

// Constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
        return(`The ${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`);
    }
}

// Default library
// const book1 = new Book("The Design of Everyday Things", "Don Norman", 368, true);
// const book2 = new Book("The Design of Future Things", "Don Norman", 240, false);
// const book3 = new Book("The Sympathizer", "Viet Thanh Nguyen", 384, false);
// const book4 = new Book("The Defining Decade: Why yout Twenties Matter--And How to Make the Most of Them Now", "Meg Jay", 336, false);
// const defaultLibrary = [book1, book2, book3, book4];
// myLibrary = defaultLibrary;

// Functions
const library = document.querySelector(".library");
const dialog = document.querySelector("dialog");
const form = document.querySelector("form");
const newBook = document.querySelector("dialog + button");
const closeButton = document.querySelector("dialog button");
const tableBody = document.querySelector(".table-body");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
});

newBook.addEventListener("click", () => {
    form.reset();
    dialog.showModal();
});

closeButton.addEventListener("click", () => {
    dialog.close();
});

library.addEventListener("click", (e) => {
    let currentRow;

    if (e.target.className == "trash") {
        currentRow = e.target.parentNode.parentNode.parentNode;
    } else if (e.target.classList.contains("remove-btn")) {
        currentRow = e.target.parentNode.parentNode;
    } else if (e.target.classList.contains("status")) {
        currentRow = e.target.parentNode;
    }

    const currentBook = currentRow.childNodes[0].innerText;
    
    // remove button
    if (e.target.className == "trash" || e.target.classList.contains("remove-btn")) {
        if (confirm(`Are you sure you want to remove ${currentBook} from your library?`)) {
            removeBook(currentBook);
        }
    }

    // status button
    if (e.target.classList.contains("status")) {
        changeStatus(currentBook);
    }

    updateLocalStorage();
    displayLibrary();
});

function createTableRow(book) {
    const row = document.createElement("div");
    row.classList.add("table-row");

    // title
    const bookTitle = document.createElement("p");
    bookTitle.classList.add("book-title");
    bookTitle.textContent = book.title;
    row.appendChild(bookTitle);
    
    // author
    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("book-author");
    bookAuthor.textContent = book.author;
    row.appendChild(bookAuthor);

    // number of pages
    const pages = document.createElement("p");
    pages.classList.add("book-pages");
    pages.textContent = book.pages;
    row.appendChild(pages);
    
    // status
    const status = document.createElement("button");
    status.classList.add("row-btn");
    status.classList.add("status");
    status.classList.add("book-status")
    if (book.read === true) {
        status.textContent = "READ";
    } else {
        status.textContent = "NOT READ";
    }
    row.appendChild(status);
    
    // remove button
    const removeBtn = document.createElement("button");
    removeBtn.classList.add("row-btn");
    removeBtn.classList.add("remove-btn");

    const trash = document.createElement("img");
    trash.classList.add("trash");
    trash.setAttribute('src', 'images/trash-can-outline.svg');
    removeBtn.appendChild(trash);

    const removeCont = document.createElement("div");
    removeCont.classList.add("book-remove");
    removeCont.appendChild(removeBtn);
    row.appendChild(removeCont);
    
    row.appendChild(document.createElement("hr"));

    tableBody.appendChild(row);
}

function displayLibrary() {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    tableBody.innerHTML = "";
    for (let i in myLibrary) {
        let book = myLibrary[i];
        createTableRow(book);
    };
};

function addBook() {
    let title, author, pages, status, newBook;

    // title
    title = document.getElementById('title').value;

    // author
    if (document.getElementById('author').value) {
        author = document.getElementById('author').value;
    } else {
        author = "Unknown"
    }

    // number of pages
    pages = parseInt(document.getElementById('pages').value);

    // status
    if (document.getElementById('read').checked) {
        status = true;
    } else if (document.getElementById('not-read').checked) {
        status = false;
    }

    // create book
    newBook = new Book(title, author, pages, status);

    // check if book already exist
    if (findBook(title)) {
        alert("This book already exist in your library!");
        dialog.close();
        return;
    }

    // add book to library
    myLibrary.push(newBook);
    updateLocalStorage();

    // update page
    displayLibrary();
    dialog.close();
}

function changeStatus(title) {
    for (let i in myLibrary) {
        if (myLibrary[i].title.toLowerCase() == title.toLowerCase()) {
            myLibrary[i].read = !myLibrary[i].read;
            break;
        }
    }
    updateLocalStorage();
}

function removeBook(title) {
    for (let i in myLibrary) {
        if (myLibrary[i].title.toLowerCase() == title.toLowerCase()) {
            myLibrary.splice(i, 1);
            break;
        }
    }
    updateLocalStorage();
}

function findBook(title) {
    for (let i in myLibrary) {
        if (title.toLowerCase() == myLibrary[i].title.toLowerCase()) {
            return true
        }
    }
    return false;
}

function updateLocalStorage() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}

displayLibrary();