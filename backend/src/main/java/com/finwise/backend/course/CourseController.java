package com.finwise.backend.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAllPublishedOrderByCreatedAtDesc();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> ResponseEntity.ok().body(course))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Long categoryId) {
        List<Course> courses = courseRepository.findPublishedCoursesByCategory(categoryId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String title) {
        List<Course> courses = courseRepository.findByTitleContainingIgnoreCaseAndIsPublishedTrue(title);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Course>> getCoursesByDifficulty(@PathVariable Course.DifficultyLevel level) {
        List<Course> courses = courseRepository.findByDifficultyLevel(level);
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('INSTRUCTOR') and @courseRepository.findById(#id).orElse(null)?.instructor?.id == principal.id)")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course courseDetails) {
        return courseRepository.findById(id)
                .map(course -> {
                    course.setTitle(courseDetails.getTitle());
                    course.setDescription(courseDetails.getDescription());
                    course.setShortDescription(courseDetails.getShortDescription());
                    course.setPrice(courseDetails.getPrice());
                    course.setDiscountPrice(courseDetails.getDiscountPrice());
                    course.setImageUrl(courseDetails.getImageUrl());
                    course.setVideoUrl(courseDetails.getVideoUrl());
                    course.setDurationHours(courseDetails.getDurationHours());
                    course.setDifficultyLevel(courseDetails.getDifficultyLevel());
                    course.setIsPublished(courseDetails.getIsPublished());
                    course.setCategory(courseDetails.getCategory());
                    return ResponseEntity.ok(courseRepository.save(course));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(course -> {
                    courseRepository.delete(course);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
