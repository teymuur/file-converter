function showForm(formId) {
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById(formId).style.display = 'block';
}

function convertPngToJpg() {
    const fileInput = document.getElementById('pngInput');
    
    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    if (file.type === 'image/png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function (blob) {
                saveAs(blob, file.name.replace(/\.[^/.]+$/, ".jpg"));
            }, 'image/jpeg');
        };

        img.src = URL.createObjectURL(file);
    } else {
        alert('Please select a PNG file for conversion to JPG.');
    }
}

function convertJpgToPng() {
    const fileInput = document.getElementById('jpgInput');
    
    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function (blob) {
                saveAs(blob, file.name.replace(/\.[^/.]+$/, ".png"));
            }, 'image/png');
        };

        img.src = URL.createObjectURL(file);
    } else {
        alert('Please select a JPEG file for conversion to PNG.');
    }
}

async function convertPdfToDocx() {
    const fileInput = document.getElementById('pdfInput');

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    if (file.type === 'application/pdf') {
        const pdfBytes = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
        const doc = new docx.Document();

        for (const page of pdfDoc.getPages()) {
            const { width, height } = page.getSize();
            const pageImage = await page.renderToImage();
            const imageSection = new docx.ImageRun({
                data: pageImage.toDataURL(),
                transformation: { width, height },
            });

            doc.addSection({
                children: [new docx.Paragraph(imageSection)],
            });
        }

        docx.Packer.toBlob(doc).then((blob) => {
            saveAs(blob, file.name.replace(/\.[^/.]+$/, ".docx"));
        });
    } else {
        alert('Please select a PDF file for conversion to DOCX.');
    }
}

async function convertDocxToPdf() {
    const fileInput = document.getElementById('docxInput');

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await docx.Document.load(arrayBuffer);
        const pdfDoc = await PDFLib.PDFDocument.create();

        for (const section of doc.sections) {
            for (const child of section.children) {
                if (child instanceof docx.Paragraph) {
                    const page = pdfDoc.addPage();
                    page.drawText(child.text);
                } else if (child instanceof docx.ImageRun) {
                    const page = pdfDoc.addPage([child.width, child.height]);
                    const pngImage = await pdfDoc.embedPng(child.data);
                    page.drawImage(pngImage, { x: 0, y: 0, width: child.width, height: child.height });
                }
            }
        }

        const pdfBytes = await pdfDoc.save();
        saveAs(new Blob([pdfBytes], { type: 'application/pdf' }), file.name.replace(/\.[^/.]+$/, ".pdf"));
    } else {
        alert('Please select a DOCX file for conversion to PDF.');
    }
}
