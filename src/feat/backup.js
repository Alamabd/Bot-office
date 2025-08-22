export function backup(buffer, path, fileName) {
    const date = new Date()
    const now = date.toLocaleDateString("ID").replaceAll('/', '-')
    const name = `${now}_${fileName}`

    if(!fs.existsSync('./backup')) {
        fs.mkdirSync('./backup')
    }
    if(!fs.existsSync('./backup/' + path)) {
        fs.mkdirSync('./backup/' + path)
    }
    fs.writeFileSync('./backup/' + path + '/' + name, buffer)
}