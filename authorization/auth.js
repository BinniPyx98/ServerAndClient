var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getGallery } from "../gallery/get_gallery.js";
let file = document.getElementById('uploadFile');
let clickOnButtonUpload = document.getElementById('uploadButton');
if (clickOnButtonUpload) {
    clickOnButtonUpload.addEventListener('click', ev => {
        ev.preventDefault();
        console.log('click');
        Upload(file);
    });
}
function Upload(file) {
    return __awaiter(this, void 0, void 0, function* () {
        let formData = new FormData();
        formData.append('photo', file.files[0]);
        if (!file) {
            console.log('not file');
        }
        else {
            console.log(formData.get('photo'));
            let resolve = yield fetch('http://localhost:5400/gallery', {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Methods': 'POST',
                },
                body: formData
            });
            let response = yield resolve.json();
            console.log(response.status);
        }
    });
}
//Ловит клик событие на кнопке LogIn и является точкой входа
let clickOnButtonLogIn = document.getElementById('logIn');
if (clickOnButtonLogIn) {
    clickOnButtonLogIn.addEventListener('click', ev => {
        ev.preventDefault();
        LogIn();
    });
}
// @ts-ignore
function LogIn() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield control_validation_authorization();
        console.log(result);
        if (result) {
            hidden_auth_form();
            getGallery();
            setTimeout(reset_gallery, 60000);
        }
    });
}
// @ts-ignore
function authorization(userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        let userJsonDate = JSON.stringify({
            email: userEmail,
            password: userPassword
        });
        let resolve = fetch('http://localhost:5400/auth', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Methods': 'POST',
                "Content-Type": "application/json"
            },
            body: userJsonDate
        });
        let response = yield resolve;
        if (response.status === 200) {
            let result = yield response.json();
            save_token(result);
            return true;
        }
        else {
            let result = yield response.json();
            console.log((result));
            return false;
        }
    });
}
function save_token(token) {
    localStorage.setItem('tokenData', token.token);
    console.log(token.token);
}
function server_error(error) {
    alert(error.errorMessage);
}
function getElement(tagId) {
    let Element = document.getElementById(tagId);
    return Element ? Element.value : alert("don't find tag");
}
// @ts-ignore
function control_validation_authorization() {
    return __awaiter(this, void 0, void 0, function* () {
        let validationResult = null;
        let authorizationResult = null;
        let regexp = /^.+@.+\..+$/igm;
        let regexpPass = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
        let userPassword = getElement('pass');
        let userEmail = getElement('email');
        if (userPassword && userEmail) {
            if (regexp.test(userEmail) && regexpPass.test(userPassword)) {
                validationResult = true;
                authorizationResult = yield authorization(userEmail, userPassword);
            }
            else {
                alert('некорректные данные');
            }
        }
        return validationResult && authorizationResult;
    });
}
function removeToken() {
    localStorage.removeItem('tokenData');
}
function remove_gallery() {
    let divGallery = document.getElementById('gallery');
    while (divGallery.firstChild) {
        divGallery.removeChild(divGallery.firstChild);
    }
}
function hidden_auth_form() {
    let authForm = document.getElementById('form');
    authForm.classList.toggle('hidden');
}
function reset_gallery() {
    removeToken();
    remove_gallery();
    hidden_auth_form();
}
//# sourceMappingURL=auth.js.map