package com.finwise.backend.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByToUserIdOrderByCreatedAtDesc(Long toUserId);
    
    List<Message> findByFromUserIdOrderByCreatedAtDesc(Long fromUserId);
    
    List<Message> findByToUserIdAndIsReadFalseOrderByCreatedAtDesc(Long toUserId);
    
    List<Message> findByToUserIdOrFromUserIdOrderByCreatedAtDesc(Long toUserId, Long fromUserId);
}
