/*
Загрузка изображения. Ловим клик по кнопке Upload и запускаем функцию Upload
 */
let inputFile = <HTMLInputElement>document.getElementById('uploadFile');
let clickOnButtonUpload: HTMLElement = document.getElementById('uploadButton')

if (clickOnButtonUpload) {
    clickOnButtonUpload.addEventListener('click', ev => {
        ev.preventDefault();
        (async () => {
            await Upload(inputFile);
        })()
    })
}

async function Upload(file: any) {
    let formData = new FormData();
    formData.append('img', file.files[0])

    if (!file) {
        console.log('not file')
    } else {
        let resolve = await fetch(`http://localhost:5400/gallery?page=${getPage()}`, {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Methods': 'POST',
            },
            body: formData
        })
        if (resolve.status == 200) {
            //window.location.reload()

        }
    }
}


/*
 Create Gallery
 */
export async function getGallery(): Promise<void> {
    let token = (localStorage.getItem('tokenData'));
    let resolve = await fetch(getUrl(), {
        method: "GET",
        headers: {
            'Authorization': token
        }
    })

    let galleryObject = null;
    let data = await resolve.json()

    if (data) {
        galleryObject = data;
    }

    createGallery(galleryObject);
}


function createGallery(galleryObject: any): void {
    clearGallery();
    createImg(galleryObject);
}

function createImg(galleryObject: any): void {
    let divGallery: HTMLElement = document.getElementById('gallery');

    for (let url of galleryObject.objects) {
        let img: HTMLImageElement = document.createElement('img');
        img.src = url;
        divGallery.appendChild(img);
    }
}


/*
Delete gallery
 */
function clearGallery(): void {
    let divGallery: HTMLElement = document.getElementById('gallery');

    while (divGallery.firstChild) {
        divGallery.removeChild(divGallery.firstChild);
    }
}

/*
Get function
 */
function getPage(): string | number {
    return localStorage.getItem('page') ? localStorage.getItem('page') : 1;
}

function getUrl(): string {
    return `http://localhost:5400/gallery?page=${getPage()}`;
}


/*
Update function
 */
function updateURL(page: number): void {
    window.history.pushState(window.location.href, null, `gallery?page=${page}`);
}


/*
Set function
 */
function setPage(num: string): void {
    localStorage.setItem('page', num);
}


/*
Catch click button "Next"
 */
let clickButtonNext = document.getElementById('next')

if (clickButtonNext) {
    clickButtonNext.addEventListener('click', ev => {
        ev.preventDefault()
        let page: number = Number(getPage());

        if (page >= 3) {
            setPage(String(3));
            updateURL(page);
            alert("It's last page");
        } else {
            updateURL(page + 1);
            setPage(String(page + 1));
            (() => getGallery())()
        }
    })

}

/*
Catch click button "Back"
 */
let clickButtonBack = document.getElementById('back')

if (clickButtonBack) {
    clickButtonBack.addEventListener('click', ev => {
        ev.preventDefault()
        let page: number = Number(getPage());

        if (page === 1) {
            updateURL(page);
            setPage(String(1));
            alert("It's first page");
        } else {
            updateURL(page - 1);
            setPage(String(page - 1));
            (() => getGallery())()
        }
    })
}




