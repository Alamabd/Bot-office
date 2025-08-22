const en = {
    menu: "🤖 Bot Menu\n───────────────\n1. print <options>\n2. save\n3. stats\n4. off <password>\n───────────────\nlam is the main command.",
    print: "📄 To print, please send me a PDF file with the description in this format:\nLam print -p <page> -c <copy> -o <orientation>\n✨ Example:\n*Lam print -p 1 -c 1 -o pot A4*\n🔎 Explanation:\n-p 1 → print 1 page (1 default)\n-c 1 → print 1 copy (1 default)\n-o pot → orientation: pot (default portrait) / lan (landscape)\nA4 → size: A4 (default) / f4\n *cancel* to clear the queue.",
    save: "📄 To save, please send me a Documents file with a caption in this format:\n*Lam save*.",
    greating: "Hello everyone 👋 I’m a bot that will help automate some tasks for you.\n*Lam menu* to see what I can do 🚀.",
    printerRunning: "🖨️ The printer is running, please wait a moment.",
    printerIdle: "🖨️ Printer is idle.",
    printerBusy: "🖨️ The printer is busy, please wait a moment.\nProcces: ",
    printerOffline: " 🖨️ Printer offline.",
    printerCancel: "🖨️ Canceling the process ",
    printerCancelErr: "🖨️ Failed to cancel process ",
    saved: "Backup successfully.",
    errSave: "Failed to backup.",
    noIntrucDoc: "📄 No intruction for document.",
    intrucNotExits: "📄 Instruction does not exist for document.",
    off: "👋 Goodbye.",
    errOff: "🔒 Password incorect."
}

const id = {
    menu: "🤖 Menu Bot\n───────────────\n1. print <opsi>\n2. save\n3. stats\n4. off <sandi>\n──────────────\nlam adalah perintah utama.",
    print: "📄 Untuk mencetak, silakan kirimkan saya berkas PDF dengan keterangan dalam format ini:\nLam print -p <halaman> -c <salinan> -o <orientasi>\n✨ Contoh:\n*Lam print -p 1 -c 1 -o pot A4*\n🔎 Penjelasan:\n-p 1 → cetak 1 halaman (1 default)\n-c 1 → cetak 1 salinan (1 default)\n-o pot → orientasi: pot (potret default) / lan (lanskap)\nA4 → ukuran: A4 (default) / f4\n *cancel* untuk hapus antrian.",
    save: "📄 Untuk menyimpan, silakan kirimkan saya file Dokumen dengan judul dalam format ini:\n*Lam save*.",
    greating: "Halo semuanya 👋 Saya bot yang akan membantu mengotomatiskan beberapa tugas untuk Anda.\n*Lam menu* untuk melihat apa yang bisa saya lakukan 🚀.",
    printerRunning: "🖨️ Printer sedang berjalan, mohon tunggu beberapa saat.",
    printerIdle: "🖨️ printer sedang menganggur.",
    printerBusy: "🖨️ Printer sedang sibuk, mohon tunggu beberapa saat.\nProses: ",
    printerOffline: " 🖨️ Printer offline.",
    printerCancel: "🖨️ Membatalkan proses ",
    printerCancelErr: "🖨️ Gagal membatalkan proses ",
    saved: "berhasil disimpan.",
    errSave: "gagal disimpan.",
    noIntrucDoc: "📄 Tidak ada instruksi untuk dokumen.",
    intrucNotExits: "📄 instruksi tidak ada untuk dokumen.",
    off: "👋 Sampai jumpa.",
    errOff: "🔒 Password tidak sesuai."
}

function lang(name) {
    const lang = process.env.REPL_LANG === 'en' ? en : id
    return lang[name]
}

export default lang