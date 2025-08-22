import si from "systeminformation"
import { printerConnection, printerQueue } from "./print.js"

async function getStatics() {
    const { percent } = await si.battery()
    const { vendor, brand } = await si.cpu()
    const { manufacturer } = await si.chassis()
    const { name } = (await si.diskLayout())[0]
    const { main } =await si.cpuTemperature()
    const printerName = process.env.PRINTER
    const printQueue = await printerQueue(printerName)
    const printCon = await printerConnection(printerName)

    return `*Statistics server*\n\n💻 Brand : ${manufacturer}\n🧨 Cpu: ${vendor} - ${brand}\n🔋 Battery: ${percent}%\n💾 Disk: ${name}\n🚨 Temperature: ${main}°C ${main > 69 ? "critical" : "normal"}\n🖨️ Printer Connection: ${printCon ? "on" : "off"}\n🖨️ Printer job: ${printQueue ? "1" : "0"}`
}

export default getStatics