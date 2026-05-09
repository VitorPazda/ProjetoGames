/**
 * ============================================================================
 * CONTROLLER: EventController (Próximos Eventos)
 * ============================================================================
 * Responsável pela lógica de leitura e escrita dos Eventos.
 *
 * Métodos:
 *   - index()   → Lista todos os eventos (GET /events) — público
 *   - store()   → Cadastra novo evento (POST /events) — protegido
 *   - destroy() → Remove evento (DELETE /events/:id)  — protegido
 * ============================================================================
 */

const Event = require('../models/Event');

module.exports = {

    /**
     * index — retorna todos os eventos cadastrados
     * Rota:  GET /events
     */
    async index(req, res) {
        const events = await Event.findAll();
        return res.json(events);
    },

    /**
     * store — cria um novo evento
     * Rota:  POST /events
     * Body esperado: { title, day, month, location, time }
     */
    async store(req, res) {
        const { title, day, month, location, time } = req.body;
        try {
            const event = await Event.create({ title, day, month, location, time });
            return res.json(event);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    /**
     * destroy — remove um evento pelo ID passado na URL
     * Rota:  DELETE /events/:id
     */
    async destroy(req, res) {
        const { id } = req.params;
        await Event.destroy({ where: { id } });
        return res.json({ success: true });
    },
};
