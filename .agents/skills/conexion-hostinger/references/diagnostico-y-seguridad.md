# Diagnóstico, Errores Frecuentes y Seguridad Registros DNS (SPF, DKIM, DMARC)

Guía completa para solucionar problemas de envío y recepción con Hostinger Email y garantizar que los correos no terminen en Spam / Junk.

---

## 1. Registros DNS Obligatorios en Hostinger

Para evitar el rechazo de servidores como Gmail, Outlook o Yahoo, el dominio debe tener los registros SPF, DKIM y DMARC configurados correctamente en la zona DNS de Hostinger hPanel.

### A. Registro SPF (Sender Policy Framework)
* **Tipo**: `TXT`
* **Nombre / Host**: `@` (o déjalo en blanco según la interfaz)
* **Valor / TXT Value**:
  ```text
  v=spf1 include:spf.hostinger.com ~all
  ```
  *(Nota: Si usas Titan Email en Hostinger, el registro SPF puede ser `v=spf1 include:spf.titan.email ~all`)*

### B. Registro DKIM (DomainKeys Identified Mail)
* **Tipo**: `TXT` / `CNAME` (Proporcionado automáticamente en hPanel)
* **Ubicación en hPanel**: Ve a **Emails** -> Tu Dominio -> **Registros DNS de Email** -> Copia la clave DKIM generada por Hostinger.

### C. Registro DMARC
* **Tipo**: `TXT`
* **Nombre / Host**: `_dmarc`
* **Valor**:
  ```text
  v=DMARC1; p=none; rua=mailto:dmarc-reports@tudominio.com
  ```

---

## 2. Diagnóstico de Errores Frecuentes

### ❌ Error `535 Authentication Failed` / `Invalid Credentials`
* **Causa**: El nombre de usuario o contraseña son incorrectos.
* **Solución**:
  1. Asegúrate de ingresar el **correo completo** (`contacto@dominio.com`), NO solo `contacto`.
  2. Verifica que la contraseña sea la cuenta de correo específica y no la contraseña maestra de Hostinger hPanel.
  3. Si es necesario, restablece la contraseña del correo desde hPanel.

### ❌ Error `Connection Timeout` / `Connection Refused`
* **Causa**: El puerto (465 o 587) está bloqueado por el firewall local o el proveedor de red/servidor (ej. AWS o DigitalOcean bloquean puerto 25 y a veces 587).
* **Solución**:
  1. Si estás usando puerto `465`, asegúrate de habilitar el cifrado `SSL/TLS`.
  2. Prueba alternativamente el puerto `587` con cifrado `STARTTLS`.

### ❌ Error `550 Sender Address Rejected` / `Sender mismatch`
* **Causa**: Intentas enviar un correo donde el campo `From` (Remitente) es distinto a la cuenta autenticada en SMTP.
* **Solución**:
  1. El campo `From:` DEBE coincidir con la cuenta de correo autenticada (`USER_EMAIL`).
  2. Para recibir las respuestas del cliente en su correo real, utiliza la cabecera `Reply-To:` asignada al email del visitante.

---

## 3. Checklist de Seguridad Anti-Spam
- [x] Firma de correos mediante SPF y DKIM activos.
- [x] Cabecera `From` coincidente con el dominio emisor.
- [x] Sin palabras o código HTML sospechoso en la plantilla del formulario.
