import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import JSZip from 'jszip'
import pdfParse from 'pdf-parse'
import { Document, Packer, Paragraph } from 'docx'
import XLSX from 'xlsx'
import { parse as csvParse } from 'csv-parse/sync'
import { stringify as csvStringify } from 'csv-stringify/sync'
import PDFDocument from 'pdfkit'

export const config = { api: { bodyParser: false } }
const unlinkAsync = promisify(fs.unlink)
const readFileBuffer = (filepath: string) => fs.promises.readFile(filepath)

// TXT → PDF
async function textToPDFBuffer(text: string): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40, size: 'A4' })
    const chunks: any[] = []
    doc.on('data', chunk => chunks.push(chunk))
    doc.font('Helvetica')
    doc.text(text)
    doc.end()
    return await new Promise<Buffer>(resolve => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

// TXT → DOCX
function textToDocxBuffer(text: string): Promise<Buffer> {
    const doc = new Document({
        sections: [{ children: text.split('\n').map(line => new Paragraph(line)) }]
    })
    return Packer.toBuffer(doc)
}

// DOCX → TXT
async function docxToTxtBuffer(buffer: Buffer): Promise<Buffer> {
    const mammoth = require('mammoth')
    const { value } = await mammoth.extractRawText({ buffer })
    return Buffer.from(value, 'utf8')
}

// XLSX/XLS → PDF
async function xlsxToPDFBuffer(buffer: Buffer): Promise<Buffer> {
    const wb = XLSX.read(buffer, { type: 'buffer' })
    const wsname = wb.SheetNames[0]
    const ws = wb.Sheets[wsname]
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as (string | number)[][]

    const doc = new PDFDocument({ margin: 40, size: "A4" })
    const chunks: Buffer[] = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.font('Helvetica')
    data.forEach(row => {
        doc.text(
            (row as (string | number)[]).map(cell => String(cell ?? '')).join(' | '),
            { continued: false }
        )
        doc.moveDown(0.5)
    })
    doc.end()
    return await new Promise<Buffer>(resolve => {
        doc.on('end', () => resolve(Buffer.concat(chunks)))
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')
    let outputFiles: { name: string; path?: string; buffer?: Buffer }[] = []
    let inputFiles: File[] = []
    try {
        const { fields, files } = await new Promise<any>((resolve, reject) => {
            const form = formidable({ multiples: true, keepExtensions: true })
            form.parse(req, (err, fields, files) => {
                if (err) reject(err)
                else resolve({ fields, files })
            })
        })
        let filesArr = files.files || files.file || files.document
        if (!filesArr) return res.status(400).json({ error: 'No files uploaded' })
        if (!Array.isArray(filesArr)) filesArr = [filesArr]
        inputFiles = filesArr as File[]

        // Filtra archivos vacíos (size = 0)
        inputFiles = inputFiles.filter(file => file.size && file.size > 0)
        if (!inputFiles.length) return res.status(400).json({ error: 'No files uploaded (size=0)' })

        const from = String(fields.from || '').toLowerCase()
        const to = String(fields.to || '').toLowerCase()

        // Combinaciones válidas:
        const valid = (from: string, to: string) => (
            from !== to && (
                (from === 'pdf'  && to === 'docx') ||
                (from === 'docx' && to === 'pdf')  ||
                (from === 'pdf'  && to === 'txt')  ||
                (from === 'txt'  && to === 'pdf')  ||
                (from === 'docx' && to === 'txt')  ||
                (from === 'txt'  && to === 'docx') ||
                ((from === 'xlsx' || from === 'xls') && to === 'csv') ||
                (from === 'csv' && (to === 'xlsx' || to === 'xls')) ||
                ((from === 'xlsx' || from === 'xls') && to === 'pdf') // NUEVO: Excel a PDF
            )
        )

        if (!valid(from, to)) {
            return res.status(400).json({ error: `Conversión de ${from} a ${to} no soportada` })
        }

        for (const file of inputFiles) {
            const inputPath = file.filepath
            const baseName = path.parse(file.originalFilename || file.newFilename).name
            let outputBuffer: Buffer | null = null

            // --- PDF a DOCX ---
            if (from === 'pdf' && to === 'docx') {
                const pdf = await pdfParse(await readFileBuffer(inputPath))
                const paragraphs = pdf.text.split('\n').map((line: string) => new Paragraph(line)) 
                const doc = new Document({ sections: [{ children: paragraphs }] })
                outputBuffer = await Packer.toBuffer(doc)
                outputFiles.push({ name: `${baseName}.docx`, buffer: outputBuffer })

            // --- DOCX a PDF ---
            } else if (from === 'docx' && to === 'pdf') {
                const mammoth = require('mammoth')
                const { value: txt } = await mammoth.extractRawText({ buffer: await readFileBuffer(inputPath) })
                const pdfBuf = await textToPDFBuffer(txt)
                outputFiles.push({ name: `${baseName}.pdf`, buffer: pdfBuf })

            // --- PDF a TXT ---
            } else if (from === 'pdf' && to === 'txt') {
                const pdf = await pdfParse(await readFileBuffer(inputPath))
                outputFiles.push({ name: `${baseName}.txt`, buffer: Buffer.from(pdf.text, 'utf8') })

            // --- TXT a PDF ---
            } else if (from === 'txt' && to === 'pdf') {
                const txt = await readFileBuffer(inputPath)
                const pdfBuf = await textToPDFBuffer(txt.toString())
                outputFiles.push({ name: `${baseName}.pdf`, buffer: pdfBuf })

            // --- DOCX a TXT ---
            } else if (from === 'docx' && to === 'txt') {
                const buf = await readFileBuffer(inputPath)
                const txtBuf = await docxToTxtBuffer(buf)
                outputFiles.push({ name: `${baseName}.txt`, buffer: txtBuf })

            // --- TXT a DOCX ---
            } else if (from === 'txt' && to === 'docx') {
                const txt = await readFileBuffer(inputPath)
                const docBuf = await textToDocxBuffer(txt.toString())
                outputFiles.push({ name: `${baseName}.docx`, buffer: docBuf })

            // --- XLSX/XLS a CSV ---
            } else if ((from === 'xlsx' || from === 'xls') && to === 'csv') {
                const workbook = XLSX.read(await readFileBuffer(inputPath), { type: 'buffer' })
                const sheetName = workbook.SheetNames[0]
                const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName])
                outputFiles.push({ name: `${baseName}.csv`, buffer: Buffer.from(csv, 'utf8') })

            // --- CSV a XLSX/XLS ---
            } else if (from === 'csv' && (to === 'xlsx' || to === 'xls')) {
                const csv = await readFileBuffer(inputPath)
                const rows = csvParse(csv.toString())
                const wb = XLSX.utils.book_new()
                const ws = XLSX.utils.aoa_to_sheet(rows)
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
                const outType = to === 'xls' ? 'binary' : 'buffer'
                let buf: Buffer
                if (outType === 'buffer') {
                    buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }) as Buffer
                } else {
                    buf = XLSX.write(wb, { bookType: 'xls', type: 'buffer' }) as Buffer
                }
                outputFiles.push({ name: `${baseName}.${to}`, buffer: buf })

            // --- XLSX/XLS a PDF ---
            } else if ((from === 'xlsx' || from === 'xls') && to === 'pdf') {
                outputBuffer = await xlsxToPDFBuffer(await readFileBuffer(inputPath))
                outputFiles.push({ name: `${baseName}.pdf`, buffer: outputBuffer })
            }
        }

        // RESPUESTA
        if (outputFiles.length === 1) {
            const { name, buffer } = outputFiles[0]
            res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
            res.setHeader('Content-Type', getMimeType(name))
            res.end(buffer)
        } else {
            const zip = new JSZip()
            for (const file of outputFiles) {
                zip.file(file.name, file.buffer!)
            }
            const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
            res.setHeader('Content-Type', 'application/zip')
            res.setHeader('Content-Disposition', 'attachment; filename="convertidos.zip"')
            res.end(zipBuffer)
        }

        // Cleanup
        for (const file of inputFiles) fs.existsSync(file.filepath) && unlinkAsync(file.filepath)
    } catch (err) {
        for (const file of inputFiles) fs.existsSync(file.filepath) && unlinkAsync(file.filepath)
        res.status(500).json({ error: (err as Error).message })
    }
}

// MIME types helper
function getMimeType(filename: string) {
    if (filename.endsWith('.pdf')) return 'application/pdf'
    if (filename.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (filename.endsWith('.txt')) return 'text/plain'
    if (filename.endsWith('.csv')) return 'text/csv'
    if (filename.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (filename.endsWith('.xls')) return 'application/vnd.ms-excel'
    return 'application/octet-stream'
}
