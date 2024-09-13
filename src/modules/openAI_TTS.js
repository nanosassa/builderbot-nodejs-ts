import fs  from 'fs';
import path from 'path';
import { uuidv4 }  from 'uuid';
import {OpenAI} from 'openai';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

const ffmpegPromise = promisify(ffmpeg);

const apiKey = process.env.OPENAI_API_KEY || 'your-api-key-here';
const openai = new OpenAI({ apiKey });

const textToVoice = async (text, voice = 'onyx', model = 'tts-1-hd') => {
    try {
        // Crear directorio tmp si no existe
        const tmpDir = path.join(__dirname, 'tmp');
        await fs.mkdir(tmpDir, { recursive: true });

        // Generar nombres de archivo únicos
        const mp3FileName = `audio_${uuidv4()}.mp3`;
        const oggFileName = `audio_${uuidv4()}.ogg`;
        const mp3FilePath = path.join(tmpDir, mp3FileName);
        const oggFilePath = path.join(tmpDir, oggFileName);

        // Generar el audio usando la API de OpenAI
        const mp3 = await openai.audio.speech.create({
            model: model,
            voice: voice,
            input: text,
        });

        // Convertir la respuesta a un Buffer y guardar como MP3
        const buffer = Buffer.from(await mp3.arrayBuffer());
        await fs.writeFile(mp3FilePath, buffer);

        // Convertir MP3 a OGG
        await ffmpegPromise()
            .input(mp3FilePath)
            .audioCodec('libopus')
            .toFormat('ogg')
            .on('end', () => console.log('Conversión completada'))
            .save(oggFilePath);

        // Eliminar el archivo MP3 temporal
        await fs.unlink(mp3FilePath);

        console.log(`Audio guardado en: ${oggFilePath}`);

        return oggFilePath;
    } catch (err) {
        console.error('Error en textToVoice:', err);
        throw err;
    }
};

export default textToVoice;