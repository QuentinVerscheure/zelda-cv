package zeldaCV.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import zeldaCV.bean.CommentBean;
import zeldaCV.dto.CommentCreateDTO;
import zeldaCV.dto.CommentDTO;
import zeldaCV.dto.CommentUpdateDTO;
import zeldaCV.model.CommentEntity;
import zeldaCV.repository.CommentRepository;
import zeldaCV.util.CommentPassword;
import zeldaCV.util.CommentRules;

class CommentServiceImplTest {

    private static final String PASSWORD = "q3Jf0c1x9V7mKkZb2Yw8uT4sR6pN5oLhGdEaCiBjQ0M";
    private static final String OTHER_PASSWORD = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    private static final Instant NOW = Instant.parse("2026-06-15T12:00:00Z");
    private static final LocalDateTime NOW_UTC = LocalDateTime.ofInstant(NOW, ZoneOffset.UTC);

    // a free spot on the wall, outside the restricted central area
    private static final int FREE_X = 600;
    private static final int FREE_Y = 600;

    private CommentRepository repository;
    private CommentServiceImpl service;

    @BeforeEach
    void setUp() {
        repository = mock(CommentRepository.class);
        service = new CommentServiceImpl(repository, Clock.fixed(NOW, ZoneOffset.UTC));
        when(repository.findNearbyComments(anyInt(), anyInt(), anyInt(), anyInt())).thenReturn(List.of());
        when(repository.save(any(CommentEntity.class))).thenAnswer(invocation -> {
            CommentEntity entity = invocation.getArgument(0);
            if (entity.getId() == null) {
                entity.setId(42L);
            }
            return entity;
        });
    }

    private static CommentCreateDTO createDto(String pseudo, String text, int x, int y) {
        return new CommentCreateDTO(pseudo, text, x, y, PASSWORD);
    }

    /** An existing message created {@code age} ago with {@link #PASSWORD}. */
    private CommentEntity existingComment(long id, Duration age) {
        CommentEntity entity = new CommentEntity(id, "Link", "Bonjour", FREE_X, FREE_Y,
                NOW_UTC.minus(age), CommentPassword.hash(PASSWORD));
        when(repository.findById(id)).thenReturn(Optional.of(entity));
        return entity;
    }

    private static void assertStatus(Throwable error, HttpStatus status) {
        assertThat(error).isInstanceOf(ResponseStatusException.class);
        assertThat(((ResponseStatusException) error).getStatusCode()).isEqualTo(status);
    }

    @Nested
    class Create {

        @Test
        void storesOnlyThePasswordHashWithTheCreationDate() {
            CommentDTO created = service.createComment(createDto("Link", "Bonjour", FREE_X, FREE_Y));

            ArgumentCaptor<CommentEntity> saved = ArgumentCaptor.forClass(CommentEntity.class);
            verify(repository).save(saved.capture());
            assertThat(saved.getValue().getPasswordHash())
                    .isEqualTo(CommentPassword.hash(PASSWORD))
                    .isNotEqualTo(PASSWORD);
            assertThat(saved.getValue().getCreatedAt()).isEqualTo(NOW_UTC);

            assertThat(created.getId()).isEqualTo(42L);
            assertThat(created.getDate()).isEqualTo(NOW);
        }

        @Test
        void trimsThePseudoAndReplacesLineBreaksWithSpaces() {
            CommentDTO created = service.createComment(
                    createDto("  Link  ", "  Première ligne\r\n\n   seconde ligne  ", FREE_X, FREE_Y));

            assertThat(created.getUserPseudo()).isEqualTo("Link");
            assertThat(created.getComment()).isEqualTo("Première ligne seconde ligne");
        }

        @Test
        void rejectsATextMadeOnlyOfLineBreaks() {
            assertThatThrownBy(() -> service.createComment(createDto("Link", "\n\r\n", FREE_X, FREE_Y)))
                    .satisfies(error -> assertStatus(error, HttpStatus.BAD_REQUEST));
            verify(repository, never()).save(any());
        }

        @Test
        void rejectsAForbiddenPseudo() {
            assertThatThrownBy(() -> service.createComment(createDto("Admin", "Bonjour", FREE_X, FREE_Y)))
                    .satisfies(error -> assertStatus(error, HttpStatus.BAD_REQUEST))
                    .hasMessageContaining("pseudo");
            verify(repository, never()).save(any());
        }

        @Test
        void rejectsAMessageInTheRestrictedCentralArea() {
            assertThatThrownBy(() -> service.createComment(createDto("Link", "Bonjour", 50, 50)))
                    .satisfies(error -> assertStatus(error, HttpStatus.BAD_REQUEST));
            verify(repository, never()).save(any());
        }

        @Test
        void rejectsAMessageOverlappingAnotherOne() {
            CommentEntity neighbour = new CommentEntity(7L, "Zelda", "Coucou", FREE_X + 100, FREE_Y + 20,
                    NOW_UTC, CommentPassword.hash(OTHER_PASSWORD));
            when(repository.findNearbyComments(anyInt(), anyInt(), anyInt(), anyInt())).thenReturn(List.of(neighbour));

            assertThatThrownBy(() -> service.createComment(createDto("Link", "Bonjour", FREE_X, FREE_Y)))
                    .satisfies(error -> assertStatus(error, HttpStatus.BAD_REQUEST));
            verify(repository, never()).save(any());
        }
    }

    @Nested
    class VerifyPassword {

        @Test
        void trueWithTheRightPasswordInsideTheEditWindow() {
            existingComment(1L, Duration.ofDays(1));
            assertThat(service.verifyPassword(1L, PASSWORD)).isTrue();
        }

        @Test
        void falseWithAWrongPassword() {
            existingComment(1L, Duration.ofDays(1));
            assertThat(service.verifyPassword(1L, OTHER_PASSWORD)).isFalse();
        }

        @Test
        void falseOnceTheEditWindowIsOver() {
            existingComment(1L, CommentRules.EDIT_WINDOW);
            assertThat(service.verifyPassword(1L, PASSWORD)).isFalse();
        }

        @Test
        void notFoundForAnUnknownMessage() {
            when(repository.findById(99L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.verifyPassword(99L, PASSWORD))
                    .satisfies(error -> assertStatus(error, HttpStatus.NOT_FOUND));
        }
    }

    @Nested
    class Update {

        @Test
        void updatesTextAndPositionButKeepsPseudoAndCreationDate() {
            CommentEntity existing = existingComment(1L, Duration.ofDays(2));

            CommentDTO updated = service.updateComment(1L,
                    new CommentUpdateDTO("Nouveau\ntexte", FREE_X + 10, FREE_Y + 5, PASSWORD));

            assertThat(updated.getComment()).isEqualTo("Nouveau texte");
            assertThat(updated.getCoordinateX()).isEqualTo(FREE_X + 10);
            assertThat(updated.getCoordinateY()).isEqualTo(FREE_Y + 5);
            assertThat(updated.getUserPseudo()).isEqualTo("Link");
            assertThat(existing.getCreatedAt()).isEqualTo(NOW_UTC.minusDays(2));
        }

        @Test
        void aMessageDoesNotCollideWithItselfWhenMovedALittle() {
            CommentEntity existing = existingComment(1L, Duration.ofDays(1));
            when(repository.findNearbyComments(anyInt(), anyInt(), anyInt(), anyInt())).thenReturn(List.of(existing));

            CommentDTO updated = service.updateComment(1L, new CommentUpdateDTO("Bonjour", FREE_X + 3, FREE_Y, PASSWORD));

            assertThat(updated.getCoordinateX()).isEqualTo(FREE_X + 3);
        }

        @Test
        void forbiddenWithAWrongPassword() {
            existingComment(1L, Duration.ofDays(1));
            assertThatThrownBy(() -> service.updateComment(1L, new CommentUpdateDTO("Pirate", FREE_X, FREE_Y, OTHER_PASSWORD)))
                    .satisfies(error -> assertStatus(error, HttpStatus.FORBIDDEN));
            verify(repository, never()).save(any());
        }

        @Test
        void forbiddenOnceTheEditWindowIsOver() {
            existingComment(1L, CommentRules.EDIT_WINDOW.plusSeconds(1));
            assertThatThrownBy(() -> service.updateComment(1L, new CommentUpdateDTO("Trop tard", FREE_X, FREE_Y, PASSWORD)))
                    .satisfies(error -> assertStatus(error, HttpStatus.FORBIDDEN))
                    .hasMessageContaining(CommentRules.EDIT_WINDOW_DAYS + " jours");
        }

        @Test
        void stillAllowedJustBeforeTheEndOfTheEditWindow() {
            existingComment(1L, CommentRules.EDIT_WINDOW.minusSeconds(1));
            assertThat(service.updateComment(1L, new CommentUpdateDTO("Juste à temps", FREE_X, FREE_Y, PASSWORD)).getComment())
                    .isEqualTo("Juste à temps");
        }

        @Test
        void cannotBeMovedIntoTheRestrictedArea() {
            existingComment(1L, Duration.ofDays(1));
            assertThatThrownBy(() -> service.updateComment(1L, new CommentUpdateDTO("Bonjour", 0, 0, PASSWORD)))
                    .satisfies(error -> assertStatus(error, HttpStatus.BAD_REQUEST));
            verify(repository, never()).save(any());
        }
    }

    @Nested
    class Delete {

        @Test
        void deletesWithTheRightPassword() {
            CommentEntity existing = existingComment(1L, Duration.ofDays(1));
            service.deleteComment(1L, PASSWORD);
            verify(repository).delete(existing);
        }

        @Test
        void forbiddenWithAWrongPassword() {
            existingComment(1L, Duration.ofDays(1));
            assertThatThrownBy(() -> service.deleteComment(1L, OTHER_PASSWORD))
                    .satisfies(error -> assertStatus(error, HttpStatus.FORBIDDEN));
            verify(repository, never()).delete(any());
        }

        @Test
        void notFoundForAnUnknownMessage() {
            when(repository.findById(99L)).thenReturn(Optional.empty());
            assertThatThrownBy(() -> service.deleteComment(99L, PASSWORD))
                    .satisfies(error -> assertStatus(error, HttpStatus.NOT_FOUND));
        }
    }

    @Nested
    class Overlap {

        private CommentBean at(Long id, int x, int y) {
            CommentBean bean = new CommentBean();
            bean.setId(id);
            bean.setCoordinateX(x);
            bean.setCoordinateY(y);
            return bean;
        }

        @Test
        void messagesThatOnlyTouchDoNotOverlap() {
            // boxes are 131x44: side by side and stacked without overlapping
            assertThat(CommentServiceImpl.isOverlappingWithCommentsList(at(null, 600, 600), List.of(at(1L, 731, 600)))).isFalse();
            assertThat(CommentServiceImpl.isOverlappingWithCommentsList(at(null, 600, 600), List.of(at(1L, 600, 644)))).isFalse();
        }

        @Test
        void oneCommonPixelIsAnOverlap() {
            assertThat(CommentServiceImpl.isOverlappingWithCommentsList(at(null, 600, 600), List.of(at(1L, 730, 643)))).isTrue();
        }

        @Test
        void restrictedAreaCoversTheCentreOfTheWall() {
            assertThat(CommentServiceImpl.isOverlappingRestrictedArea(at(null, 100, 100))).isTrue();
            assertThat(CommentServiceImpl.isOverlappingRestrictedArea(at(null, 600, 600))).isFalse();
        }
    }
}
