package zeldaCV.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import zeldaCV.model.UserEntity;
import zeldaCV.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    // implement of UserDetailsService to load user by username (pseudo) for authentication for JWT
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String pseudo) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByPseudo(pseudo)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with pseudo: " + pseudo));
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getPseudo())
            .password(user.getPass())
            .authorities(new ArrayList<>()) // no role, empty list
            .build();
    }
}
