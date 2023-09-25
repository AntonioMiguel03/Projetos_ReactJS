//servidor node local
//Ligar o Servidor: C\:\..\PrjPratLivros > prj-prat-livros > src > serviddor > node server.js
//Desligar o servidor: C:\..\serviddor > Ctrl + C

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const fse = require('fs-extra');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/img');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/i;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb('Apenas arquivos de imagem (jpeg, jpg, png) são permitidos.');
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('imagem');

const livrosJsonPath = path.resolve(__dirname, '..', 'Local_Database', 'livros.json');

app.get('/', (req, res) => {
    res.send('Bem-vindo ao servidor de cadastro de livros!');
});

app.post('/api/uploadImagem', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao fazer o upload da imagem.' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem selecionada.' });
        }

        const imagePath = req.file.path.replace('src/', '');
        res.json({ localizacao: imagePath });
    });
});

app.post('/api/cadastrarLivro', async (req, res) => {
    try {
        const livroData = req.body;

        fs.readFile(livrosJsonPath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                fs.writeFile(livrosJsonPath, '[]', 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Erro ao criar o arquivo livros.json.' });
                    }
                    cadastrarLivro(livroData, res);
                });
            } else {
                cadastrarLivro(livroData, res);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o livro.' });
    }
});

function cadastrarLivro(livroData, res) {
    fs.readFile(livrosJsonPath, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao ler o arquivo livros.json.' });
        }

        let livros = JSON.parse(data);
        livroData.id = livros.length + 1;

        if (livroData.imagemSelecionada && livroData.imagemSelecionada.startsWith('./src/img/')) {
            // Se a imagem ja estiver no formato de caminho correto, apenas salva a localizacao da imagem no objeto do livro
        } else if (livroData.imagemSelecionada && livroData.imagemSelecionada.startsWith('data:image')) {
            // Converte a imagem codificada em base64 para um caminho relativo
            //const imagePath = `./src/img/img${livroData.id}.jpeg`;
            //const imagePath = `../img/img${livroData.id}.jpeg`;

            const extensaoArquivo = livroData.imagemSelecionada.match(/image\/(.+);base64,/)[1];

            const imagePath = `../img/img${livroData.id}.${extensaoArquivo}`;

            // Extrai os dados da imagem codificada em base64
            //const base64Data = livroData.imagemSelecionada.replace(/^data:image\/jpeg;base64,/, '');
            const base64Data = livroData.imagemSelecionada.replace(/^data:image\/([^;]+);base64,/, '');

            // Salva a imagem na pasta src/img com o nome img1.jpeg, img2.jpeg, etc.
            await fse.outputFile(imagePath, base64Data, { encoding: 'base64' });

            // Salva a localizacao da imagem no objeto do livro
            livroData.imagemSelecionada = imagePath;
        }

        livros.push(livroData);

        // Cria a pasta src/img se não existir
        /*if (!fs.existsSync('./src/img')) {
            fs.mkdirSync('./src/img');
        }*/
        if (!fs.existsSync('../img')) {
            fs.mkdirSync('../img');
        }

        fs.writeFile(livrosJsonPath, JSON.stringify(livros, null, 2), async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao salvar o livro em livros.json.' });
            }
            res.json({ message: 'Livro cadastrado com sucesso.' });
        });
    });
}

app.get('/api/listarLivros', async (req, res) => {
    try {
        fs.readFile(livrosJsonPath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao ler o arquivo livros.json.' });
            }
            const livros = JSON.parse(data);
            res.json(livros);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao obter a lista de livros.' });
    }
});

app.get('/api/listarLivros/:id', async (req, res) => {
    try {
        const livroId = parseInt(req.params.id);

        fs.readFile(livrosJsonPath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao ler o arquivo livros.json.' });
            }

            const livros = JSON.parse(data);
            const livroEncontrado = livros.find((livro) => livro.id === livroId);

            if (!livroEncontrado) {
                return res.status(404).json({ error: 'Livro não encontrado.' });
            }

            res.json(livroEncontrado);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao obter o livro.' });
    }
});

app.patch('/api/atualizarLivro/:id', async (req, res) => {
    try {
        const livroId = parseInt(req.params.id);

        fs.readFile(livrosJsonPath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao ler o arquivo livros.json.' });
            }

            let livros = JSON.parse(data);
            const livroIndex = livros.findIndex((livro) => livro.id === livroId);

            if (livroIndex === -1) {
                return res.status(404).json({ error: 'Livro não encontrado.' });
            }

            // Atualiza os dados do livro
            livros[livroIndex] = { ...livros[livroIndex], ...req.body };

            fs.writeFile(livrosJsonPath, JSON.stringify(livros, null, 2), async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao salvar a atualização do livro em livros.json.' });
                }
                res.json({ message: 'Livro atualizado com sucesso.' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao atualizar o livro.' });
    }
});

app.delete('/api/deletarLivro/:id', async (req, res) => {
    try {
        const livroId = parseInt(req.params.id);

        fs.readFile(livrosJsonPath, 'utf8', async (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao ler o arquivo livros.json.' });
            }

            let livros = JSON.parse(data);
            const livroIndex = livros.findIndex((livro) => livro.id === livroId);

            if (livroIndex === -1) {
                return res.status(404).json({ error: 'Livro não encontrado.' });
            }

            // Remove o livro do array de livros
            livros.splice(livroIndex, 1);

            fs.writeFile(livrosJsonPath, JSON.stringify(livros, null, 2), async (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Erro ao salvar a exclusão do livro em livros.json.' });
                }
                res.json({ message: 'Livro excluído com sucesso.' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ocorreu um erro ao excluir o livro.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
