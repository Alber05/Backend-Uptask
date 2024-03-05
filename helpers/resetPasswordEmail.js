import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const resetPasswordEmail = async (data) => {
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
    subject: 'Uptask - Recuperar contraseña',
    text: 'Recuperar tu contraseña de Uptask',
    html: `
    <p>Estimado ${name}</p>

    <p>Recibimos una solicitud para restablecer la contraseña asociada con tu cuenta en Uptask. Para ayudarte con este proceso, sigue las instrucciones a continuación:</p>

    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
    <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Cambiar contraseña</a>

    <p>Si no has solicitado este cambio o no reconoces esta actividad, por favor, ignora este mensaje y ponte en contacto con nuestro equipo de soporte de inmediato.</p>

    <p>Gracias por confiar en Uptask.
    <br>
    Atentamente,
    <br>
    El Equipo de Soporte de Uptask</p>
    `
  })
}

{
  /**
   * Contiene funciones relacionadas con el envío de correos electrónicos.
   * Utiliza la biblioteca nodemailer para enviar correos electrónicos de confirmación de cuenta.
   */
}
