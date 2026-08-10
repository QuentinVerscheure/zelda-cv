package zeldaCV.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import zeldaCV.dto.MailDTO;

@Service
public class MailService {

    private static final Logger logger = LoggerFactory.getLogger(MailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendMail(MailDTO mailDTO) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("quentin.verscheure@gmail.com");
            message.setSubject(mailDTO.getSubject());
            message.setText("message d'un utilisteur du portfolio zelda : " + mailDTO.getFrom() + "\n\n" + mailDTO.getText());
            mailSender.send(message);
        } catch (Exception e) {
            logger.error("Failed to send mail via {}", mailSender, e);
            throw new RuntimeException("impossible to send the mail: " + e.getMessage(), e);
        }
    }
}