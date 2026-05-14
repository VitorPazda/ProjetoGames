/**
 * ============================================================================
 * CONTROLLER: FormationController (Formações / Cursos)
 * ============================================================================
 * Responsável por toda a lógica de manipulação de Formações no banco de dados.
 *
 * Métodos públicos:
 *   - index()   → Lista todas as formações (GET /formations)
 *
 * Métodos privados (exigem Token JWT):
 *   - store()   → Cria uma nova formação (POST /formations)
 *   - destroy() → Remove uma formação pelo ID (DELETE /formations/:id)
 * ============================================================================
 */

const Release = require('../models/Release');

module.exports = {

    /**
     * index — retorna a lista completa de formações
     * Rota:  GET /formations
     * Acesso: Público (o site chama esta rota ao carregar)
     */
    async index(req, res) {
        // findAll() é o equivalente Sequelize ao SQL: SELECT * FROM Formations
        const releases = await Release.findAll();
        return res.json(releases);
    },

    /**
     * store — cria uma nova formação com os dados recebidos
     * Rota:  POST /formations
     * Acesso: Protegido (exige token JWT no cabeçalho)
     * Body esperado: { title, description, icon }
     */
    async store(req, res) {
        // Extraímos apenas os campos que precisamos do corpo da requisição
        const { title, description, game, date } = req.body;
        try {
            // create() é equivalente ao SQL: INSERT INTO Formations (title, description, icon) VALUES (...)
            const release = await Release.create({ title, description, game, date });
            // Retornamos o objeto criado (já com o ID gerado pelo banco)
            return res.json(release);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    /**
     * destroy — remove uma formação pelo seu ID
     * Rota:  DELETE /formations/:id
     * Acesso: Protegido (exige token JWT)
     * Parâmetro: :id na URL (ex: /formations/3)
     */
    async destroy(req, res) {
        // req.params contém os parâmetros dinâmicos da URL
        const { id } = req.params;

        // destroy() é equivalente ao SQL: DELETE FROM Formations WHERE id = ?
        await Release.destroy({ where: { id } });
        return res.json({ success: true });
    },
};
