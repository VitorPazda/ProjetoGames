/**
 * ============================================================================
 * MIDDLEWARE DE UPLOAD DE ARQUIVOS (uploadMiddleware.js)
 * ============================================================================
 * Utiliza o Multer para processar uploads de arquivos (multipart/form-data).
 *
 * O Express, por padrão, só entende JSON e URL-encoded.
 * Quando o formulário envia um arquivo (como uma imagem), precisamos do
 * Multer para:
 *   1. Receber o arquivo binário da requisição
 *   2. Salvá-lo no disco (pasta public/uploads/news/)
 *   3. Disponibilizar os metadados em req.file para o controller
 *
 * Configurações:
 *   - storage:    define ONDE e COM QUAL NOME salvar o arquivo
 *   - fileFilter: restringe os tipos aceitos (apenas imagens)
 *   - limits:     tamanho máximo de 5 MB por arquivo
 * ============================================================================
 */

const multer = require('multer');
const path   = require('path');

// ─── Storage (Armazenamento em Disco) ────────────────────────────────────────
// diskStorage nos dá controle total sobre o nome e a pasta de destino.

const storage = multer.diskStorage({

    /**
     * destination — define a pasta onde os arquivos serão salvos.
     * Usamos path.join para garantir que o caminho funcione em qualquer SO.
     * cb = call back
     */
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'public', 'uploads', 'news'));
    },

    /**
     * filename — define o nome do arquivo salvo.
     * Usamos Date.now() (timestamp em milissegundos) como prefixo para
     * evitar colisões caso dois arquivos tenham o mesmo nome original.
     * Exemplo: 1713200000000-foto.jpg
     */
    filename: (req, file, cb) => {
        const nomeUnico = Date.now() + '-' + file.originalname;
        cb(null, nomeUnico);
    },
});

// ─── File Filter (Filtro de Tipo) ────────────────────────────────────────────
// Aceita apenas arquivos de imagem. Rejeita qualquer outro tipo (PDF, ZIP, etc.)

const fileFilter = (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);  // Aceita o arquivo
    } else {
        cb(new Error('Tipo de arquivo não permitido. Envie apenas imagens (JPEG, PNG, WebP ou GIF).'), false);
    }
};

// ─── Instância do Multer ─────────────────────────────────────────────────────

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

module.exports = upload;
