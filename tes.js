import dotenv from 'dotenv'
dotenv.config({ quiet: true })
import fs from 'fs'
import si from 'systeminformation'
import chalk from 'chalk'
import { printerConnection, printerQueue } from './src/feat/print.js'
import { conversationMessageHandler, documentMessageHandler } from './src/utils/messageHandler.js'

const args = process.argv
const command = args[2]

async function main() {
    if(command === 'doc') {
        const raw = fs.readFileSync('./tesMessages/doc.json', { encoding: 'utf-8' })
        const data = JSON.parse(raw)
        
        const docHandler = await documentMessageHandler(data.messages[0])
        console.log("Result: ", docHandler)
        console.log("Response: ", chalk.gray(docHandler.reply))
    } else if(command === 'conv') {
        const raw = fs.readFileSync('./tesMessages/conversation.txt', { encoding: 'utf-8' })
        const data = JSON.parse(raw)

        const convHandler = await conversationMessageHandler(data, "alam")
        console.log("Result: ", convHandler)
        console.log("Response: ", chalk.gray(convHandler.reply))
    } else if(command === 'sys') {
        console.log("Checking system configuration/integration:")
        console.log(chalk.gray("-".repeat(30)))
        console.log(chalk.gray("checking wifi ..."))
        const { ssid, quality } = (await si.wifiNetworks())[0] || { ssid: null, quality: null}
        const wifiCOn = ssid ? chalk.green(ssid) : chalk.red("No")
        const wifiQuality = quality ? chalk.green(quality) : chalk.red("null")
        console.log(chalk.gray("Connection : ") + wifiCOn)
        console.log(chalk.gray("Quality    : ") + wifiQuality)
        console.log(chalk.gray("-".repeat(30)))
        console.log(chalk.gray("checking printer ..."))
        const printerName = process.env.PRINTER
        const printCon = (await printerConnection(printerName)) ? chalk.green("On") : chalk.red("Off")
        const printQueue = (await printerQueue(printerName)) ? "1" : "0"
        console.log(chalk.gray("Connection : ") + printCon)
        console.log(chalk.gray("Queue      : ") + printQueue)
    } else {
        console.log("How to use tes.js with argv[2]:")
        console.log(chalk.gray("-".repeat(30)))
        console.log(chalk.gray("1. doc - for document chat"))
        console.log(chalk.gray("2. conv - for document convarsation chat"))
        console.log(chalk.gray("Costumis for data chat, please see folder ") + chalk.gray.underline("/tesMessages"))
        console.log(chalk.gray("-".repeat(30)))
        console.log(chalk.gray("1. sys - for system configuration"))
    }
}

main()