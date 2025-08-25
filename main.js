import dotenv from "dotenv"
dotenv.config({ quiet: true })
import { makeWASocket, useMultiFileAuthState } from 'baileys'
import QRCode from 'qrcode-terminal'
import P from 'pino'
import chalk from 'chalk'
import fs from 'fs'
import { conversationMessageHandler, documentMessageHandler, extendedMessageHandler } from "./src/utils/messageHandler.js"

const { state, saveCreds } =  await useMultiFileAuthState('auth_info_baileys')

function main() {
    const sock = makeWASocket({
        auth: state,
        logger: P({ level: 'silent'}),
        markOnlineOnConnect: false
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, qr, lastDisconnect } = update
        if(qr) {
            QRCode.generate(qr, { small: true })
        }
        if(connection === 'open') {
            console.log(chalk.greenBright('Bot connected'))
        } else if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode
            console.log(chalk.redBright('Bot disconnecting'))
            if(shouldReconnect === 408 || shouldReconnect === 428) {
                const delay = process.env.DELAY_RECONECT
                console.log(chalk.greenBright(`Bot reconnecting ${delay} minutes`))
                setTimeout(() => {
                    main()
                }, delay * 60 * 1000)
            }
        }
    })

    sock.ev.on('messages.upsert', async (m) => {

        fs.writeFileSync('tesMessages/all.txt', JSON.stringify(m, null, 2))
        if(m.type === 'notify') {
            const { key, pushName, message } = m.messages[0]
            try {
                if(message.documentMessage) {
                    const { error, reply } = await documentMessageHandler(message.documentMessage, pushName)
                    if(!error) {
                        sock.sendMessage(key.remoteJid, { text: reply })
                    }
                } else if(message.documentWithCaptionMessage) {
                    const { error, reply } = await documentMessageHandler(message.documentWithCaptionMessage, pushName)
                    if(!error) {
                        sock.sendMessage(key.remoteJid, { text: reply })
                    }
                } else if(message.conversation) {
                    const { conversation } = message
                    const { reply, error } = await conversationMessageHandler(conversation, pushName)
                    if(!error) {
                        sock.sendMessage(key.remoteJid, { text: reply })
                    }
                } else if(message.extendedTextMessage) {
                    const { error, reply } = await extendedMessageHandler(message.extendedTextMessage, pushName)
                    if(!error) {
                        sock.sendMessage(key.remoteJid, { text: reply })
                    }
                } else {
                    const msgType = Object.keys(message)[0]
                    console.log(chalk.redBright(`No handler message type: ${msgType}`))
                }
            } catch (error) {
                console.log(chalk.red(error))
            }
        }
    })

    sock.ev.on('creds.update', saveCreds)
}
main()