function showForm(formId) {
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    document.getElementById(formId).style.display = 'block';
}

function uploadAndConvert(inputId, targetFormat) {
    const fileInput = document.getElementById(inputId);

    if (fileInput.files.length === 0) {
        alert('Please select a file first!');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);

    axios.post('convert.php', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        const data = response.data;
        if (data.error) {
            alert('Error: ' + data.error);
        } else {
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = data.fileUrl;
            downloadLink.download = file.name.replace(/\.[^/.]+$/, '.' + targetFormat);
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Download ' + targetFormat.toUpperCase();
        }
    })
    .catch(error => {
        console.error('Error during conversion:', error);
        alert('An error occurred during the conversion. Please try again.');
    });
}
