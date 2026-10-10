# Guía de Integración Hostinger SMTP en Node.js, Express y Next.js

Esta referencia documenta cómo conectar formularios web a Hostinger Email usando Node.js.

---

## 1. Instalación de Dependencias

```bash
npm install nodemailer
```

Si usas TypeScript:
```bash
npm install -D @types/nodemailer
```

---

## 2. Variables de Entorno (`.env`)

```env
HOSTINGER_SMTP_HOST=smtp.hostinger.com
HOSTINGER_SMTP_PORT=465
HOSTINGER_SMTP_SECURE=true
HOSTINGER_SMTP_USER=contacto@tudominio.com
HOSTINGER_SMTP_PASS=TuPasswordSeguro123!
CONTACT_RECIPIENT_EMAIL=destino@tudominio.com
```

---

## 3. Ejemplo en Node.js / Express (Backend API)

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());

// Transporter de Nodemailer configurado para Hostinger
const transporter = nodemailer.createTransport({
  host: process.env.HOSTINGER_SMTP_HOST,
  port: Number(process.env.HOSTINGER_SMTP_PORT) || 465,
  secure: process.env.HOSTINGER_SMTP_SECURE === 'true', // true para puerto 465, false para puerto 587
  auth: {
    user: process.env.HOSTINGER_SMTP_USER,
    pass: process.env.HOSTINGER_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true, // Asegura validación SSL de Hostinger
  }
});

app.post('/api/contact', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const mailOptions = {
      from: `"Formulario Web" <${process.env.HOSTINGER_SMTP_USER}>`, // IMPORTANTE: Debe coincidir con la cuenta autenticada
      replyTo: email, // Permite responder directamente al cliente que llena el formulario
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      subject: `Nuevo mensaje de contacto de ${nombre}`,
      html: `
        <h3>Nuevo mensaje recibido</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error enviando correo con Hostinger:', error);
    return res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
```

---

## 4. Ejemplo en Next.js (App Router / Route Handler)

Ubicación: `app/api/contact/route.ts`

```typescript
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { nombre, email, mensaje } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.HOSTINGER_SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.HOSTINGER_SMTP_USER,
        pass: process.env.HOSTINGER_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Web Contact" <${process.env.HOSTINGER_SMTP_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      subject: `Contacto de ${nombre}`,
      text: mensaje,
      html: `<p><strong>Nombre:</strong> ${nombre}</p><p><strong>Email:</strong> ${email}</p><p><strong>Mensaje:</strong> ${mensaje}</p>`,
    });

    return NextResponse.json({ success: true, message: 'Mensaje enviado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```
