import dotenv from "dotenv"
dotenv.config({ quiet: true })
import { makeWASocket, useMultiFileAuthState } from 'baileys'
import QRCode from 'qrcode-terminal'
import P from 'pino'
import fs from 'fs'
import { conversationMessageHandler, documentMessageHandler } from "./src/utils/messageHandler.js"
import logger from "./src/utils/pino.js"

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
            logger.info('Bot connected')
        } else if(connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode
            logger.error('Bot disconnecting')
            if(shouldReconnect === 408 || shouldReconnect === 428) {
                const delay = process.env.DELAY_RECONECT
                logger.info(`Bot reconnecting ${delay} minutes`)
                setTimeout(() => {
                    main()
                }, delay * 60 * 1000)
            }
        }
    })

    sock.ev.on('messages.upsert', async (m) => {
        if(m.type === 'notify') {
            const { key, message, pushName } = m.messages[0]
            if(message.documentMessage) {
                const { error, reply } = await documentMessageHandler(m.messages[0])
                if(!error) {
                    sock.sendMessage(key.remoteJid, { text: reply })
                }
            } else if(message.documentWithCaptionMessage) {
                const { error, reply } = await documentMessageHandler(message.documentMessage)
                if(!error) {
                    sock.sendMessage(key.remoteJid, { text: reply })
                }
            } else if(message.conversation) {
                const { conversation } = message
                const { reply, error } = await conversationMessageHandler(conversation, pushName)
                if(!error) {
                    sock.sendMessage(key.remoteJid, { text: reply })
                }
            } else {
                const msgType = Object.keys(message)[0]
                logger.warn(`No handler message type: ${msgType}`)
            }
        }
    })

    sock.ev.on('creds.update', saveCreds)
}
main()