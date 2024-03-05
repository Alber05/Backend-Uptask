// Definición de una función para generar un identificador único
const generateId = () => {
  const random = Math.random().toString(32).substring(2)

  const date = Date.now().toString(32)

  const uniqueId = random + date

  return uniqueId
}

export default generateId

{
  /**
   * Función para generar identificadores únicos.
   */
}
