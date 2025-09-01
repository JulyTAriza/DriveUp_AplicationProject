package com.dh.DriveUp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreo(String para, String asunto, String texto) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(para);
            mensaje.setSubject(asunto);
            mensaje.setText(texto);
            mensaje.setFrom("DriveUpAplication@gmail.com"); // Debe coincidir con application.properties

            log.info("📧 Enviando correo a: {}", para);
            log.debug("Asunto: {}, Texto: {}", asunto, texto);

            mailSender.send(mensaje);

            log.info("✅ Correo enviado exitosamente a {}", para);
        } catch (Exception e) {
            log.error("❌ Error al enviar correo: {}", e.getMessage(), e);
        }
    }
}
