package com.nhom11.admin.repository;

import com.nhom11.admin.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
