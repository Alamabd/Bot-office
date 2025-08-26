import { downloadMediaMessage } from "baileys"
import { cancelQueue, generateOptionsPrint, printerConnection, printerQueue, printPDF } from "../feat/print.js"
import lang from "./lang.js";
import fs from "fs"
import getStatics from "../feat/stats.js";
import { backup } from "../feat/backup.js";
import { exec } from 'child_process'
import logger from "./pino.js";


async function documentMessageHandler(m) {
    const { pushName } = m
    const { caption, mimetype, fileName } = m.message.documentMessage
    logger.info(`Receive message doc from ${pushName}: ${caption.length >= 15 ? caption.substring(0, 15) + "..." : caption}`)

    const mainCommand = caption.split(' ')[0]
    const subCommand = caption.split(' ')[1]
    const secondSubCommand = caption.split(' ')[2]
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
                    const options = generateOptionsPrint(caption)
                    const buffer = await downloadMediaMessage(m, 'buffer')
                    if(!fs.existsSync('./temp')) {
                        fs.mkdirSync('./temp')
                    }
                    const name = `${Date.now()}.pdf`
                    fs.writeFileSync('./temp/' + name, buffer)
                    data.reply = lang('printerRunning')
                    printPDF(printerName, './temp/' + name, options)
                    logger.info(name + ' printed')
                } else {
                    logger.warn("Printer busy 1 queue")
                    data.reply = lang('printerBusy') + queue
                }
            } else {
                logger.warn("Printer offline")
                data.reply = lang('printerOffline')
            }
        } else if(subCommand === 'Save' || subCommand === 'save') {
            try {   
                const buffer = await downloadMediaMessage(m, 'buffer')
                const path = secondSubCommand ? secondSubCommand : pushName
                backup(buffer, path, fileName)
                data.reply = `📄 ${fileName} - ${lang('saved')}`
                logger.info(fileName + " saved")
            } catch (error) {
                data.reply = `📄 ${fileName} - ${lang('errSave')}`
                logger.error(error.message)
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
    logger.info(`Receive message txt from ${pushName}: ${message.length >= 15 ? message.substring(0, 15) + "..." : message}`)
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

export { documentMessageHandler, conversationMessageHandler }
