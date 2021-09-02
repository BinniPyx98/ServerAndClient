import {getGallery} from "../gallery/get_gallery.js";


//Ловит клик событие на кнопке LogIn и является точкой входа
let clickOnButtonLogIn:HTMLElement = document.getElementById('logIn')

if (clickOnButtonLogIn) {
    clickOnButtonLogIn.addEventListener('click', ev => {
        ev.preventDefault()
        LogIn()
    })
}

async function LogIn(): Promise<void> {

    let result: boolean = await control_validation_authorization();

    if (result) {
        hidden_auth_form();
        getGallery()
        setTimeout(reset_gallery, 60000);
    }
}

async function authorization(userEmail: string, userPassword: string): Promise<boolean> {

    let userJsonDate: any = JSON.stringify({
        email: userEmail,
        password: userPassword
    })
    

    let resolve = fetch('http://localhost:5000', {
        method: 'POST',
    
        headers: {
            'Access-Control-Allow-Methods':'POST',
            "Content-Type": "application/json"

        },
        body: userJsonDate
    })
    let response = await resolve;

    if (response.status === 200) {
        let result: string = await response.json();        
        save_token(result);
        return true
    } else {
        let result: string = await response.json();
        console.log(  (result));
      
        return false
    }
}

function save_token(token: string): void {
    localStorage.setItem('tokenData', token);
}

function server_error(error: any): void {
    alert(error.errorMessage);
}

function getElement(tagId: string): string | void {
    let Element: HTMLInputElement = <HTMLInputElement>document.getElementById(tagId);
    return Element ? Element.value : alert("don't find tag");
}

async function control_validation_authorization(): Promise<boolean> {
    let validationResult: boolean = null;
    let authorizationResult: boolean = null;
    let regexp: RegExp = /^.+@.+\..+$/igm;
    let regexpPass: RegExp = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}$/;
    let userPassword: string | void = getElement('pass');
    let userEmail: string | void = getElement('email');

    if (userPassword && userEmail) {
        if (regexp.test(userEmail) && regexpPass.test(userPassword)) {
            validationResult = true;
            authorizationResult = await authorization(userEmail, userPassword);
        } else {
            alert('некорректные данные')
        }
    }
    return validationResult && authorizationResult
}

function removeToken(): void {
    localStorage.removeItem('tokenData');
}

function remove_gallery(): void {
    let divGallery: HTMLElement = document.getElementById('gallery');

    while (divGallery.firstChild) {
        divGallery.removeChild(divGallery.firstChild);
    }
}

function hidden_auth_form(): void {
    let authForm: HTMLElement = document.getElementById('form');
    authForm.classList.toggle('hidden');
}

function reset_gallery(): void {
    removeToken();
    remove_gallery();
    hidden_auth_form();
}
