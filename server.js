const express = require ('express');
const multer = require ('multer');
const cors = require ('cors');
const path = require ('path');
const db = require ('/.database/db');

const app = express();
const PORT = 3000;

//configurações
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

//configurar o multer para salvar fotos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req,file,cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
})

const upload = multer({storage});

// Rota para cadastrar uma peça
app.post('/api/pecas', upload.single('foto'), (req, res) => {
  const { nome, quantidade } = req.body;
  const foto = req.file ? req.file.filename : null;})

  db.run(
    'INSERT INTO pecas (nome, quantidade, foto) VALUES (?,?,?)',
     [nome, quantidade, foto],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nome, quantidade, foto });
    }
  );

  //rota para listar peças