import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { promisify } from 'util';
import sharp from 'sharp';
import JSZip from 'jszip';

export const config = {
    api: { bodyParser: false },
};

const unlinkAsync = promisify(fs.unlink);
const tmpDir = os.tmpdir();

// --- Helper para parsear el form ---
function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields, files: formidable.Files }> {
    return new Promise((resolve, reject) => {
        const form = formidable({ multiples: true, keepExtensions: true });
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
}

// --- Conversión de imágenes usando Sharp ---
async function convertImage(inputPath: string, outputPath: string, toFormat: string) {
    let image = sharp(inputPath);
    switch (toFormat) {
        case 'jpg':
        case 'jpeg':
            image = image.jpeg();
            break;
        case 'png':
            image = image.png();
            break;
        case 'webp':
            image = image.webp();
            break;
        case 'avif':
            image = image.avif();
            break;
        case 'gif':
            image = image.gif();
            break;
        default:
            throw new Error('Formato de salida no soportado');
    }
    await image.toFile(outputPath);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    let outputFiles: { name: string; path: string }[] = [];
    let inputFiles: File[] = [];
    try {
        const { fields, files } = await parseForm(req);
        const to = String(fields.to || '').toLowerCase();

        let filesArr = files.files;
        if (!filesArr) return res.status(400).json({ error: 'No files uploaded' });
        if (!Array.isArray(filesArr)) filesArr = [filesArr];
        inputFiles = filesArr as File[];
        // ---- AQUI ESTA EL FIX ----
        inputFiles = inputFiles.filter(file => file.size && file.size > 0);
        if (!inputFiles.length) return res.status(400).json({ error: 'No files uploaded (size=0)' });

        if (!to) return res.status(400).json({ error: 'Missing format parameter' });

        for (const file of inputFiles) {
            const inputPath = file.filepath;
            const baseName = path.parse(file.originalFilename || file.newFilename).name;
            const outPath = path.join(tmpDir, `${baseName}-convertido.${to}`);
            await convertImage(inputPath, outPath, to);
            outputFiles.push({ name: `${baseName}.${to}`, path: outPath });
        }

        // --- Respuesta ---
        if (outputFiles.length === 1) {
            const { name, path: filePath } = outputFiles[0];
            res.setHeader('Content-Type', `image/${to}`);
            res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('end', async () => {
                await unlinkAsync(filePath);
                for (const file of inputFiles) await unlinkAsync(file.filepath);
            });
        } else {
            // Varios archivos → ZIP
            const zip = new JSZip();
            for (const file of outputFiles) {
                zip.file(file.name, fs.readFileSync(file.path));
            }
            const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename="convertidos.zip"');
            res.end(zipBuffer);
            // Limpieza
            for (const file of outputFiles) await unlinkAsync(file.path);
            for (const file of inputFiles) await unlinkAsync(file.filepath);
        }
    } catch (err) {
        for (const file of outputFiles) fs.existsSync(file.path) && unlinkAsync(file.path);
        for (const file of inputFiles) fs.existsSync(file.filepath) && unlinkAsync(file.filepath);
        console.error('[convert-image]', err);
        res.status(500).json({ error: (err as Error).message });
    }
}
