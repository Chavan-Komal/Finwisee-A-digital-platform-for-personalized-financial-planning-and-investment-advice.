package com.finwise.backend.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByUserIdOrderByUploadDateDesc(Long userId);

    List<Document> findAllByOrderByUploadDateDesc();

    long countByStatus(Document.DocumentStatus status);
}
