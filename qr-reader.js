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
    html5QrCode.stop().then(() => {
        cameraStream.style.display = 'none';
        stopButton.style.display = 'none';
        startButton.style.display = 'inline-block'; // Add this line to show the "Start Scanning" button again
    }).catch((error) => {
        console.error("Error stopping the QR code scanning:", error);
        alert("Error stopping the QR code scanning:\n" + error);
    });
}

