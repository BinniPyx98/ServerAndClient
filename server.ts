import {IncomingMessage, ServerResponse} from "http";

const path = require('path')
const fs = require('fs')
const http = require('http')

type AuthResult = string | {token:string} //string if error
let authResult: AuthResult

interface UserAuthDBData {
    [email: string]: string;
}
let userAuthDBData: UserAuthDBData = {
    "asergeev@flo.team": 'jgF5tn4F',
    'vkotikov@flo.team': 'po3FGas8',
    'tpupkin@flo.team': 'tpupkin@flo.team'
}


//// Run server
http.createServer((request: IncomingMessage, response: ServerResponse) => {


    if (request.method === 'GET') {
        setHeaderAndSpendResponse(request, response, getHandler)

    } else if (request.method === 'POST') {
        setHeaderAndSpendResponse(request, response, postHandler)

    } else if (request.method === 'OPTIONS') {
        let responseWithAHeader = setHeaderForOptions(response)

        responseWithAHeader.end()
    }

}).listen(5000)



function setHeaderForOptions(response:ServerResponse):ServerResponse {
    response.setHeader('Access-Control-Allow-Methods', "PUT,PATCH,DELETE,POST,GET")
    response.setHeader("Access-Control-Allow-Headers", "API-Key,Content-Type,If-Modified-Since,Cache-Control,Access-Control-Allow-Methods, Authorization")
    response.setHeader("Access-Control-Max-Age", "86400")
    response.setHeader('Access-Control-Allow-Origin', '*')

    response.writeHead(200)
    return response
}

function setHeaderAndSpendResponse(request: IncomingMessage, response: ServerResponse, handler: any):void {
    response.setHeader('Access-Control-Allow-Origin', '*');
    (async () => {
        let handlerResult = await handler(request) //handler is either getHandler or postHandler
        response.end(handlerResult)      //send handlerResult
    })()
}



//////Get Handler
type GetHandler=string|{
                         total:number,
                         page:number,
                         objects:Array<string>
                       }

function getHandler(request: IncomingMessage):GetHandler {
    let regexpFindPageExpression= /page=\d/g;
    let regexpFindNumberPage = /\d/g;

    const page = String(request.url!.match(regexpFindPageExpression)) // string "page=..."
    let pageNumber = page.match(regexpFindNumberPage)                  // number

    if (request.headers.authorization === 'token') {
        // Read img path
        let arr: Array<string> = fs.readdirSync(`img/page${pageNumber}`)
            .map((elem: any) => path.join(`/img/page${pageNumber}/`, elem).toString());

        let galleryObj = {
            total: 3,
            page: Number(pageNumber),
            objects: arr
        }

        return JSON.stringify(galleryObj)
    } else {
        return "Not authorization"
    }
}


///////////Post Handler
async function postHandler(request: IncomingMessage) {
    let dataFromChunk;

    await request.on('data', (chunk: any) => {
        dataFromChunk = chunk.toString()
        authResult = checkUserAuthorizationData(JSON.parse(dataFromChunk))
    })

    return JSON.stringify(authResult)
}


//////Authorization
function checkUserAuthorizationData(chunk: any):AuthResult {
    let userDataFromQuery = chunk
    let userPasswordFromQuery = userDataFromQuery.password
    let userEmailFromQuery = userDataFromQuery.email

    let emailDbStatus = checkEmailInDB(userEmailFromQuery)
    let passwordDbStatus = checkPasswordInDB(userPasswordFromQuery, userEmailFromQuery)

    let authorizationData = passwordDbStatus && emailDbStatus

    if (authorizationData == true) {
        console.log('successful authorization')
        return {token: "token"}

    } else {
        console.log('authorization error')
        return "authorization error"
    }


}

function checkEmailInDB(userEmailFromQuery: string):boolean {
    return userAuthDBData.hasOwnProperty(userEmailFromQuery)
}

function checkPasswordInDB(userPasswordFromQuery: string, UserEmailFromQuery: string):boolean {
    let passwordInDB = userAuthDBData[UserEmailFromQuery]

    return passwordInDB === userPasswordFromQuery ? true : false
}