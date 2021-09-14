import {getGallery} from "../gallery/get_gallery.js";

/*
Catch click on button "LogIn" and start function LogIn
 */
let clickOnButtonLogIn: HTMLElement = document.getElementById('logIn')

if (clickOnButtonLogIn) {
    clickOnButtonLogIn.addEventListener('click', ev => {
        ev.preventDefault();
        (async ()=>{await LogIn()})()
    })
}

/*
Main function for authorization.Run after click
 */
async function LogIn(): Promise<void> {
    let result: boolean = await control_validation_authorization();
    if (result) {
        hidden_auth_form();
        getGallery()
        setTimeout(reset_gallery, 60000);
    }
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

function getElement(tagId: string): string | void {
    let Element: HTMLInputElement = <HTMLInputElement>document.getElementById(tagId);
    return Element ? Element.value : alert("don't find tag");
}

async function authorization(userEmail: string, userPassword: string): Promise<boolean> {

    let resolve = await sendAuthData(userEmail, userPassword)
    let token = await resolve.json()

    if (resolve.status === 200) {
        let result: string = token;
        save_token(result);

        return true
    } else {
        let result: string = token;
        console.log((result));

        return false
    }
}

async function sendAuthData(userEmail: string, userPassword: string) {
    let userJsonDate: any = JSON.stringify({
        email: userEmail,
        password: userPassword
    })

    let resolve = await fetch('http://localhost:5400/auth', {
        method: 'POST',
        headers: {
            'Access-Control-Allow-Methods': 'POST',
            "Content-Type": "application/json"
        },
        body: userJsonDate
    })
    return resolve
}

function save_token(token: any): void {
    localStorage.setItem('tokenData', token.token);
    console.log(token.token)

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
