import {IncomingMessage, ServerResponse} from "http";

const http = require('http')

interface test {
    [name1: string]: string;
}

let userData: test = {
    "asergeev@flo.team": 'jgF5tn4F',
    'vkotikov@flo.team': 'po3FGas8',
    'tpupkin@flo.team': 'tpupkin@flo.team'
}

http.createServer((req: IncomingMessage, res: ServerResponse) => {

    if (req.method === 'GET') {
        getHandler(req.headers)

    } else if (req.method === 'POST') {
        postHandler(req)
    } else {
        console.log('Unknown method')
    }

}).listen(3000)

function getHandler(requestHeader: any) {

    if (requestHeader.authorization === 'token') {
        //отдать объект галлереи
    }

}

interface d {
    email: string;
    password: string;
}

async function postHandler(request: any) {

    await request.on('data', (chunk: any) => {

        checkUserAuthorizationData(chunk);

    })
}

function checkUserAuthorizationData(chunk:any) {
    let userDataFromQuery = JSON.parse(chunk)
    let userPasswordFromQuery = userDataFromQuery.password
    let userEmailFromQuery = userDataFromQuery.email

    let emailDbStatus = checkEmailInDB(userEmailFromQuery)
    let passwordDbStatus = checkPasswordInDB(userPasswordFromQuery, userEmailFromQuery)
    console.log(emailDbStatus)
    console.log(passwordDbStatus)
    let authorizationData = passwordDbStatus && emailDbStatus

    if (authorizationData==true){
        // send token
        console.log('its work')
    }
    else{
        console.log('authorization error')
    }


}

function checkEmailInDB(userEmailFromQuery:string) {
    return userData.hasOwnProperty(userEmailFromQuery)
}

function checkPasswordInDB(userPasswordFromQuery:string, UserEmailFromQuery:string) {
    let passwordInDB = userData[UserEmailFromQuery]

    if (passwordInDB === userPasswordFromQuery) {

        return true
    } else {

        return false
    }
}