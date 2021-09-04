import {IncomingMessage, ServerResponse} from "http";
const path = require('path')
const fs = require('fs')
const http = require('http')
let some: any

interface UserData {
    [name1: string]: string;
}
let userData: UserData = {
    "asergeev@flo.team": 'jgF5tn4F',
    'vkotikov@flo.team': 'po3FGas8',
    'tpupkin@flo.team': 'tpupkin@flo.team'
}


http.createServer((req: IncomingMessage, res: ServerResponse) => {

    if (req.method === 'GET') {
        let result = async function () {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(JSON.stringify(getHandler(req)))

        }
        result()


    } else if (req.method === 'POST') {

        let result = async function () {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.end(JSON.stringify(await postHandler(req)))
        }
        result()


    } else if (req.method === 'OPTIONS') {
        console.log('Options')

        res.setHeader('Access-Control-Allow-Methods', "PUT,PATCH,DELETE,POST,GET")
        res.setHeader("Access-Control-Allow-Headers", "API-Key,Content-Type,If-Modified-Since,Cache-Control,Access-Control-Allow-Methods, Authorization")
        res.setHeader("Access-Control-Max-Age", "86400")
        res.setHeader('Access-Control-Allow-Origin', '*')


        res.writeHead(200)


        res.end()

    }

}).listen(5000)


function getHandler(request: any) {
    let params = request.url.params
    console.log(params)
    if (request.headers.authorization === 'token') {
        let arr: Array<string> = fs.readdirSync(`img`)
            .map((elem:any) => path.join(`/img/`, elem).toString());
        let galleryObj={
            total:3,
            page:1,
            objects:arr
        }
        console.log(galleryObj)

        return galleryObj
    }
}

async function postHandler(request: any) {
    let c
    let result = await request.on('data', (chunk: any) => {
        c = chunk.toString()
        let a = JSON.parse(c)
        some = JSON.stringify(checkUserAuthorizationData(a))
    })

    return some
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

    if (passwordInDB === userPasswordFromQuery) {

        return true
    } else {

        return false
    }
}