package zeldaCV.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
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

    // get all type of achivement in the game
    @GetMapping("/getDiffTypeOfAchievement")
    @Operation(summary = "give all type of achivement available for a player", description = "give all type of achivement available for a player")
    public String[] getDiffTypeOfAchievement() {
        return AchievementConstants.ACHIEVEMENT_FIELDS;
    };

    // Update an achievement
    @PutMapping("/update")
    @Operation(summary = "update an achievement by true or false", description = "update a specific achivement of a user by true or false")
    public ResponseEntity<AchievementDTO> updateAchievement(@RequestBody AchievementDTO achievementDTO) {
        AchievementBean achievementBean = AchievementMapper.DTOToBean(achievementDTO);
        AchievementDTO updatedAchievementDTO = achievementService.updateAchievement(achievementBean);
        return ResponseEntity.ok(updatedAchievementDTO);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user's achievement", description = "Get all achievement for a user")
    public ResponseEntity<AchievementDTO> getUserachievement(@PathVariable Long id) {
        AchievementDTO Achievement = achievementService.getAchievementByUserId(id);
        return new ResponseEntity<>(Achievement, HttpStatus.OK);
    }
}
