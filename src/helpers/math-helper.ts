/**
 * Calcula el valor promedio.
 * @param values Valores para el cálculo.
 * @param params Parametrizaciones adicionales para el procesamiento.
 * @returns El valor promedio.
 */
export function getAverage(values: number[], params: { lowerLimit?: number; upperLimit?: number } = {}): number {
  if (!values || values.length === 0) {
    return 0;
  }

  const { lowerLimit, upperLimit } = params;
  const filteredValues = values.filter(value => 
    (lowerLimit === undefined || value >= lowerLimit) &&
    (upperLimit === undefined || value <= upperLimit)
  );

  const sum = filteredValues.reduce((acc, value) => acc + value, 0);
  return cleanFloat(sum / filteredValues.length);
}

/**
 * Calcula el coeficiente de variación. CV(x)
 * @param standardDeviation La desviación estándar.
 * @param average La media.
 * @returns El valor del coeficiente de variación.
 */
export function getCoefficientOfVariation(standardDeviation: number, average: number): number {
  if (average === 0) {
    return 0;
  }

  return cleanFloat((standardDeviation / average) * 100);
}

/**
 * Obtiene la tabla de distribución de frecuencias.
 * @param valuesToOperate Valores para operar.
 * @param params Parámetros adicionales.
 * @returns La tabla de distribución de frecuencias.
 */
export function getFrequencyDistributionTable(
  valuesToOperate: number[],
  params: { lowerLimit?: number; upperLimit?: number; n_for_intervalAmount?: number } = {}
): { lowerLimit: number; upperLimit: number; fi: number; hi: number }[] | null {
  if (!valuesToOperate || valuesToOperate.length < 2) {
    return null;
  }

  const { lowerLimit, upperLimit, n_for_intervalAmount } = params;
  const filteredValues = valuesToOperate.filter(value => 
    (lowerLimit === undefined || value >= lowerLimit) &&
    (upperLimit === undefined || value <= upperLimit)
  ).sort((a, b) => a - b);

  const n = filteredValues.length;
  let m = Math.sqrt(n_for_intervalAmount || n);
  if (m < 1) {
    return null;
  }

  const A = cleanFloat((filteredValues[filteredValues.length - 1] - filteredValues[0]) / m);
  const categories: { lowerLimit: number; upperLimit: number; fi: number; hi: number }[] = [];

  let currentLowerLimit = filteredValues[0];
  for (let index = 1; index <= m; index++) {
    const upperLimit = cleanFloat(currentLowerLimit + A);
    const fi = filteredValues.filter(value => value >= currentLowerLimit && value < upperLimit).length;
    const hi = cleanFloat((fi / n) * 100);

    categories.push({
      lowerLimit: cleanFloat(currentLowerLimit),
      upperLimit,
      fi,
      hi
    });

    currentLowerLimit = upperLimit;
  }

  return categories;
}

/**
 * Calcula el porcentaje requerido de una cifra.
 * @param percentage El porcentaje a hallar.
 * @param value El valor al cual extraer el porcentaje.
 * @returns El porcentaje calculado.
 */
export function getPercentage(percentage: number, value: number): number {
  return cleanFloat((percentage * value) / 100);
}

/**
 * Calcula la Desviación estándar. Sx
 * @param values Valores para el cálculo.
 * @param params Parametrizaciones adicionales para el procesamiento.
 * @returns El valor de la desviación estándar.
 */
export function getStandardDeviation(values: number[], params: { average?: number } = {}): number {
  const variance = getVariance(values, params);
  return cleanFloat(Math.sqrt(variance));
}

/**
 * Calcula la varianza. var(x)
 * @param values Valores para el cálculo.
 * @param params Parametrizaciones adicionales para el procesamiento.
 * @returns El valor de la varianza.
 */
export function getVariance(values: number[], params: { average?: number; lowerLimit?: number; upperLimit?: number } = {}): number {
  if (!values || values.length <= 1) {
    return 0;
  }

  const { lowerLimit, upperLimit } = params;
  const filteredValues = values.filter(value => 
    (lowerLimit === undefined || value >= lowerLimit) &&
    (upperLimit === undefined || value <= upperLimit)
  );

  const average = params.average || getAverage(filteredValues);
  const sumOfSquares = filteredValues.reduce((acc, value) => acc + Math.pow(value - average, 2), 0);
  return cleanFloat(sumOfSquares / (filteredValues.length - 1));
}

/**
 * Verifica si el valor dado se encuentra en la categoría de mayor frecuencia.
 * @param value El valor a buscar.
 * @param tdf La tabla de distribución de frecuencias que contiene las categorías en las cuales buscar.
 * @returns TRUE si el valor se encuentra dentro de la categoría de mayor frecuencia, FALSE en caso contrario.
 */
export function isInHigherFrequency(
  value: number,
  tdf: { lowerLimit: number; upperLimit: number; hi: number }[]
): boolean {
  const highestFrequencyCategory = tdf.reduce((prev, current) => 
    (current.hi > prev.hi) ? current : prev
  );

  return value >= highestFrequencyCategory.lowerLimit && value < highestFrequencyCategory.upperLimit;
}

/**
 * Elimina la disposición de float y lo convierte a un entero.
 * @param value El valor a limpiar.
 * @returns El valor limpio como entero.
 */
function cleanFloat(value: number): number {
  return Math.floor(value);
}

/**
 * Calcula el rango intercuartil.
 * @param numbers Números para el cálculo.
 * @returns El rango intercuartil.
 */
export function getInterquartileRange(numbers: number[]): [number, number] {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = sorted.slice(mid + (sorted.length % 2 === 0 ? 0 : 1));

  const q1 = getMedian(lowerHalf);
  const q3 = getMedian(upperHalf);

  return [q1, q3];
}

/**
 * Calcula la mediana.
 * @param numbers Números para el cálculo.
 * @returns La mediana.
 */
function getMedian(numbers: number[]): number {
  const mid = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0) {
    return (numbers[mid - 1] + numbers[mid]) / 2;
  }
  return numbers[mid];
}