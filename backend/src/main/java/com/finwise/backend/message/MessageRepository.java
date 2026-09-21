package com.finwise.backend.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByToUserIdOrderByCreatedAtDesc(Long toUserId);

    List<Message> findByFromUserIdOrderByCreatedAtDesc(Long fromUserId);

    List<Message> findAllByOrderByCreatedAtDesc();

    long countByToUserIdAndIsReadFalse(Long toUserId);

    @Modifying
    @Query("DELETE FROM Message m WHERE m.fromUser.id = :userId OR m.toUser.id = :userId")
    void deleteAllForUser(@Param("userId") Long userId);
}
