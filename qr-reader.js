const startButton = document.getElementById('start-button');
const cameraStream = document.getElementById('camera-stream');
const decodedQr = document.getElementById('decoded-qr');
const stopButton = document.getElementById('stop-button');
stopButton.addEventListener('click', stopScanning);
let codeReader;

startButton.addEventListener('click', startScanning);

async function startScanning() {
    startButton.style.display = 'none';
    cameraStream.style.display = 'block';

    try {
        codeReader = new ZXing.BrowserQRCodeReader();
        const devices = await codeReader.getVideoInputDevices();
    
    if (devices.length === 0) {
        throw new Error('No camera devices found');
    }

    const cameraId = devices.find(device => device.label.toLowerCase().includes('back'))?.deviceId || devices[0].deviceId;

    codeReader.decodeFromVideoDevice(cameraId, cameraStream, (result, err) => {
        if (result) {
            decodedQr.innerText = result.text;
            stopButton.style.display = 'inline-block';
        }
    });

    } catch (err) {
        console.error(err);
        let message = err.message || 'Requested device not found';
        alert(message);
        startButton.style.display = 'inline-block';
        cameraStream.style.display = 'none';
    }
}

function stopScanning() {
    if (codeReader) {
        codeReader.reset();
        stopButton.style.display = 'none';
    }
}
