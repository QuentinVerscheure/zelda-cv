package zeldaCV.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import zeldaCV.dto.MailDTO;

@RestController
@RequestMapping({"/api/sendMailToOwner","/sendMailToOwner"})
@Tag(name = "Mail to Owner", description = "sending mail to the owner")
public class mailControler {

    @org.springframework.beans.factory.annotation.Autowired
    private zeldaCV.service.MailService mailService;

    @PostMapping("/")
    @Operation(summary = "send mail", description = "send mail to the owner")
    public String[] sendMail(@RequestBody MailDTO mailDto) {
        mailService.sendMail(mailDto);
        return ResponseEntity.ok()
                .body(new String[] { "MAIL_SENT", "Mail sent successfully" })
                .getBody();
    }   

}
