const startButton = document.getElementById('start-button');
const cameraStream = document.getElementById('camera-stream');
const decodedQr = document.getElementById('decoded-qr');
const stopButton = document.getElementById('stop-button');
let codeReader;

startButton.addEventListener('click', startScanning);
stopButton.addEventListener('click', stopScanning);

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
            const decodedText = result.text;
            const listItem = document.createElement('li');
            listItem.textContent = decodedText;
            listItem.dataset.date = new Date().toISOString();

            if (isValidURL(decodedText)) {
                const link = document.createElement('a');
                link.href = decodedText;
                link.textContent = decodedText;
                listItem.textContent = '';
                listItem.appendChild(link);
            }

            document.getElementById('decoded-qr-list').appendChild(listItem);
            saveToLocalStorage(decodedText);
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

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

function saveToLocalStorage(decodedText) {
    const storedData = JSON.parse(localStorage.getItem('qrCodes') || '[]');
    const newItem = {
        text: decodedText,
        date: new Date().toISOString(),
    };
    storedData.push(newItem);
    localStorage.setItem('qrCodes', JSON.stringify(storedData));
}

function loadFromLocalStorage() {
    const storedData = JSON.parse(localStorage.getItem('qrCodes') || '[]');
    storedData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item.text;
        listItem.dataset.date = item.date;

        if (isValidURL(item.text)) {
            const link = document.createElement('a');
            link.href = item.text;
            link.textContent = item.text;
            listItem.textContent = '';
            listItem.appendChild(link);
        }

        document.getElementById('decoded-qr-list').appendChild(listItem);
    });
}

function stopScanning() {
    try {
        codeReader.reset(); // Use the reset method instead of stop
        cameraStream.style.display = 'none';
        stopButton.style.display = 'none';
        startButton.style.display = 'inline-block';
    } catch (error) {
        console.error("Error stopping the QR code scanning:", error);
        alert("Error stopping the QR code scanning:\n" + error);
    }
}

loadFromLocalStorage();