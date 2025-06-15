package zeldaCV.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import zeldaCV.dto.MailDTO;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMail(MailDTO mailDTO) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("quentin.verscheure@gmail.com");
            message.setSubject(mailDTO.getSubject());
            message.setText(mailDTO.getText());
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("impossible to send the mail", e);
        }
    }
}