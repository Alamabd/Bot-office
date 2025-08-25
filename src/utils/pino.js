import pino from 'pino'

const logger = pino({
    transport: {
        targets : [
            {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                    singleLine: false, 
                }
            },
            {
                target: 'pino-pretty',
                options: {
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                    singleLine: false,
                    destination: './logs/log',
                    mkdir: true,
                    interval: '1d',
                    rotate: true
                }
            }
        ]
    },
    level: "info"
})

export default logger