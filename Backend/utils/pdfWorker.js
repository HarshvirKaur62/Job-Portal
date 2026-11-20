import { parentPort, workerData } from 'worker_threads';
import pdf from 'pdf-parse-fork';

(async () => {
    try {
        const buffer = Buffer.from(workerData);
        const data = await pdf(buffer);
        parentPort.postMessage({ success: true, text: data.text });
    } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
    }
})();
