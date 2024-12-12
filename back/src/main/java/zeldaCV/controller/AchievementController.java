package zeldaCV.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zeldaCV.bean.AchievementBean;
import zeldaCV.dto.AchievementDTO;
import zeldaCV.converter.AchievementMapper;
import zeldaCV.service.AchievementService;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final AchievementService achievementService;

    @Autowired
    public AchievementController(AchievementService achievementService) {
        this.achievementService = achievementService;
    }

    // Update an achievement
    @PutMapping("/")
    public ResponseEntity<AchievementDTO> updateAchievement(@RequestBody AchievementDTO achievementDTO) {
        AchievementBean achievementBean = AchievementMapper.dtoToBean(achievementDTO);
        AchievementBean updatedAchievementBean = achievementService.updateAchievement(achievementBean);
        AchievementDTO updatedAchievementDTO = AchievementMapper.beanToDto(updatedAchievementBean);
        return ResponseEntity.ok(updatedAchievementDTO);
    }
}
