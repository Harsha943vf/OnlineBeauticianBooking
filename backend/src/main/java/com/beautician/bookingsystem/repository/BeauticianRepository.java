package com.beautician.bookingsystem.repository;

import com.beautician.bookingsystem.model.Beautician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BeauticianRepository extends JpaRepository<Beautician, Long> {
    Optional<Beautician> findByUserId(Long userId);
}
