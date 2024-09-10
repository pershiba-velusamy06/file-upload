const formidable = require('formidable');

const ALLOWED_MIMETYPES = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain"
];

const filterFiles = (file) => {
    return ALLOWED_MIMETYPES.includes(file.mimetype);
};

module.exports = (req, res, next) => {
    const form = new formidable.IncomingForm({
        multiples: true,
        filter: filterFiles,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }

        // Handle fields to ensure single values are correctly processed
        req.body = {};
        for (const [key, value] of Object.entries(fields)) {
            if (Array.isArray(value)) {
                // If the field is an array, use the first item if available
                req.body[key] = value.length > 0 ? value[0] : '';
            } else {
                // Ensure the field is a string
                req.body[key] = value;
            }
        }

        req.files = files;
        next();
    });
};
