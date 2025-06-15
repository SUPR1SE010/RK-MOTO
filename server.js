const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuração do multer para salvar fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Criar item
app.post("/api/itens", upload.single("foto"), (req, res) => {
  const { nome, quantidade } = req.body;
  const foto = req.file ? req.file.filename : null;

  db.run(
    "INSERT INTO itens (nome, quantidade, foto) VALUES (?, ?, ?)",
    [nome, quantidade, foto],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.status(201).send({ id: this.lastID });
    }
  );
});

// Listar todos os itens
app.get("/api/itens", (req, res) => {
  db.all("SELECT * FROM itens", (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Deletar item por ID
app.delete("/api/itens/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM itens WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(204);
  });
});

// Atualizar item por ID
app.put("/api/itens/:id", upload.single("foto"), (req, res) => {
  const id = req.params.id;
  const { nome, quantidade } = req.body;
  const foto = req.file ? req.file.filename : null;

  // Se foto enviada, atualiza também, senão só nome e quantidade
  if (foto) {
    db.run(
      "UPDATE itens SET nome = ?, quantidade = ?, foto = ? WHERE id = ?",
      [nome, quantidade, foto, id],
      function (err) {
        if (err) return res.status(500).send(err.message);
        res.sendStatus(200);
      }
    );
  } else {
    db.run(
      "UPDATE itens SET nome = ?, quantidade = ? WHERE id = ?",
      [nome, quantidade, id],
      function (err) {
        if (err) return res.status(500).send(err.message);
        res.sendStatus(200);
      }
    );
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
