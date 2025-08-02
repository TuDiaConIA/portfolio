import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Files, Fields } from 'formidable';
import fs from 'fs';
import sharp from 'sharp';

export const config = {
    api: {
        bodyParser: false,
    },
    };

    function getUploadedFile(files: Files): any {
    const keys = Object.keys(files);
    if (keys.length === 0) return null;
    const file = files[keys[0]];
    return Array.isArray(file) ? file[0] : file;
    }

    export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Método no permitido');
    }

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
        if (err) {
        console.error('❌ Error al parsear el formulario:', err);
        return res.status(400).json({ error: 'No se pudo procesar el formulario' });
        }

        const uploadedFile = getUploadedFile(files);
        if (!uploadedFile) {
        console.error('❌ No se encontró ningún archivo válido');
        return res.status(400).json({ error: 'No se encontró archivo para convertir' });
        }

        const filePath = uploadedFile.filepath;
        const from = (Array.isArray(fields.from) ? fields.from[0] : fields.from) ?? '';
        const to = (Array.isArray(fields.to) ? fields.to[0] : fields.to) ?? '';

        console.log('📥 Conversión:', from, '→', to);
        console.log('📁 Archivo en ruta temporal:', filePath);

        try {
        const imageBuffer = fs.readFileSync(filePath);
        const convertedBuffer = await sharp(imageBuffer)
            .toFormat(to as keyof sharp.FormatEnum)
            .toBuffer();

        res.setHeader('Content-Type', `image/${to}`);
        res.setHeader('Content-Disposition', `attachment; filename=converted.${to}`);
        return res.send(convertedBuffer);
        } catch (error: any) {
        console.error('🔥 Error al convertir con Sharp:', error.message || error);
        return res.status(500).json({
            error: 'Error al convertir la imagen',
            details: error.message || error,
        });
        }
    });
}
