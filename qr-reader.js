const cameraStream = document.getElementById('camera-stream');
const decodedQr = document.getElementById('decoded-qr');
const startButton = document.getElementById('start-button');

const qrScanner = new Html5Qrcode(cameraStream.id);

async function startScanning() {
    startButton.style.display = 'none';
    cameraStream.style.display = 'block';

    try {
        const devices = await Html5Qrcode.getCameras();
        
        if (devices.length === 0) {
            throw new Error('No camera devices found');
        }

        const cameraId = devices.find(device => device.label.toLowerCase().includes('back'))?.id || devices[0].id;

        await qrScanner.start(
            cameraId,
            {
                fps: 10,
                qrbox: 250
            },
            data => {
                decodedQr.innerText = data;
            },
            errorMessage => {
                // You can handle errors here if needed
            }
        );
    } catch (err) {
        console.error(err);
        let message = err.message || 'Requested device not found';
        alert(message);
        startButton.style.display = 'inline-block';
        cameraStream.style.display = 'none';
    }
}

// Attach the event listener to the button
startButton.addEventListener('click', startScanning);
