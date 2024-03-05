// Importa el módulo 'mongoose'.
import mongoose from 'mongoose'

// Exporta la función 'conectDb'.
export const conectDb = async () => {
  try {
    // Intenta conectar a la base de datos utilizando la URI definida en las variables de entorno.
    const connection = await mongoose.connect(process.env.MONGO_URI)

    // Construye la URL de conexión usando la información de host y puerto de la conexión.
    const url = `${connection.connection.host}:${connection.connection.port}`

    // Imprime en la consola un mensaje indicando que se ha conectado a la base de datos en la URL especificada.
    console.log(`Conectado en ${url}`)
  } catch (error) {
    // En caso de error, imprime el mensaje de error en la consola.
    console.log(`error: ${error}`)

    // Finaliza el proceso de la aplicación con un código de salida 1.
    process.exit(1)
  }
}

{
  /**
   * Contiene la función conectDb para conectar a la base de datos MongoDB utilizando Mongoose.
   */
}
