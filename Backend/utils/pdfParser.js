import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parsePdfInWorker = (pdfBuffer) => {
    return new Promise((resolve, reject) => {
        // Resolve absolute path to pdfWorker.js in the same directory
        const workerPath = path.resolve(__dirname, 'pdfWorker.js');
        
        const worker = new Worker(workerPath, { workerData: pdfBuffer });
        
        worker.on('message', (message) => {
            if (message.success) {
                resolve(message.text);
            } else {
                reject(new Error(message.error));
            }
            worker.terminate();
        });
        
        worker.on('error', (err) => {
            reject(err);
            worker.terminate();
        });
        
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
};
