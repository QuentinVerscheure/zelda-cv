package zeldaCV.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class Pseudo {

    // List of forbidden pseudos: Java keywords, reserved words, admin, etc.
    public static final Set<String> FORBIDDEN_PSEUDOS = new HashSet<>(Arrays.asList(
        // Common reserved usernames
        "admin", "administrator", "root", "system", "support", "moderator", "mod", "owner",
        "superuser", "test", "null", "undefined", "guest", ""
    ));

    public static boolean isForbidden(String pseudo) {
        return FORBIDDEN_PSEUDOS.contains(pseudo.toLowerCase());
    }
}
