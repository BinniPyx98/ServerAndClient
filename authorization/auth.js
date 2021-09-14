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
/*
Catch click on button "LogIn" and start function LogIn
 */
let clickOnButtonLogIn = document.getElementById('logIn');
if (clickOnButtonLogIn) {
    clickOnButtonLogIn.addEventListener('click', ev => {
        ev.preventDefault();
        (() => __awaiter(void 0, void 0, void 0, function* () { yield LogIn(); }))();
    });
}
/*
Main function for authorization.Run after click
 */
function LogIn() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield control_validation_authorization();
        if (result) {
            hidden_auth_form();
            getGallery();
            setTimeout(reset_gallery, 60000);
        }
    });
}
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
function getElement(tagId) {
    let Element = document.getElementById(tagId);
    return Element ? Element.value : alert("don't find tag");
}
function authorization(userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        let resolve = yield sendAuthData(userEmail, userPassword);
        let token = yield resolve.json();
        if (resolve.status === 200) {
            let result = token;
            save_token(result);
            return true;
        }
        else {
            let result = token;
            console.log((result));
            return false;
        }
    });
}
function sendAuthData(userEmail, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        let userJsonDate = JSON.stringify({
            email: userEmail,
            password: userPassword
        });
        let resolve = yield fetch('http://localhost:5400/auth', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Methods': 'POST',
                "Content-Type": "application/json"
            },
            body: userJsonDate
        });
        return resolve;
    });
}
function save_token(token) {
    localStorage.setItem('tokenData', token.token);
    console.log(token.token);
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