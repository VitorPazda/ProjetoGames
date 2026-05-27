/**
 * ============================================================================
 * CONTROLLER: GameController
 * ============================================================================
 * Responsável pela lógica de leitura e escrita das Notícias.
 *
 * Métodos:
 *   - index()   → Lista todas as notícias (GET /news) — público
 *   - store()   → Cadastra nova notícia (POST /news) — protegido
 *   - destroy() → Remove notícia (DELETE /news/:id)  — protegido
 *
 * IMPORTANTE: O método store() agora recebe a imagem via upload (multipart/form-data)
 * em vez de uma URL digitada. O Multer processa o arquivo antes de chegar aqui,
 * disponibilizando os dados do arquivo em req.file.
 * ============================================================================
 */

const Game = require('../models/Game');
const fs   = require('fs');   // Módulo nativo do Node para manipular arquivos
const path = require('path'); // Módulo nativo do Node para caminhos de arquivo

module.exports = {

    /**
     * index — retorna todas as notícias cadastradas
     * Rota:  GET /game
     */
    async index(req, res) {
        // findAll() busca todos os registros da tabela News
        const games = await Game.findAll();
        return res.json(games);
    },

    /**
     * store — cria uma nova notícia COM upload de imagem
     * Rota:  POST /news  (multipart/form-data)
     *
     * O Multer já processou o arquivo antes de chegar aqui:
     *   - req.file  → contém os dados do arquivo enviado (nome, caminho, etc.)
     *   - req.body  → contém os campos de texto (title, date, description)
     *
     * Salvamos no banco apenas o CAMINHO relativo da imagem, por exemplo:
     *   /uploads/news/1713200000000-foto.jpg
     * Esse caminho funciona como URL porque o express.static serve a pasta public/.
     */
    async store(req, res) {
        const { title, description, genre } = req.body;

        try {
            // Verificamos se o arquivo foi enviado pelo Multer
            if (!req.file) {
                return res.status(400).json({ error: 'A imagem é obrigatória.' });
            }

            // Montamos a URL relativa que será salva no banco de dados.
            // req.file.filename contém o nome gerado pelo Multer (ex: 1713200000000-foto.jpg)
            const image_url = `/uploads/game/${req.file.filename}`;

            const games = await Game.create({ title, description, genre, image_url });
            return res.json(games);

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    /**
     * destroy — remove uma notícia pelo ID passado na URL
     * Rota:  DELETE /game/:id
     *
     * Além de apagar o registro do banco, também removemos o arquivo
     * de imagem do disco para não acumular arquivos órfãos.
     */
    async destroy(req, res) {
        const { id } = req.params;

        try {
            // Buscamos a notícia para saber o caminho da imagem
            const game = await Game.findByPk(id);

            if (game && game.image_url) {
                // Montamos o caminho absoluto do arquivo no disco
                // image_url no banco: /uploads/news/foto.jpg
                // caminho real: api/public/uploads/news/foto.jpg
                const caminhoArquivo = path.join(__dirname, '..', '..', 'public', game.image_url);

                // fs.unlink() deleta o arquivo. Usamos try/catch para não quebrar
                // caso o arquivo já tenha sido removido manualmente.
                try {
                    fs.unlinkSync(caminhoArquivo);
                } catch (e) {
                    console.warn('Aviso: arquivo de imagem não encontrado para exclusão:', caminhoArquivo);
                }
            }

            await Game.destroy({ where: { id } });
            return res.json({ success: true });

        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },
};
