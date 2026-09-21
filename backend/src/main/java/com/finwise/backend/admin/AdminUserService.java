package com.finwise.backend.admin;

import com.finwise.backend.appointment.AppointmentRepository;
import com.finwise.backend.course.CourseRepository;
import com.finwise.backend.document.Document;
import com.finwise.backend.document.DocumentRepository;
import com.finwise.backend.financialplan.FinancialPlanRepository;
import com.finwise.backend.item.ItemRepository;
import com.finwise.backend.message.MessageRepository;
import com.finwise.backend.order.OrderRepository;
import com.finwise.backend.orderitem.OrderItemRepository;
import com.finwise.backend.security.CurrentUserService;
import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import com.finwise.backend.userprofile.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class AdminUserService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserService.class);

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final MessageRepository messageRepository;
    private final DocumentRepository documentRepository;
    private final FinancialPlanRepository financialPlanRepository;
    private final UserProfileRepository userProfileRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ItemRepository itemRepository;
    private final CourseRepository courseRepository;
    private final Path uploadRoot;

    public AdminUserService(UserRepository userRepository, AppointmentRepository appointmentRepository,
                            MessageRepository messageRepository, DocumentRepository documentRepository,
                            FinancialPlanRepository financialPlanRepository, UserProfileRepository userProfileRepository,
                            OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                            ItemRepository itemRepository, CourseRepository courseRepository,
                            @Value("${app.upload-dir}") String uploadDir) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.messageRepository = messageRepository;
        this.documentRepository = documentRepository;
        this.financialPlanRepository = financialPlanRepository;
        this.userProfileRepository = userProfileRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.itemRepository = itemRepository;
        this.courseRepository = courseRepository;
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    /** Deletes a user together with everything that references them (avoids foreign-key errors). */
    @Transactional
    public void deleteUserAndData(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> CurrentUserService.notFound("User"));

        for (Document document : documentRepository.findByUserIdOrderByUploadDateDesc(userId)) {
            deleteStoredFile(document);
            documentRepository.delete(document);
        }
        appointmentRepository.deleteAllForUser(userId);
        messageRepository.deleteAllForUser(userId);
        financialPlanRepository.deleteAllForUser(userId);
        userProfileRepository.deleteAllForUser(userId);
        orderItemRepository.deleteAllForUser(userId);
        orderRepository.deleteAllForUser(userId);
        itemRepository.clearCreator(userId);
        courseRepository.clearInstructor(userId);
        userRepository.delete(user);
    }

    private void deleteStoredFile(Document document) {
        if (document.getFilePath() == null) return;
        Path path = uploadRoot.resolve(document.getFilePath()).normalize();
        if (!path.startsWith(uploadRoot)) return;
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Could not delete file {}", path, e);
        }
    }
}
