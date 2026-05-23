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

const Studio = require('../models/Studio');

module.exports = {

    /**
     * index — retorna a lista completa de formações
     * Rota:  GET /formations
     * Acesso: Público (o site chama esta rota ao carregar)
     */
    async index(req, res) {
        // findAll() é o equivalente Sequelize ao SQL: SELECT * FROM Formations
        const studios = await Studio.findAll();
        return res.json(studios);
    },

    /**
     * store — cria uma nova formação com os dados recebidos
     * Rota:  POST /formations
     * Acesso: Protegido (exige token JWT no cabeçalho)
     * Body esperado: { title, description, icon }
     */
    async store(req, res) {
        // Extraímos apenas os campos que precisamos do corpo da requisição
        const { name, foundationYear, country } = req.body;
        try {
            // create() é equivalente ao SQL: INSERT INTO Formations (title, description, icon) VALUES (...)
            const studio = await Studio.create({ name, foundationYear, country });
            // Retornamos o objeto criado (já com o ID gerado pelo banco)
            return res.json(studio);
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
        await Studio.destroy({ where: { id } });
        return res.json({ success: true });
    },
};
