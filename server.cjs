const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(fileUpload());

app.post('/upload-pdf', async (req, res) => {
    if (!req.files || !req.files.pdf) {
        return res.status(400).send('No file uploaded.');
    }

    const pdfBuffer = req.files.pdf.data;
    try {
        const data = await pdfParse(pdfBuffer);
        res.json({ text: data.text });
    } catch (error) {
        console.error('PDF Parsing Failed:', error);
        res.status(500).send('Failed to parse PDF.');
    }
});

app.listen(PORT, () => {
    console.log(`PDF Parser Server running on port ${PORT}`);
});
