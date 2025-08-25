import fs from 'fs'

export function backup(buffer, path, fileName) {
    const date = new Date()
    const now = date.toLocaleDateString("ID").replaceAll('/', '-')
    const name = `${now}_${fileName}`

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
    console.log('./backup/' + path + '/' + name)
    // fs.writeFileSync('./backup/' + path + '/' + name, buffer)
}