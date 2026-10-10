---
name: conexion-hostinger
description: >-
  Proporciona el conocimiento completo y las instrucciones paso a paso para conectar
  cualquier formulario web (HTML, React, Next.js, Node.js, PHP, WordPress, Laravel, Python, etc.)
  con el servicio de correo de Hostinger mediante SMTP, IMAP/POP3 o servicios de integración (APIs/Webhooks).
  Activar esta habilidad cuando el usuario pida integrar formularios de contacto con el correo de Hostinger,
  configurar SMTP de Hostinger, enviar emails automáticos o resolver errores de autenticación/envío con Hostinger.
---

# Conexión con Hostinger (Email y Formulario)

Esta habilidad proporciona el estándar procedimental completo para integrar formularios de contacto web con la plataforma de correo de **Hostinger**. Cubre la configuración técnica de **SMTP**, **IMAP/POP3**, seguridad SPF/DKIM/DMARC y ejemplos de implementación en múltiples stacks tecnológicos.

---

## Parámetros Oficiales de Configuración de Email en Hostinger

Para conectar cualquier aplicación o formulario a Hostinger Email (o Titan Email alojado en Hostinger), se deben usar los siguientes parámetros de servidor:

### 1. Servidor de Salida (SMTP) — Para Enviar Correos desde Formularios
* **Host / Servidor SMTP**: `smtp.hostinger.com`
* **Puerto recomendado (SSL/TLS)**: `465` (Cifrado **SSL/TLS**)
* **Puerto alternativo (STARTTLS)**: `587` (Cifrado **TLS/STARTTLS**)
* **Autenticación requerida**: Sí (`true` / `Yes`)
* **Usuario**: Tu dirección de correo completa (ej. `contacto@tudominio.com`)
* **Contraseña**: La contraseña asignada a esa cuenta de correo en hPanel

> ⚠️ **Nota para Titan Email**: Si tu plan utiliza la plataforma Titan Mail dentro de Hostinger, el host SMTP suele ser `smtp.titan.email` (puerto 465 SSL o 587 STARTTLS). Consulta tu hPanel si tienes dudas.

---

### 2. Servidores de Entrada (IMAP / POP3) — Para Recepción o Lectura
* **IMAP (Recomendado)**:
  * Host: `imap.hostinger.com`
  * Puerto: `993` (Cifrado **SSL/TLS**)
* **POP3**:
  * Host: `pop.hostinger.com`
  * Puerto: `995` (Cifrado **SSL/TLS**)

---

## Cómo Obtener y Verificar los Detalles en hPanel

1. Inicia sesión en **Hostinger hPanel** (`admin.hostinger.com` o `hpanel.hostinger.com`).
2. Ve a la sección **Emails** -> **Cuentas de Email**.
3. Selecciona tu dominio activo.
4. Haz clic en **Detalles de configuración** o **Conectar aplicaciones y dispositivos** (*Connect Apps & Devices*).
5. Copia los nombres de servidor, puertos y confirma que la cuenta de correo esté **activa**.

---

## Estrategias de Integración por Stack Tecnológico

Consulta las guías detalladas e implementaciones según la tecnología del proyecto:

* 📄 **Node.js / Express / Next.js**: Guía completa con `nodemailer` en [guia-node.md](./references/guia-node.md)
* 📄 **PHP Nativo / WordPress / Laravel**: Integración con `PHPMailer` y `wp_mail` en [guia-php.md](./references/guia-php.md)
* 📄 **Python (Flask / FastAPI / Django)**: Envío con `smtplib` / `email` en [guia-python.md](./references/guia-python.md)
* 📄 **Diagnóstico, Errores y Seguridad (SPF/DKIM/DMARC)**: Solución de problemas en [diagnostico-y-seguridad.md](./references/diagnostico-y-seguridad.md)

---

## Checklists de Validación Rápida

- [ ] ¿El usuario SMTP es la dirección completa de correo (`usuario@dominio.com`)?
- [ ] ¿La contraseña ingresada es exactamente la de la cuenta de correo (no la cuenta de hPanel)?
- [ ] ¿El puerto 465 (SSL) o 587 (TLS) está habilitado y no bloqueado por firewall o proveedor de hosting?
- [ ] ¿Los registros SPF y DKIM están configurados correctamente en las DNS del dominio para evitar caer en Spam?
