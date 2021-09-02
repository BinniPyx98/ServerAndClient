var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//getGallery main function in file
export function getGallery() {
    return __awaiter(this, void 0, void 0, function* () {
        let token = JSON.parse(localStorage.getItem('tokenData'));
        let resolve = yield fetch(getUrl(), {
            method: "GET",
            headers: {
                'Authorization': token.token
            }
        });
        let galleryObject = null;
        let data = yield resolve.json();
        if (data) {
            galleryObject = data;
            console.log(galleryObject);
        }
        let A = createGallery(galleryObject);
    });
}
function getPage() {
    return localStorage.getItem('page') ? localStorage.getItem('page') : 1;
}
function setPage(num) {
    localStorage.setItem('page', num);
}
function getUrl() {
    return `http://localhost:5000/gallery/page`;
}
function createGallery(galleryObject) {
    clearGallery();
    createImg(galleryObject);
}
function clearGallery() {
    let divGallery = document.getElementById('gallery');
    while (divGallery.firstChild) {
        divGallery.removeChild(divGallery.firstChild);
    }
}
function createImg(galleryObject) {
    let divGallery = document.getElementById('gallery');
    console.log(galleryObject);
    for (let url of galleryObject) {
        let img = document.createElement('img');
        img.src = url;
        divGallery.appendChild(img);
    }
}
let clickButtonNext = document.getElementById('next');
if (clickButtonNext) {
    clickButtonNext.addEventListener('click', ev => {
        ev.preventDefault();
        let page = Number(getPage());
        if (page >= 5) {
            setPage(String(5));
            updateURL(page);
            alert("It's last page");
        }
        else {
            updateURL(page + 1);
            setPage(String(page + 1));
            (() => getGallery())();
        }
    });
}
//Отслеживаем нажатие на кнопку back
let clickButtonBack = document.getElementById('back');
if (clickButtonBack) {
    clickButtonBack.addEventListener('click', ev => {
        ev.preventDefault();
        let page = Number(getPage());
        if (page === 1) {
            updateURL(page);
            setPage(String(1));
            alert("It's first page");
        }
        else {
            updateURL(page - 1);
            setPage(String(page - 1));
            (() => getGallery())();
        }
    });
}
function updateURL(page) {
    window.history.pushState(window.location.href, null, `gallery?page=${page}`);
}
//# sourceMappingURL=get_gallery.js.map