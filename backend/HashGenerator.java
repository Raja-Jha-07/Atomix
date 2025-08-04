import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode("manager123");
        System.out.println("Hash for manager123: " + hashedPassword);
        
        // Verify it works
        boolean matches = encoder.matches("manager123", hashedPassword);
        System.out.println("Verification: " + matches);
    }
}
