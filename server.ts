const http = require('http')

let userData = {
    'asergeev@flo.team': 'jgF5tn4F',
    'vkotikov@flo.team': 'po3FGas8',
    'tpupkin@flo.team': 'tpupkin@flo.team'
}

http.createServer((req: any, res: any) => {

    if (req.method === 'GET') {
        getHandler(req.headers)

    }
    else if (req.method === 'POST') {
        postHandler(req)
    }
    else{
        console.log('Unknown method')
        res.statusCode(500);
    }


}).listen(3002)

function getHandler(requestHeader:any) {

    if (requestHeader.authorization === 'token') {
        //отдать объект галлереи
    }

}
function postHandler(request:any){
    request.on('data', (chunk: any) => {
        let test = chunk.toString()
        console.log(test)
    })
}