# Guía de Integración Hostinger SMTP en Python

Esta referencia documenta cómo enviar correos electrónicos mediante SMTP de Hostinger en aplicaciones Python (scripts nativos, Flask, FastAPI, Django).

---

## 1. Script Nativo en Python (`smtplib` + `email`)

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Parámetros Hostinger
SMTP_HOST = "smtp.hostinger.com"
SMTP_PORT = 465  # SSL
USER_EMAIL = "contacto@tudominio.com"
USER_PASS = "TuPasswordHostinger123!"

def enviar_correo(nombre, email_cliente, mensaje):
    msg = MIMEMultipart()
    msg['From'] = f"Formulario Web <{USER_EMAIL}>"
    msg['To'] = "destino@tudominio.com"
    msg['Reply-To'] = email_cliente
    msg['Subject'] = f"Nuevo mensaje de contacto de {nombre}"

    body = f"""
    <h3>Nuevo mensaje recibido</h3>
    <p><b>Nombre:</b> {nombre}</p>
    <p><b>Email:</b> {email_cliente}</p>
    <p><b>Mensaje:</b></p>
    <p>{mensaje}</p>
    """
    msg.attach(MIMEText(body, 'html'))

    try:
        # Usar SSL para puerto 465
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(USER_EMAIL, USER_PASS)
            server.send_message(msg)
        print("Correo enviado con éxito")
        return True
    except Exception as e:
        print(f"Error enviando correo: {e}")
        return False

# Ejemplo de prueba
if __name__ == "__main__":
    enviar_correo("Juan Pérez", "juan@example.com", "Hola, me interesa solicitar información.")
```

---

## 2. Configuración en Django (`settings.py`)

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.hostinger.com'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_USE_TLS = False
EMAIL_HOST_USER = 'contacto@tudominio.com'
EMAIL_HOST_PASSWORD = 'TuPasswordHostinger123!'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
```

---

## 3. Configuración en FastAPI / Flask (con `fastapi-mail`)

```python
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

conf = ConnectionConfig(
    MAIL_USERNAME = "contacto@tudominio.com",
    MAIL_PASSWORD = "TuPasswordHostinger123!",
    MAIL_FROM = "contacto@tudominio.com",
    MAIL_PORT = 465,
    MAIL_SERVER = "smtp.hostinger.com",
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True
)
```
