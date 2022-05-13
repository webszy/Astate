import * as path from 'path'
import * as fs from 'fs'
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const cleanDir = function(path){
    if(fs.existsSync(path)){
        const files = fs.readdirSync(path)
        files.forEach(function(file){
            const curPath = path + '/' + file
            if(!fs.statSync(curPath).isDirectory()){
                fs.unlinkSync(curPath)
            }
        })
    }
}
cleanDir(path.resolve(__dirname, './dist'))
cleanDir(path.resolve(__dirname, './types'))
console.log('clean dist and types')
