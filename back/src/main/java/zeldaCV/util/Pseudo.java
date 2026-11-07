package zeldaCV.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.Set;

/**
 * Guestbook pseudos that are not allowed: the goal is to prevent impersonating the site owner
 * or the site itself (admin, support...), not to filter insults.
 *
 * The pseudo is normalized before the check (lowercase, no accents, letters and digits only),
 * so "Admin", "ADMIN !", "a.d.m.i.n" or "Modérateur" are caught as well.
 * Generic names such as "guest", "test" or "anonyme" are allowed on purpose: in a guestbook,
 * that is what a visitor who doesn't want to give a name types.
 */
public final class Pseudo {

    /**
     * Forbidden anywhere in the pseudo ("superadmin", "Quentin_Verscheure", "le modérateur"...).
     * Kept short on purpose: a word that is too common would block legitimate pseudos.
     * Also checked after digits are read as letters, so "4dm1n" is caught too.
     */
    private static final Set<String> FORBIDDEN_PARTS = Set.of(
        "admin",                              // admin, administrator, administrateur, sysadmin...
        "moderat",                            // moderator, moderateur, modérateur
        "verscheur",                          // owner's last name, also when slightly misspelled
        "webmaster", "webmestre",
        "proprietaire"
    );

    /** Forbidden as the whole pseudo only, trailing digits ignored ("Support 2", "root123"). */
    private static final Set<String> FORBIDDEN_PSEUDOS = Set.of(
        // owner's first name and initials
        "quentinv", "qv", "qverscheure",
        // site roles
        "root", "system", "systeme", "superuser", "owner", "proprio",
        "mod", "modo", "staff", "team", "equipe", "official", "officiel",
        "support", "helpdesk", "security", "securite", "operator", "operateur", "service", "bot",
        // contact addresses people could take for an official account
        "contact", "contactus", "contactme", "info", "information", "mail", "email",
        "postmaster", "abuse"
    );

    private Pseudo() {
    }

    public static boolean isForbidden(String pseudo) {
        if (pseudo == null) {
            return true;
        }
        // A pseudo without latin letters or digits (emoji, Japanese...) normalizes to "" and matches
        // nothing: it is allowed. Blank pseudos are already rejected by the DTO validation (@NotBlank).
        String normalized = normalize(pseudo);

        String withoutTrailingDigits = normalized.replaceAll("\\d+$", "");
        if (FORBIDDEN_PSEUDOS.contains(normalized) || FORBIDDEN_PSEUDOS.contains(withoutTrailingDigits)) {
            return true;
        }

        String leetDecoded = decodeLeet(normalized);
        return FORBIDDEN_PARTS.stream().anyMatch(part -> normalized.contains(part) || leetDecoded.contains(part));
    }

    /** Lowercase, accents removed, letters and digits only: "Modérateur !" -> "moderateur". */
    private static String normalize(String pseudo) {
        String withoutAccents = Normalizer.normalize(pseudo, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }

    /** Digits commonly used as letters: "4dm1n" -> "admin". */
    private static String decodeLeet(String normalized) {
        return normalized
                .replace('0', 'o')
                .replace('1', 'i')
                .replace('3', 'e')
                .replace('4', 'a')
                .replace('5', 's')
                .replace('7', 't');
    }
}
