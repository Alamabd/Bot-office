import { downloadMediaMessage } from "baileys"
import { cancelQueue, generateOptionsPrint, printerConnection, printerQueue, printPDF } from "../feat/print.js"
import lang from "./lang.js";
import chalk from "chalk"
import fs from "fs"
import getStatics from "../feat/stats.js";
import { backup } from "../feat/backup.js";
import { exec } from 'child_process'

async function documentMessageHandler(message, pushName, txt) {
    const { caption, mimetype, fileName  } = message
    const text =  txt || caption
    console.log(chalk.gray(`Receive message doc from ${chalk.whiteBright(pushName)}: ${text.length >= 15 ? text.substring(0, 15) + "..." : text}`))    

    const mainCommand = text.split(' ')[0]
    const subCommand = text.split(' ')[1]
    const secondSubCommand = text.split(' ')[2]
    let data = {
        error: true,
        reply: ""
    }
    if(mainCommand === 'Lam' || mainCommand === 'lam') {
        data.error = false
        if((subCommand === 'print' || subCommand === 'Print') && mimetype === 'application/pdf') {
            const printerName = process.env.PRINTER
            const queue = await printerQueue(printerName)
            const connection = await printerConnection(printerName)
            
            if(connection === true) {
                if(!queue) {
                    const options = generateOptionsPrint(text)
                    const buffer = await downloadMediaMessage(message, 'buffer')
                    if(!fs.existsSync('./temp')) {
                        fs.mkdirSync('./temp')
                    }
                    const name = `${Date.now()}.pdf`
                    console.log(name)
                    fs.writeFileSync('./temp/' + name, buffer)
                    data.reply = lang('printerRunning')
                    printPDF(printerName, './temp/' + name, options)
                } else {
                    console.log("Announcement: Printer busy 1 queue")
                    data.reply = lang('printerBusy') + queue
                }
            } else {
                console.log("Announcement: Printer offline")
                data.reply = lang('printerOffline')
            }
        } else if(subCommand === 'Save' || subCommand === 'save') {
            try {
                const buffer = await downloadMediaMessage(message, 'buffer')
                const path = secondSubCommand ? secondSubCommand : pushName
                backup(buffer, path, fileName)
                data.reply = `📄 ${fileName} - ${lang('saved')}`
            } catch (error) {
                console.log(error)
                data.reply = `📄 ${fileName} - ${lang('errSave')}`
            }
        } else if(subCommand === undefined) {
            data.reply = lang('noIntrucDoc')
        } else {
            data.reply = `📄 ${subCommand} - ${lang('intrucNotExits')}`
        }
    }
    return data
}

async function conversationMessageHandler(message, pushName) {
    console.log(chalk.gray(`Receive message txt from ${chalk.whiteBright(pushName)}: ${message.length >= 15 ? message.substring(0, 15) + "..." : message}`))
    const mainCommand = message.split(" ")[0]
    const subCommand = message.split(" ")[1]
    const secondSubCommand = message.split(" ")[2]
    let data = {
        error: true,
        reply: lang('greating')
    }
    if((mainCommand === 'Lam' || mainCommand === 'lam')) {      
        data.error = false
        if(subCommand === 'stats') {
            data.reply = await getStatics(process.env.PRINTER)
        } else if(subCommand === 'menu') {
            data.reply = lang('menu')
        } else if(subCommand === 'print') {
            if(secondSubCommand === 'cancel') {
                const rawQueue = (await printerQueue())
                if(rawQueue !== false) {
                    const queue = rawQueue.split(' ')[0]
                    const cancel = (await cancelQueue(queue))
                    if(cancel) {
                        data.reply = lang('printerCancel') + queue + "."
                    } else {
                        data.reply = lang('printerCancelErr') + queue + "."
                    }
                } else {
                    data.reply = lang('printerIdle')
                }
            } else {
                data.reply = lang('print')
            }
        } else if(subCommand === 'save') {
            data.reply = lang('save')
        } else if(subCommand === 'off') {
            if(secondSubCommand === '2sukaraja') {
                data.reply = lang('off')
                setTimeout(() => {
                     exec('poweroff')
                }, 2000)
            } else {
                data.reply = lang('errOff')
            }
        }
    }
    return data
}

async function extendedMessageHandler(message, pushname) {
    const { documentMessage } = message.contextInfo.quotedMessage
    let data = {
        error: true,
        reply: ""
    }
    
    if(documentMessage) {
        data = documentMessageHandler(documentMessage, pushname, message.text)
    }
    return data
}

export { documentMessageHandler, conversationMessageHandler, extendedMessageHandler }
