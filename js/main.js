var siteName = document.querySelector('#site-name');
var siteURL = document.querySelector('#site-url');
var btn = document.querySelector('#submit');
var btnError = document.querySelector('#submitError');
var duplicateError = document.querySelector('#duplicateError');
var urlError = document.querySelector('#urlError');
var tableBody = document.querySelector('#table tbody');
var searchBookmark = document.querySelector('#search-Bookmark');
var updateSingleBookmark = document.querySelector('#update');
var globalIndex;
var bookmarks = [];



// Add input Site Name and URL
btn.addEventListener('click', function(event) {
    event.preventDefault(); 

    addBookmark();
});


// function save local storage data
if (localStorage.getItem('bookmarks') !== null) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    displayBookmarks(bookmarks);
}


// function add bookmark 
function addBookmark() {
    var siteNameValue = siteName.value.trim();
    var siteURLValue = siteURL.value.trim();

    if (siteNameValue === '' || siteURLValue === '') {
        btnError.classList.replace("d-none", "d-block");
        duplicateError.classList.add("d-none");
        return;
    } else {
        btnError.classList.replace("d-block", "d-none");
    }

    if (!isVaildURL(siteURLValue)) {
        urlError.classList.replace("d-none", "d-block");
        return;
    } else {
        urlError.classList.replace("d-block", "d-none");
    }

    if (isDuplicate(siteNameValue)) {
        duplicateError.classList.replace("d-none", "d-block");
        return;
    }

    duplicateError.classList.add("d-none");
    bookmarks.push({ name: siteNameValue, url: siteURLValue });

    displaySingleBookmark();

    siteName.value = '';
    siteURL.value = '';

    saveToLocalStorage();
}


// function  is duplicate name
function isDuplicate(name){
    return bookmarks.some(function (bookmark) {
        return bookmark.name.toLowerCase() === name.toLowerCase(); 
    });
}

// function is valid URL
function isVaildURL(string){
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (err) {
        return false;
    }
}

// function create row of table 
function displaySingleBookmark(bookmark, index) {
    // var bookmarkList = [...bookmarks];

    // bookmarkList.push({ name: bookmark.name, url: bookmark.url });

    displayBookmarks(bookmarks);
}


// function display lists of bookmarks
function displayBookmarks(bookmarkList, term=0) {
    if (bookmarkList.length > 0) {
        var tableRows = '';
        for (var i = 0; i < bookmarkList.length; i++) {
            tableRows += `
                <tr>
                    <th scope="row">${i + 1}</th>
                    <td>${term?bookmarkList[i].name.toLowerCase().replace(term , `<span class="bg-warning fw-bolder">${term}</span>`):bookmarkList[i].name}</td>
                    
                    <td>
                        <a href="${bookmarkList[i].url}" target="_blank" class="btn btn-success">
                            <i class="fa fa-eye"></i> Visit
                        </a>
                    </td>
                    <td>
                        <button onclick="setFormToUpdate(${i})" type="button" class="btn btn-primary">
                            <i class="fa-solid fa-pen-to-square"></i> Update
                        </button>
                    </td>
                    <td>
                        <button onclick="deleteSingleBookmark(${i})" type="button" class="btn btn-danger">
                            <i class="fa-solid fa-trash-can"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        }
        tableBody.innerHTML = tableRows;
    } else {
        tableBody.innerHTML = "<tr><td colspan='5' class='text-center text-danger'>No Bookmarks Found</td></tr>";
    }
}



//  function sava locaal Storage
function saveToLocalStorage() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// function set form update bookmark 
function setFormToUpdate(index) {

    globalIndex = index;
    console.log(globalIndex);

    var selectedBookmark = bookmarks[globalIndex];

    siteName.value = selectedBookmark.name;
    siteURL.value = selectedBookmark.url;


    btn.classList.add("d-none")
    updateSingleBookmark.classList.replace("d-none", "d-block")

    console.log("Editing bookmark:", selectedBookmark);
}


// function update bookmark
function updateBookmark() {
    if (globalIndex === undefined) {
        console.error("No bookmark selected for update.");
        return;
    }


    bookmarks[globalIndex].name = siteName.value.trim();
    bookmarks[globalIndex].url = siteURL.value.trim();


    saveToLocalStorage();

    
    displayBookmarks(bookmarks);

    
    siteName.value = '';
    siteURL.value = '';
    globalIndex = undefined;

    updateSingleBookmark.classList.replace("d-block", "d-none");
    btn.classList.remove("d-none")

    // console.log("Bookmark updated successfully.");
}


// delete Product Function
function deleteSingleBookmark(index) {
    if(Array.isArray(bookmarks)){
        // console.log("hiiiii", index);
        
        bookmarks.splice(index, 1);
        // console.log(bookmarks);

        displayBookmarks(bookmarks);
        saveToLocalStorage();
        
    }else{
        console.error('bookmarks is not an array');
    }
}



// function Search bookmarks
function searchOfBookmarks() {
    var bookmarkSearch = [];
    var term = searchBookmark.value;
    for(var i = 0; i < bookmarks.length; i++) {
        if(bookmarks[i].name.toLowerCase().includes(term.toLowerCase())) {
            // console.log("match", bookmarks[i], i);
            bookmarkSearch.push(bookmarks[i]);
        } 
        displayBookmarks(bookmarkSearch, term);
    }
}