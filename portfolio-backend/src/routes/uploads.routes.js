const router = require('express').Router();
const path = require('path');
const fs = require('fs/promises');
const multer = require('multer');
const { S3Client, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const auth = require('../middleware/auth');

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'local';

let s3Client = null;
let bucketName = '';

if (STORAGE_TYPE === 's3') {
  const endpoint = process.env.R2_ENDPOINT || process.env.B2_ENDPOINT || '';
  const region = process.env.R2_REGION || process.env.B2_REGION || 'auto';
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.B2_KEY_ID || '';
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.B2_APP_KEY || '';
  bucketName = process.env.R2_BUCKET_NAME || process.env.B2_BUCKET_NAME || '';

  if (accessKeyId && secretAccessKey) {
    s3Client = new S3Client({ endpoint, region, credentials: { accessKeyId, secretAccessKey } });
  }
}

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|pdf)$/i)) {
    return cb(new Error('Only image, video, and PDF files are allowed!'), false);
  }
  cb(null, true);
};

const randomName = () =>
  Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');

const storage = s3Client
  ? multerS3({
      s3: s3Client,
      bucket: bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => cb(null, `projects/${randomName()}${path.extname(file.originalname)}`),
    })
  : multer.diskStorage({
      destination: './uploads/projects',
      filename: (req, file, cb) => cb(null, `${randomName()}${path.extname(file.originalname)}`),
    });

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter });

// POST /api/uploads/image
router.post('/uploads/image', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'File is required' });

  if (s3Client) {
    const publicUrl = process.env.R2_PUBLIC_URL;
    const url = publicUrl && req.file.key ? `${publicUrl}/${req.file.key}` : req.file.location;
    return res.json({ success: true, data: { url, filename: req.file.key, originalName: req.file.originalname, size: req.file.size } });
  }

  res.json({ success: true, data: {
    url: `/uploads/projects/${req.file.filename}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  }});
});

// GET /api/uploads
router.get('/uploads', auth, async (req, res, next) => {
  try {
    if (s3Client) {
      const command = new ListObjectsV2Command({ Bucket: bucketName, Prefix: 'projects/' });
      const response = await s3Client.send(command);
      const files = (response.Contents || []).map((item) => {
        const publicUrl = process.env.R2_PUBLIC_URL;
        const url = publicUrl ? `${publicUrl}/${item.Key}` : item.Key;
        return { filename: item.Key, url, size: item.Size, createdAt: item.LastModified };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, data: files });
    }

    const dir = './uploads/projects';
    try { await fs.access(dir); } catch { await fs.mkdir(dir, { recursive: true }); return res.json({ success: true, data: [] }); }
    const files = await fs.readdir(dir);
    const details = await Promise.all(files.map(async (f) => {
      const stats = await fs.stat(path.join(dir, f));
      return { filename: f, url: `/uploads/projects/${f}`, size: stats.size, createdAt: stats.birthtime };
    }));
    res.json({ success: true, data: details.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
  } catch (err) { next(err); }
});

// DELETE /api/uploads/:filename
router.delete('/uploads/:filename(*)', auth, async (req, res, next) => {
  try {
    const filename = req.params.filename;
    if (!filename) return res.status(400).json({ success: false, message: 'Filename required' });

    if (s3Client) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: filename }));
      return res.json({ success: true, data: { success: true } });
    }

    if (filename.includes('..')) return res.status(400).json({ success: false, message: 'Invalid filename' });
    const safe = path.basename(filename);
    await fs.unlink(path.join('./uploads/projects', safe));
    res.json({ success: true, data: { success: true } });
  } catch (err) { next(err); }
});

module.exports = router;
