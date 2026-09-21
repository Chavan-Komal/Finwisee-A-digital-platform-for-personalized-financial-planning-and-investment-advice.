package com.finwise.backend.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByIsPublishedTrue();

    List<Course> findByDifficultyLevel(Course.DifficultyLevel difficultyLevel);

    @Query("SELECT c FROM Course c WHERE c.isPublished = true AND c.category.id = :categoryId")
    List<Course> findPublishedCoursesByCategory(@Param("categoryId") Long categoryId);

    @Query("SELECT c FROM Course c WHERE c.isPublished = true ORDER BY c.createdAt DESC")
    List<Course> findAllPublishedOrderByCreatedAtDesc();

    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%')) AND c.isPublished = true")
    List<Course> searchPublishedByTitle(@Param("title") String title);

    @Modifying
    @Query("UPDATE Course c SET c.instructor = null WHERE c.instructor.id = :userId")
    void clearInstructor(@Param("userId") Long userId);
}
