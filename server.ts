import {IncomingMessage, ServerResponse} from "http";

const path = require('path')
const fs = require('fs')
const http = require('http')
let postResult: any

interface UserData {
    [email: string]: string;
}

let userData: UserData = {
    "asergeev@flo.team": 'jgF5tn4F',
    'vkotikov@flo.team': 'po3FGas8',
    'tpupkin@flo.team': 'tpupkin@flo.team'
}


http.createServer((request: IncomingMessage, response: ServerResponse) => {


    if (request.method === 'GET') {
        setHeaderAndSpendResponse(request, response, getHandler)

    } else if (request.method === 'POST') {
        setHeaderAndSpendResponse(request, response, postHandler)

    } else if (request.method === 'OPTIONS') {
        response.setHeader('Access-Control-Allow-Methods', "PUT,PATCH,DELETE,POST,GET")
        response.setHeader("Access-Control-Allow-Headers", "API-Key,Content-Type,If-Modified-Since,Cache-Control,Access-Control-Allow-Methods, Authorization")
        response.setHeader("Access-Control-Max-Age", "86400")
        response.setHeader('Access-Control-Allow-Origin', '*')

        response.writeHead(200)
        response.end()
    }
}).listen(5000)


function setHeaderAndSpendResponse(request: IncomingMessage, response: ServerResponse, handler: any) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    (async () => {
        let handlerResult = await handler(request)
        response.end(handlerResult)
    })()
}


function getHandler(request: any) {
    let reqexp = /page=\d/g;
    let test = /\d/g;
    const queryObject = request.url.match(reqexp).toString();
    let pageInUrl = queryObject.match(test)

    if (request.headers.authorization === 'token') {
        let arr: Array<string> = fs.readdirSync(`img/page${pageInUrl}`)
            .map((elem: any) => path.join(`/img/page${pageInUrl}/`, elem).toString());

        let galleryObj = {
            total: 3,
            page: Number(pageInUrl),
            objects: arr
        }

        return JSON.stringify(galleryObj)
    }else{
        return "Not authorization"
    }
}

async function postHandler(request: any) {
    let stringChunk;
    await request.on('data', (chunk: any) => {
        stringChunk = chunk.toString()
        postResult = checkUserAuthorizationData(JSON.parse(stringChunk))
    })
    return JSON.stringify(postResult)
}

function checkUserAuthorizationData(chunk: any) {
    let userDataFromQuery = chunk
    let userPasswordFromQuery = userDataFromQuery.password
    let userEmailFromQuery = userDataFromQuery.email

    let emailDbStatus = checkEmailInDB(userEmailFromQuery)
    let passwordDbStatus = checkPasswordInDB(userPasswordFromQuery, userEmailFromQuery)

    let authorizationData = passwordDbStatus && emailDbStatus

    if (authorizationData == true) {
        console.log('its work')
        return {token: "token"}

    } else {
        console.log('authorization error')
    }


}

function checkEmailInDB(userEmailFromQuery: string) {
    return userData.hasOwnProperty(userEmailFromQuery)
}

function checkPasswordInDB(userPasswordFromQuery: string, UserEmailFromQuery: string) {
    let passwordInDB = userData[UserEmailFromQuery]

    return passwordInDB === userPasswordFromQuery ? true : false
}