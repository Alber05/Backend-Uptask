import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const registerEmail = async (data) => {
  const { email, name, token } = data

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMPT_PASS
    }
  })

  // Información del email

  const info = await transport.sendMail({
    from: '"Uptask" <cuentas@uptask.com>',
    to: email,
    subject: 'Uptask - Confirma tu cuenta',
    text: 'Confirma tu cuenta en Uptask',
    html: `
    <p>Hola: ${name} Confirma tu cuenta en Uptask</p>

    <p>Tu cuenta ya está casi lista, solo debes confirmarla haciendo click en el siguiente enlace:</p>

    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirmar cuenta</a>

    <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
    `
  })
}

{
  /**
   * Contiene funciones relacionadas con el envío de correos electrónicos.
   * Utiliza la biblioteca nodemailer para enviar correos electrónicos de confirmación de cuenta.
   */
}
