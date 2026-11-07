package zeldaCV.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class PseudoTest {

    @ParameterizedTest
    @ValueSource(strings = {
        "admin", "Admin", "ADMIN !", "a.d.m.i.n", "4dm1n", "superadmin", "Administrateur",
        "Modérateur", "moderator", "modo",
        "Quentin V", "Quentin Verscheure", "q.verscheure", "Verscheur",
        "Webmestre", "Propriétaire", "root", "Support 2", "postmaster"
    })
    void forbiddenPseudos(String pseudo) {
        assertTrue(Pseudo.isForbidden(pseudo), pseudo);
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "Link", "Zelda", "guest", "Invité", "test", "Anonyme", "Marie", "Quentin", "quentin2", "Quentine", "Jean-Mod",
        "Bob42", "リンク", "🙂"
    })
    void allowedPseudos(String pseudo) {
        assertFalse(Pseudo.isForbidden(pseudo), pseudo);
    }
}
