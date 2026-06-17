// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VillamariaTrazabilidad
 * @author GM Holding — Espacio y Gestión Verde S.A.S
 * @notice Contrato de trazabilidad inmutable para el proyecto de restauración ecológica
 *         Contrato SGR-SC-001-2025 | Municipio de Villamaría, Caldas, Colombia
 * @dev Registra documentos oficiales y permite agregar actualizaciones de estado
 *      sin borrar el historial original (append-only, inmutable).
 */
contract VillamariaTrazabilidad {

    // ─── Metadatos del Proyecto ───────────────────────────────────────────────

    string public constant PROYECTO              = "Restauracion Ecologica SGR-SC-001-2025";
    string public constant MUNICIPIO             = "Villamaria, Caldas, Colombia";
    string public constant DESARROLLADOR_BLOCKCHAIN = "GM Holding";

    // Participantes del Proyecto
    string public constant PARTICIPANTE_1        = "Alcaldia de Villamaria";
    string public constant PARTICIPANTE_2        = "Espacio y Gestion Verde S.A.S";
    string public constant PARTICIPANTE_3        = "Mas Progreso S.A.S. E.S.P.";

    string public constant TOTAL_INDIVIDUOS       = "10900";
    string public constant TOTAL_LOTES           = "8";
    uint256 public constant FECHA_INICIO         = 1749600000; // Unix timestamp aprox inicio proyecto

    // ─── Estructuras ─────────────────────────────────────────────────────────

    /**
     * @dev Estado de un documento o registro.
     * VIGENTE: activo y válido.
     * ACTUALIZADO: existe una versión más reciente (mantiene el original).
     * ARCHIVADO: fuera de uso pero conservado como evidencia histórica.
     */
    enum EstadoDocumento { VIGENTE, ACTUALIZADO, ARCHIVADO }

    struct Documento {
        string  nombreArchivo;
        string  descripcion;
        string  hashSHA256;
        string  enlaceIPFS;
        string  cid;
        uint256 timestamp;
        EstadoDocumento estado;
    }

    /**
     * @dev Anotación de actualización vinculada a un documento existente.
     * Permite agregar contexto futuro sin modificar el registro original.
     * Ejemplo: "Se reemplazó por versión v2 el 15/01/2027".
     */
    struct Anotacion {
        string  nota;
        address autor;
        uint256 timestamp;
    }

    // ─── Storage ──────────────────────────────────────────────────────────────

    address public propietario;

    // hashSHA256 → Documento
    mapping(string => Documento) private documentos;
    string[] private hashesRegistrados;

    // hashSHA256 → lista de anotaciones (historial de actualizaciones)
    mapping(string => Anotacion[]) private anotaciones;

    // ─── Eventos ──────────────────────────────────────────────────────────────

    event DocumentoRegistrado(
        string  nombreArchivo,
        string  descripcion,
        string  hashSHA256,
        string  cid,
        string  enlaceIPFS,
        uint256 timestamp,
        address registradoPor
    );

    event AnotacionAgregada(
        string  hashSHA256,
        string  nota,
        uint256 timestamp,
        address autor
    );

    event EstadoActualizado(
        string  hashSHA256,
        EstadoDocumento estadoAnterior,
        EstadoDocumento estadoNuevo,
        uint256 timestamp
    );

    // ─── Modificadores ────────────────────────────────────────────────────────

    constructor() {
        propietario = msg.sender;
    }

    modifier soloPropietario() {
        require(msg.sender == propietario, "Solo el propietario puede ejecutar esta accion");
        _;
    }

    modifier documentoExiste(string memory _hash) {
        require(bytes(documentos[_hash].hashSHA256).length > 0, "Documento no registrado");
        _;
    }

    // ─── Funciones de Escritura ───────────────────────────────────────────────

    /**
     * @notice Registra un nuevo documento oficial del proyecto en blockchain.
     * @param _nombreArchivo Nombre del archivo (ej: "INFORME_FINAL_GEOREFERENCIACION.pdf")
     * @param _descripcion   Descripción legible del contenido (ej: "Informe de georeferenciación 2025")
     * @param _hashSHA256    Hash SHA-256 del contenido del archivo (integridad criptográfica)
     * @param _enlaceIPFS    URL completa del gateway IPFS (Pinata)
     * @param _cid           CID de IPFS (identificador de contenido en la red descentralizada)
     */
    function registrarDocumento(
        string memory _nombreArchivo,
        string memory _descripcion,
        string memory _hashSHA256,
        string memory _enlaceIPFS,
        string memory _cid
    ) public soloPropietario {
        require(bytes(_hashSHA256).length > 0,   "Hash requerido");
        require(
            bytes(documentos[_hashSHA256].hashSHA256).length == 0,
            "Este hash ya fue registrado anteriormente"
        );

        documentos[_hashSHA256] = Documento({
            nombreArchivo: _nombreArchivo,
            descripcion:   _descripcion,
            hashSHA256:    _hashSHA256,
            enlaceIPFS:    _enlaceIPFS,
            cid:           _cid,
            timestamp:     block.timestamp,
            estado:        EstadoDocumento.VIGENTE
        });

        hashesRegistrados.push(_hashSHA256);

        emit DocumentoRegistrado(
            _nombreArchivo,
            _descripcion,
            _hashSHA256,
            _cid,
            _enlaceIPFS,
            block.timestamp,
            msg.sender
        );
    }

    /**
     * @notice Agrega una anotación de actualización a un documento existente.
     *         No modifica el registro original — solo agrega contexto histórico.
     * @dev Usar para registrar eventos futuros: revisiones, reemplazos, observaciones.
     * @param _hashSHA256 Hash del documento al que se vincula la anotación
     * @param _nota       Texto descriptivo (ej: "Actualizado por monitoreo semestral Jun/2027")
     */
    function agregarAnotacion(
        string memory _hashSHA256,
        string memory _nota
    ) public soloPropietario documentoExiste(_hashSHA256) {
        anotaciones[_hashSHA256].push(Anotacion({
            nota:      _nota,
            autor:     msg.sender,
            timestamp: block.timestamp
        }));

        emit AnotacionAgregada(_hashSHA256, _nota, block.timestamp, msg.sender);
    }

    /**
     * @notice Actualiza el estado de un documento (VIGENTE → ACTUALIZADO → ARCHIVADO).
     *         El registro original permanece inmutable; solo cambia el estado.
     * @param _hashSHA256  Hash del documento
     * @param _nuevoEstado Nuevo estado (0=VIGENTE, 1=ACTUALIZADO, 2=ARCHIVADO)
     */
    function actualizarEstado(
        string memory _hashSHA256,
        EstadoDocumento _nuevoEstado
    ) public soloPropietario documentoExiste(_hashSHA256) {
        EstadoDocumento estadoAnterior = documentos[_hashSHA256].estado;
        documentos[_hashSHA256].estado = _nuevoEstado;

        emit EstadoActualizado(_hashSHA256, estadoAnterior, _nuevoEstado, block.timestamp);
    }

    // ─── Funciones de Consulta ────────────────────────────────────────────────

    /**
     * @notice Consulta todos los datos de un documento registrado.
     * @param _hashSHA256 Hash SHA-256 del documento a consultar
     */
    function consultarDocumento(string memory _hashSHA256) public view returns (
        string  memory nombreArchivo,
        string  memory descripcion,
        string  memory hashSHA256,
        string  memory enlaceIPFS,
        string  memory cid,
        uint256        timestamp,
        uint8          estado
    ) {
        Documento memory doc = documentos[_hashSHA256];
        require(bytes(doc.hashSHA256).length > 0, "Documento no encontrado");
        return (
            doc.nombreArchivo,
            doc.descripcion,
            doc.hashSHA256,
            doc.enlaceIPFS,
            doc.cid,
            doc.timestamp,
            uint8(doc.estado)
        );
    }

    /**
     * @notice Consulta todas las anotaciones históricas de un documento.
     * @param _hashSHA256 Hash del documento
     */
    function consultarAnotaciones(string memory _hashSHA256)
        public view
        documentoExiste(_hashSHA256)
        returns (string[] memory notas, address[] memory autores, uint256[] memory timestamps)
    {
        Anotacion[] memory ann = anotaciones[_hashSHA256];
        notas      = new string[](ann.length);
        autores    = new address[](ann.length);
        timestamps = new uint256[](ann.length);

        for (uint256 i = 0; i < ann.length; i++) {
            notas[i]      = ann[i].nota;
            autores[i]    = ann[i].autor;
            timestamps[i] = ann[i].timestamp;
        }
    }

    /**
     * @notice Verifica si un hash está registrado.
     */
    function estaRegistrado(string memory _hashSHA256) public view returns (bool) {
        return bytes(documentos[_hashSHA256].hashSHA256).length > 0;
    }

    /**
     * @notice Retorna todos los hashes registrados en el contrato.
     */
    function obtenerTodosLosHashes() public view returns (string[] memory) {
        return hashesRegistrados;
    }

    /**
     * @notice Retorna el total de documentos registrados.
     */
    function totalDocumentos() public view returns (uint256) {
        return hashesRegistrados.length;
    }

    /**
     * @notice Retorna los metadatos públicos del proyecto.
     */
    function infoProyecto() public pure returns (
        string memory proyecto,
        string memory municipio,
        string memory participante1,
        string memory participante2,
        string memory participante3,
        string memory totalIndividuos,
        string memory totalLotes,
        string memory desarrolladorBlockchain
    ) {
        return (
            PROYECTO,
            MUNICIPIO,
            PARTICIPANTE_1,
            PARTICIPANTE_2,
            PARTICIPANTE_3,
            TOTAL_INDIVIDUOS,
            TOTAL_LOTES,
            DESARROLLADOR_BLOCKCHAIN
        );
    }
}
