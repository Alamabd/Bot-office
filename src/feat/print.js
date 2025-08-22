import { exec } from 'child_process'

function printerConnection(printerName) {
    return new Promise((resolve) => {
        exec('lpstat -p ' + printerName, (err, stdout) => {
            if(!err && !stdout.includes('disabled')){
                resolve(true)
            } else {
                resolve(false)
            }
        })  
    })
}

function printerQueue(printerName) {
    return new Promise((resolve) => {
        exec('lpstat -o ' + printerName, (err, stdout) => {
            if(!err && stdout.length > 1) {
                resolve(stdout)
            } else {
                resolve(false)
            }
        })
    })
}

function cancelQueue(program) {
    return new Promise((resolve) => {
        exec('cancel ' + program, (err, stdout) => {
            if(err) {
                console.log("Announcement: Cancel printer ",err)
                resolve(false)
            } else {
                console.log("Announcement: Cancel printer ",stdout)
                resolve(true)
            }
        })
    })
}

function generateOptionsPrint(cmd) {
    const options = {
        page: null,
        copy: null,
        orientation: null,
        size: null
    }

    const cmds = cmd.split(' ')
    cmds.map((val, idx) => {
        if(val === '-p') {
            options.page = cmds[idx+1]
        } else if(val === '-c') {
            options.copy = cmds[idx+1]
        } else if(val === '-o') {
            options.orientation = cmds[idx+1]
        } else if(val === 'A4') {
            options.size = 'A4'
        } else if(val === 'F4') {
            options.size = 'Legal'
        }
    })

    return options
}


function printPDF(printerName, filePath, options) {
    let cmd = 'lp -d ' + printerName
    if(options.page) {
        cmd += ' -P ' + options.page
    }
    if(options.copy) {
        cmd += ' -n ' + options.copy
    }
    if(options.orientation === 'lan') {
        cmd += ' -o orientation-requested=4'
    }
    if(options.orientation === 'pot') {
        cmd += ' -o orientation-requested=3'
    }
    if(options.size) {
        cmd += ' -o media=' + options.size
    }
    cmd += ' ' + filePath

    console.log('exec: ', cmd)
    exec(cmd, (err) => {
        if (err) {
            console.error("Announcement: error print :", err.message)
        }
    })
}


export {
    printerConnection,
    printerQueue,
    cancelQueue,
    generateOptionsPrint,
    printPDF,
}