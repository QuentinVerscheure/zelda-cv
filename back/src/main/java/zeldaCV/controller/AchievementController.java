package zeldaCV.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import zeldaCV.bean.AchievementBean;
import zeldaCV.constants.AchievementConstants;
import zeldaCV.dto.AchievementDTO;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.service.AchievementService;

@RestController
@RequestMapping("/api/achievements")
@Tag(name = "Achievements", description = "Operations related to Achievements of a player")
public class AchievementController {

    private final AchievementService achievementService;

    @Autowired
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    @GetMapping("/getDiffTypeOfAchievement")
    @Operation(summary = "give all type of achivement available for a player", description = "give all type of achivement available for a player")
    public String[] getDiffTypeOfAchievement() {
        return AchievementConstants.ACHIEVEMENT_FIELDS;
    }

    @PutMapping("/update")
    @Operation(summary = "update an achievement by true or false", 
    description = "update a specific achivement of a user by true or false",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        required = true, 
        content = @Content(
            schema = @Schema(implementation = AchievementDTO.class), 
            examples = @ExampleObject(
                value = "{\n"+
            "  \"cv\": false,\n" +
            "  \"cvDownload\": false,\n" +
            "  \"portfolio\": false,\n" +
            "  \"link\": true,\n" +
            "  \"linkClick\": true,\n" +
            "  \"phone\": true,\n" +
            "  \"phoneContact\": true,\n" +
            "  \"guestBook\": true,\n" +
            "  \"guestBookComment\": true,\n" +
            "  \"achievementVarious\": true,\n" +
            "  \"achievementCredit\": true\n" +
            "}"))))
    public ResponseEntity<AchievementDTO> updateAchievement(@RequestBody AchievementDTO achievementDTO) {
        AchievementBean achievementBean = AchievementMapper.dtoToBean(achievementDTO);
        AchievementDTO updatedAchievementDTO = achievementService.updateAchievement(achievementBean);
        return ResponseEntity.ok(updatedAchievementDTO);

    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user's achievement", description = "Get all achievement for a user")
    public ResponseEntity<AchievementDTO> getUserachievement(@PathVariable Long id) {
        AchievementDTO achievementDto = achievementService.getAchievementByUserId(id);
        return ResponseEntity.ok(achievementDto);
    }
}
