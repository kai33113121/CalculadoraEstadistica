// Elementos del DOM
const dataInput = document.getElementById('dataInput');
const calculateBtn = document.getElementById('calculateBtn');
const results = document.getElementById('results');
const loading = document.getElementById('loading');
const alert = document.getElementById('alert');

/**
 * Muestra un mensaje de alerta temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta (error, success, info)
 */
function showAlert(message, type) {
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

/**
 * Parsea la entrada de texto y separa valores válidos de inválidos
 * @param {string} input - Texto con datos numéricos
 * @returns {Object} Objeto con validData (array de números) e invalidCount
 */
function parseData(input) {
    const values = input.split(/[\s,;]+/).map(v => v.trim()).filter(v => v !== '');
    const validData = [];
    let invalidCount = 0;

    values.forEach(v => {
        const num = parseFloat(v);
        if (!isNaN(num) && isFinite(num)) {
            validData.push(num);
        } else {
            invalidCount++;
        }
    });

    return { validData, invalidCount };
}

/**
 * Calcula la media aritmética
 * Fórmula: μ = (Σxi) / n
 * @param {Array<number>} data - Array de números
 * @returns {number} Media aritmética
 */
function calculateMean(data) {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

/**
 * Calcula la desviación estándar poblacional
 * Fórmula: σ = √[Σ(xi - μ)² / n]
 * @param {Array<number>} data - Array de números
 * @param {number} mean - Media aritmética
 * @returns {number} Desviación estándar
 */
function calculateStdDev(data, mean) {
    if (data.length === 0) return 0;
    const squaredDiffs = data.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / data.length;
    return Math.sqrt(variance);
}

/**
 * Calcula todas las estadísticas del conjunto de datos
 * @param {Array<number>} data - Array de números
 * @returns {Object} Objeto con todas las estadísticas calculadas
 */
function calculateStats(data) {
    if (data.length === 0) return null;

    const mean = calculateMean(data);
    const stdDev = calculateStdDev(data, mean);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    return {
        mean: mean.toFixed(6),
        stdDev: stdDev.toFixed(6),
        count: data.length,
        min: min.toFixed(6),
        max: max.toFixed(6),
        range: range.toFixed(6)
    };
}

/**
 * Muestra los resultados en la interfaz
 * @param {Object} stats - Objeto con estadísticas calculadas
 * @param {number} invalidCount - Cantidad de datos descartados
 */
function displayResults(stats, invalidCount) {
    document.getElementById('mean').textContent = stats.mean;
    document.getElementById('stdDev').textContent = stats.stdDev;
    document.getElementById('count').textContent = stats.count;
    document.getElementById('invalid').textContent = invalidCount;
    document.getElementById('min').textContent = stats.min;
    document.getElementById('max').textContent = stats.max;
    document.getElementById('range').textContent = stats.range;

    results.classList.add('show');
}

// Event listener para el botón de calcular
calculateBtn.addEventListener('click', () => {
    const input = dataInput.value.trim();

    // Validación de entrada vacía
    if (!input) {
        showAlert('⚠️ Por favor, ingrese datos para calcular', 'error');
        return;
    }

    // Mostrar indicador de carga
    loading.classList.add('show');
    calculateBtn.disabled = true;

    // Simular procesamiento asíncrono
    setTimeout(() => {
        try {
            // Parsear y validar datos
            const { validData, invalidCount } = parseData(input);

            // Verificar que haya datos válidos
            if (validData.length === 0) {
                showAlert('❌ No se encontraron datos numéricos válidos', 'error');
                loading.classList.remove('show');
                calculateBtn.disabled = false;
                return;
            }

            // Calcular estadísticas
            const stats = calculateStats(validData);
            displayResults(stats, invalidCount);

            // Mostrar mensaje de éxito
            if (invalidCount > 0) {
                showAlert(`✅ Cálculo completado. Se descartaron ${invalidCount} valor(es) no numérico(s)`, 'info');
            } else {
                showAlert('✅ Cálculo completado exitosamente', 'success');
            }
        } catch (error) {
            showAlert('❌ Error al procesar los datos: ' + error.message, 'error');
            console.error(error);
        } finally {
            // Ocultar indicador de carga
            loading.classList.remove('show');
            calculateBtn.disabled = false;
        }
    }, 500);
});

// Atajo de teclado: Ctrl + Enter para calcular
dataInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        calculateBtn.click();
    }
});