package zeldaCV.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class Pseudo {

    // List of forbidden pseudos: Java keywords, reserved words, admin, etc.
    public static final Set<String> FORBIDDEN_PSEUDOS = new HashSet<>(Arrays.asList(
        // Common reserved usernames
        "admin", "administrator", "root", "system", "support", "moderator", "mod", "owner",
        "superuser", "test", "null", "undefined", "guest", "",
        // OS/system/service names
        "user", "users", "operator", "service", "services", "server", "client", "console",
        // Impersonation
        "admin1", "admin2", "administrator1", "administrator2", "webmaster", "webadmin", "web", "support1", "support2",
        // Social engineering
        "helpdesk", "security", "contact", "info", "information", "mail", "email", "contactus", "contactme",
        // Common website/system names
        "www", "http", "https", "ftp", "smtp", "imap", "pop", "mailadmin", "postmaster", "abuse"
    ));

    public static boolean isForbidden(String pseudo) {
        return FORBIDDEN_PSEUDOS.contains(pseudo.toLowerCase());
    }
}
