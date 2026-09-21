package com.finwise.backend.course;

import com.finwise.backend.security.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseRepository courseRepository;

    public CourseController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAllPublishedOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Long id) {
        return find(id);
    }

    @GetMapping("/category/{categoryId}")
    public List<Course> getCoursesByCategory(@PathVariable Long categoryId) {
        return courseRepository.findPublishedCoursesByCategory(categoryId);
    }

    @GetMapping("/search")
    public List<Course> searchCourses(@RequestParam String title) {
        return courseRepository.searchPublishedByTitle(title);
    }

    @GetMapping("/difficulty/{level}")
    public List<Course> getCoursesByDifficulty(@PathVariable Course.DifficultyLevel level) {
        return courseRepository.findByDifficultyLevel(level);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        course.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(courseRepository.save(course));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Course updateCourse(@PathVariable Long id, @Valid @RequestBody Course details) {
        Course course = find(id);
        course.setTitle(details.getTitle());
        course.setDescription(details.getDescription());
        course.setShortDescription(details.getShortDescription());
        course.setPrice(details.getPrice());
        course.setDiscountPrice(details.getDiscountPrice());
        course.setImageUrl(details.getImageUrl());
        course.setVideoUrl(details.getVideoUrl());
        course.setDurationHours(details.getDurationHours());
        course.setDifficultyLevel(details.getDifficultyLevel());
        course.setIsPublished(details.getIsPublished());
        course.setCategory(details.getCategory());
        return courseRepository.save(course);
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public Course setPublished(@PathVariable Long id, @RequestParam boolean published) {
        Course course = find(id);
        course.setIsPublished(published);
        return courseRepository.save(course);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseRepository.delete(find(id));
        return ResponseEntity.noContent().build();
    }

    private Course find(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> CurrentUserService.notFound("Course"));
    }
}
