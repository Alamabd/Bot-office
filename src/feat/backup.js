import fs from 'fs'

export function backup(buffer, path, fileName) {
    const dateRaw = new Date()
    const date = dateRaw.toLocaleDateString("ID").replaceAll('/', '-')
    const time = dateRaw.toLocaleTimeString("ID").replaceAll(':', '-')
    const name = `${date}_${time}_${fileName}`

    
    if(path.substring(0, 1) === '/') {
        path = path.substring(1)
    }
    if(path.substring(0, 2) === './') {
        path = path.substring(2)
    }
    if(path.slice(-1) === '/') {
        path = path.slice(0, -1)
    }

    if(!fs.existsSync('./backup')) {
        fs.mkdirSync('./backup')
    }
    if(!fs.existsSync('./backup/' + path)) {
        fs.mkdirSync('./backup/' + path)
    }

    fs.writeFileSync('./backup/' + path + '/' + name, buffer)
}