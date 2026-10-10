import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';

// Cargar variables de entorno desde .env si existe
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos generados por Vite en /dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Health check para Hostinger y monitorización
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GroundWorks Corp Web Server',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para el envío de formularios de cotización con Hostinger SMTP
app.post('/api/contact', async (req, res) => {
  const { fullName, phone, email, county, clientType, serviceNeeded, message } = req.body;

  // Validación básica en servidor
  if (!fullName || !phone || !county || !clientType || !serviceNeeded) {
    return res.status(400).json({
      success: false,
      error: 'Please fill out all required fields marked with *.'
    });
  }

  const smtpUser = process.env.HOSTINGER_SMTP_USER;
  const smtpPass = process.env.HOSTINGER_SMTP_PASS;
  const smtpHost = process.env.HOSTINGER_SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = Number(process.env.HOSTINGER_SMTP_PORT) || 465;
  const smtpSecure = process.env.HOSTINGER_SMTP_SECURE !== 'false'; // true para 465
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL || smtpUser;

  // Si aún no se configuran las credenciales en Hostinger hPanel, responder con modo simulado
  if (!smtpUser || !smtpPass) {
    console.warn('⚠️ [AVISO] HOSTINGER_SMTP_USER o HOSTINGER_SMTP_PASS no están configurados en el entorno. Solicitud recibida en modo de prueba.');
    return res.status(200).json({
      success: true,
      demoMode: true,
      message: `Quote request received! (Demo mode: Configure SMTP credentials in Hostinger hPanel to dispatch live emails).`
    });
  }

  try {
    // Configuración oficial de Hostinger SMTP según la habilidad conexion-hostinger
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    // Plantilla de correo HTML industrial para el equipo de despacho
    const mailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0c0d0e; color: #1a1a1a; margin: 0; padding: 20px; }
          .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border-top: 6px solid #FFC200; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          .header { background: #1a1d20; color: #ffffff; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 20px; letter-spacing: 1px; color: #FFC200; text-transform: uppercase; }
          .header p { margin: 6px 0 0; font-size: 13px; color: #9da3a8; }
          .content { padding: 24px; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .info-table td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          .info-table td.label { font-weight: bold; color: #374151; width: 35%; background: #f9fafb; }
          .info-table td.value { color: #111827; }
          .message-box { background: #f3f4f6; border-left: 4px solid #FFC200; padding: 14px; margin-top: 18px; border-radius: 4px; font-size: 14px; }
          .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>🚜 GROUND WORKS CORP - NEW QUOTE REQUEST</h1>
            <p>Direct dispatch inquiry from website form</p>
          </div>
          <div class="content">
            <p style="margin-top:0; font-size: 15px;"><strong>A new project quotation request has been submitted:</strong></p>
            <table class="info-table">
              <tr><td class="label">Client / Contact:</td><td class="value"><strong>${fullName}</strong></td></tr>
              <tr><td class="label">Phone:</td><td class="value"><a href="tel:${phone}" style="color:#0056b3; font-weight:bold;">${phone}</a></td></tr>
              <tr><td class="label">Email:</td><td class="value">${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</td></tr>
              <tr><td class="label">County / Location:</td><td class="value"><strong>${county}</strong></td></tr>
              <tr><td class="label">Client Type:</td><td class="value">${clientType}</td></tr>
              <tr><td class="label">Service Required:</td><td class="value"><span style="background:#FFF4D0; color:#8A6200; padding:2px 8px; border-radius:3px; font-weight:bold;">${serviceNeeded}</span></td></tr>
              <tr><td class="label">Timestamp:</td><td class="value">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} (EST)</td></tr>
            </table>

            <div class="message-box">
              <strong>Project Details / Scope:</strong><br>
              ${message ? message.replace(/\n/g, '<br>') : '<em>No extra details provided.</em>'}
            </div>
          </div>
          <div class="footer">
            GroundWorks Corp • Dig - Deliver - Done! • South Florida Excavation & Site-Work
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"GroundWorks Web" <${smtpUser}>`,
      to: recipientEmail,
      replyTo: email || smtpUser,
      subject: `🚜 New Quote: [${serviceNeeded}] - ${fullName} (${county})`,
      html: mailHtml,
      text: `New Quote Request:\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email || 'N/A'}\nCounty: ${county}\nClient: ${clientType}\nService: ${serviceNeeded}\n\nDetails:\n${message || 'N/A'}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Thank you, ${fullName}! Your inquiry for ${serviceNeeded} has been received. Our dispatch team will contact you promptly.`
    });
  } catch (err) {
    console.error('❌ Error enviando email con Hostinger SMTP:', err);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while dispatching your request. Please call us directly at (954) 548-5558.'
    });
  }
});

// Fallback para SPA / Rutas no encontradas -> redirigir a index.html
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Iniciar servidor en el puerto asignado
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GroundWorks Corp Node.js server running on port ${PORT}`);
});
