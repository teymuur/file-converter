function showForm(formId) {
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById(formId).style.display = 'block';
}

function convertImage(inputId, outputFormat, mimeType) {
    const fileInput = document.getElementById(inputId);

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(function (blob) {
            saveAs(blob, file.name.replace(/\.[^/.]+$/, `.${outputFormat}`));
        }, mimeType);
    };

    img.src = URL.createObjectURL(file);
}

function convertPngToJpg() {
    convertImage('pngInput', 'jpg', 'image/jpeg');
}

function convertJpgToPng() {
    convertImage('jpgInput', 'png', 'image/png');
}

function convertBmpToPng() {
    convertImage('bmpInput', 'png', 'image/png');
}

function convertBmpToJpg() {
    convertImage('bmpInputJpg', 'jpg', 'image/jpeg');
}

function convertGifToPng() {
    convertImage('gifInput', 'png', 'image/png');
}

function convertGifToJpg() {
    convertImage('gifInputJpg', 'jpg', 'image/jpeg');
}
function convertWavToMp3() {
    const fileInput = document.getElementById('wavInput');

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, function(buffer) {
            const mp3Encoder = new lamejs.Mp3Encoder(1, buffer.sampleRate, 128);
            const samples = buffer.getChannelData(0);
            const mp3Data = [];
            let sampleBlockSize = 1152;
            for (let i = 0; i < samples.length; i += sampleBlockSize) {
                const sampleChunk = samples.subarray(i, i + sampleBlockSize);
                const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) {
                    mp3Data.push(new Int8Array(mp3buf));
                }
            }
            const mp3buf = mp3Encoder.flush();
            if (mp3buf.length > 0) {
                mp3Data.push(new Int8Array(mp3buf));
            }
            const blob = new Blob(mp3Data, { type: 'audio/mp3' });
            saveAs(blob, file.name.replace(/\.[^/.]+$/, ".mp3"));
        }, function(error) {
            alert('Error decoding audio data');
            console.error(error);
        });
    };

    reader.readAsArrayBuffer(file);
}

function convertCsvToJson() {
    const fileInput = document.getElementById('csvInput');

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const result = [];
        const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }

        const json = JSON.stringify(result, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        saveAs(blob, file.name.replace(/\.[^/.]+$/, ".json"));
    };

    reader.readAsText(file);
}

function convertJsonToCsv() {
    const fileInput = document.getElementById('jsonInput');

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const json = JSON.parse(event.target.result);
        const headers = Object.keys(json[0]);
        const csv = json.map(row => headers.map(header => row[header]).join(','));
        csv.unshift(headers.join(','));

        const csvString = csv.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        saveAs(blob, file.name.replace(/\.[^/.]+$/, ".csv"));
    };

    reader.readAsText(file);
}
