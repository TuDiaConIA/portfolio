import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { promisify } from 'util'
import JSZip from 'jszip'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'

export const config = {
    api: { bodyParser: false },
}

const unlinkAsync = promisify(fs.unlink)
const tmpDir = os.tmpdir()

ffmpeg.setFfmpegPath(ffmpegStatic as string)

const AUDIO_FORMATS = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a']

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> =>
    new Promise((resolve, reject) => {
        const form = formidable({ multiples: true, keepExtensions: true })
        form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            else resolve({ fields, files })
        })
    })

const convertAudioFile = (
    inputPath: string,
    outputPath: string,
    fromFormat: string,
    toFormat: string
) =>
    new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .on('end', () => resolve())
            .on('error', reject)
            .run()
    })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed')
    let outputFiles: { name: string; path: string }[] = []
    let inputFiles: File[] = []
    try {
        const { fields, files } = await parseForm(req)
        const to = String(fields.to || '').toLowerCase()
        const from = String(fields.from || '').toLowerCase()

        // Aceptar tanto files.files como files.file
        let filesArr = files.files || files.file
        if (!filesArr) {
            console.error('[convert-audio] No files uploaded')
            return res.status(400).json({ error: 'No files uploaded' })
        }
        if (!Array.isArray(filesArr)) filesArr = [filesArr]
        inputFiles = filesArr as File[]

        // FILTRAR archivos vacíos
        inputFiles = inputFiles.filter(file => file.size && file.size > 0)
        if (!inputFiles.length) {
            console.error('[convert-audio] No files uploaded (size=0)')
            return res.status(400).json({ error: 'No files uploaded (size=0)' })
        }

        // Validar formatos (solo audio)
        if (!AUDIO_FORMATS.includes(from) || !AUDIO_FORMATS.includes(to)) {
            console.error('[convert-audio] Formato de audio no soportado', { from, to })
            return res.status(400).json({ error: 'Formato de audio no soportado' })
        }

        for (const file of inputFiles) {
            const inputPath = file.filepath
            const baseName = path.parse(file.originalFilename || file.newFilename).name
            const outPath = path.join(tmpDir, `${baseName}-convertido.${to}`)
            await convertAudioFile(inputPath, outPath, from, to)
            outputFiles.push({ name: `${baseName}.${to}`, path: outPath })
        }

        if (outputFiles.length === 1) {
            const { name, path: filePath } = outputFiles[0]
            res.setHeader('Content-Type', `audio/${to}`)
            res.setHeader('Content-Disposition', `attachment; filename="${name}"`)
            const fileStream = fs.createReadStream(filePath)
            fileStream.pipe(res)
            fileStream.on('end', async () => {
                await unlinkAsync(filePath)
                for (const file of inputFiles) await unlinkAsync(file.filepath)
            })
        } else {
            const zip = new JSZip()
            for (const file of outputFiles) {
                zip.file(file.name, fs.readFileSync(file.path))
            }
            const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
            res.setHeader('Content-Type', 'application/zip')
            res.setHeader('Content-Disposition', 'attachment; filename="convertidos.zip"')
            res.end(zipBuffer)
            // Cleanup
            for (const file of outputFiles) await unlinkAsync(file.path)
            for (const file of inputFiles) await unlinkAsync(file.filepath)
        }
    } catch (err) {
        for (const file of outputFiles) fs.existsSync(file.path) && unlinkAsync(file.path)
        for (const file of inputFiles) fs.existsSync(file.filepath) && unlinkAsync(file.filepath)
        console.error('[convert-audio]', err)
        res.status(500).json({ error: (err as Error).message })
    }
}
