# Guía de Integración Hostinger SMTP en PHP y WordPress

Esta referencia documenta cómo integrar el correo de Hostinger en sitios basados en PHP Nativo, WordPress y Laravel.

---

## 1. PHP Nativo con PHPMailer

### Instalación vía Composer
```bash
composer require phpmailer/phpmailer
```

### Script de Procesamiento (`enviar-formulario.php`)
```php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $mensaje = filter_var($_POST['mensaje'], FILTER_SANITIZE_STRING);

    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor Hostinger
        $mail->isSMTP();
        $mail->Host       = 'smtp.hostinger.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'contacto@tudominio.com'; // Dirección completa de Hostinger
        $mail->Password   = 'TuPasswordHostinger123!'; // Contraseña del correo
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
        $mail->Port       = 465; // O bien 587 con ENCRYPTION_STARTTLS

        // Remitente y Destinatario
        $mail->setFrom('contacto@tudominio.com', 'Formulario Web');
        $mail->addAddress('destino@tudominio.com', 'Administrador');
        $mail->addReplyTo($email, $nombre); // Para responder directo al cliente

        // Contenido
        $mail->isHTML(true);
        $mail->Subject = "Nuevo mensaje de $nombre";
        $mail->Body    = "<h3>Nuevo Mensaje de Contacto</h3>
                          <p><strong>Nombre:</strong> $nombre</p>
                          <p><strong>Email:</strong> $email</p>
                          <p><strong>Mensaje:</strong><br>$mensaje</p>";
        $mail->AltBody = "Nombre: $nombre\nEmail: $email\nMensaje:\n$mensaje";

        $mail->send();
        echo json_encode(["status" => "success", "message" => "Correo enviado correctamente"]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Error al enviar: {$mail->ErrorInfo}"]);
    }
}
?>
```

---

## 2. WordPress (`functions.php` o Plugin Personalizado)

Para forzar a WordPress a utilizar SMTP de Hostinger sin plugins adicionales:

```php
// Configurar wp_mail para usar SMTP de Hostinger
add_action('phpmailer_init', 'configurar_hostinger_smtp');
function configurar_hostinger_smtp($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host       = 'smtp.hostinger.com';
    $phpmailer->SMTPAuth   = true;
    $phpmailer->Port       = 465;
    $phpmailer->Username   = 'contacto@tudominio.com';
    $phpmailer->Password   = 'TuPasswordHostinger123!';
    $phpmailer->SMTPSecure = 'ssl';
    $phpmailer->From       = 'contacto@tudominio.com';
    $phpmailer->FromName   = 'Mi Sitio Web';
}
```

*Alternativa en WordPress*: Utilizar plugins como **WP Mail SMTP** o **FluentSMTP** ingresando Host (`smtp.hostinger.com`), Puerto (465 SSL), Usuario y Password.

---

## 3. Laravel (`.env`)

En Laravel, solo debes actualizar tu archivo `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=contacto@tudominio.com
MAIL_PASSWORD=TuPasswordHostinger123!
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="contacto@tudominio.com"
MAIL_FROM_NAME="${APP_NAME}"
```
