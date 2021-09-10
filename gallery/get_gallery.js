var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
Загрузка изображения. Ловим клик по кнопке Upload и запускаем функцию Upload
 */
let inputFile = document.getElementById('uploadFile');
let clickOnButtonUpload = document.getElementById('uploadButton');
if (clickOnButtonUpload) {
    clickOnButtonUpload.addEventListener('click', ev => {
        ev.preventDefault();
        (() => __awaiter(void 0, void 0, void 0, function* () {
            yield Upload(inputFile);
        }))();
    });
}
function Upload(file) {
    return __awaiter(this, void 0, void 0, function* () {
        let formData = new FormData();
        formData.append('img', file.files[0]);
        if (!file) {
            console.log('not file');
        }
        else {
            let resolve = yield fetch(`http://localhost:5400/gallery?page=${getPage()}`, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Methods': 'POST',
                },
                body: formData
            });
            if (resolve.status == 200) {
                //window.location.reload()
            }
        }
    });
}
/*
 Create Gallery
 */
export function getGallery() {
    return __awaiter(this, void 0, void 0, function* () {
        let token = (localStorage.getItem('tokenData'));
        let resolve = yield fetch(getUrl(), {
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
        let galleryObject = null;
        let data = yield resolve.json();
        if (data) {
            galleryObject = data;
        }
        createGallery(galleryObject);
    });
}
function createGallery(galleryObject) {
    clearGallery();
    createImg(galleryObject);
}
function createImg(galleryObject) {
    let divGallery = document.getElementById('gallery');
    for (let url of galleryObject.objects) {
        let img = document.createElement('img');
        img.src = url;
        divGallery.appendChild(img);
    }
}
/*
Delete gallery
 */
function clearGallery() {
    let divGallery = document.getElementById('gallery');
    while (divGallery.firstChild) {
        divGallery.removeChild(divGallery.firstChild);
    }
}
/*
Get function
 */
function getPage() {
    return localStorage.getItem('page') ? localStorage.getItem('page') : 1;
}
function getUrl() {
    return `http://localhost:5400/gallery?page=${getPage()}`;
}
/*
Update function
 */
function updateURL(page) {
    window.history.pushState(window.location.href, null, `gallery?page=${page}`);
}
/*
Set function
 */
function setPage(num) {
    localStorage.setItem('page', num);
}
/*
Catch click button "Next"
 */
let clickButtonNext = document.getElementById('next');
if (clickButtonNext) {
    clickButtonNext.addEventListener('click', ev => {
        ev.preventDefault();
        let page = Number(getPage());
        if (page >= 3) {
            setPage(String(3));
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
/*
Catch click button "Back"
 */
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
//# sourceMappingURL=get_gallery.js.map