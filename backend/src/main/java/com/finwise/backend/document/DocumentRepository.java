package com.finwise.backend.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    List<Document> findByUserIdOrderByUploadDateDesc(Long userId);
    
    List<Document> findByUserIdAndStatusOrderByUploadDateDesc(Long userId, Document.DocumentStatus status);
    
    List<Document> findByStatusOrderByUploadDateDesc(Document.DocumentStatus status);
}
