package com.finwise.backend.config;

import com.finwise.backend.category.Category;
import com.finwise.backend.category.CategoryRepository;
import com.finwise.backend.course.Course;
import com.finwise.backend.course.CourseRepository;
import com.finwise.backend.investment.InvestmentProduct;
import com.finwise.backend.investment.InvestmentProductRepository;
import com.finwise.backend.item.Item;
import com.finwise.backend.item.ItemRepository;
import com.finwise.backend.user.Role;
import com.finwise.backend.user.User;
import com.finwise.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private InvestmentProductRepository investmentProductRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        logger.info("Starting data initialization...");

        // Only initialize if no data exists (useful for MySQL persistence)
        if (shouldInitializeData()) {
            initializeUsers();
            initializeCategories();
            initializeCourses();
            initializeItems();
            initializeInvestmentProducts();
            logger.info("Data initialization completed!");
        } else {
            logger.info("Data already exists, skipping initialization.");
        }
    }

    private boolean shouldInitializeData() {
        // Check if basic data exists
        return userRepository.count() == 0;
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            logger.info("Initializing users...");

            // Create Admin User
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@finwise.com");
            admin.setPhone("+91-9876543210");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // Create Regular Users
            User user1 = new User();
            user1.setFirstName("John");
            user1.setLastName("Doe");
            user1.setEmail("john.doe@example.com");
            user1.setPhone("+91-9876543211");
            user1.setPasswordHash(passwordEncoder.encode("user123"));
            user1.setRole(Role.USER);
            userRepository.save(user1);

            User user2 = new User();
            user2.setFirstName("Jane");
            user2.setLastName("Smith");
            user2.setEmail("jane.smith@example.com");
            user2.setPhone("+91-9876543212");
            user2.setPasswordHash(passwordEncoder.encode("user123"));
            user2.setRole(Role.USER);
            userRepository.save(user2);

            User instructor = new User();
            instructor.setFirstName("Dr. Financial");
            instructor.setLastName("Expert");
            instructor.setEmail("instructor@finwise.com");
            instructor.setPhone("+91-9876543213");
            instructor.setPasswordHash(passwordEncoder.encode("instructor123"));
            instructor.setRole(Role.USER);
            userRepository.save(instructor);

            logger.info("Users initialized successfully!");
        }
    }

    private void initializeCategories() {
        if (categoryRepository.count() == 0) {
            logger.info("Initializing categories...");

            List<Category> categories = Arrays.asList(
                createCategory("Personal Finance", "Learn about budgeting, saving, and personal financial management", 
                    "https://example.com/images/personal-finance.jpg"),
                createCategory("Investment", "Stock market, mutual funds, and investment strategies", 
                    "https://example.com/images/investment.jpg"),
                createCategory("Insurance", "Life, health, and general insurance products and planning", 
                    "https://example.com/images/insurance.jpg"),
                createCategory("Tax Planning", "Income tax, tax-saving investments, and tax optimization", 
                    "https://example.com/images/tax-planning.jpg"),
                createCategory("Retirement Planning", "Plan for your golden years with smart retirement strategies", 
                    "https://example.com/images/retirement.jpg"),
                createCategory("Cryptocurrency", "Digital currencies, blockchain, and crypto investments", 
                    "https://example.com/images/crypto.jpg"),
                createCategory("Real Estate", "Property investment, home loans, and real estate planning", 
                    "https://example.com/images/real-estate.jpg"),
                createCategory("Financial Tools", "Calculators, planners, and financial management tools", 
                    "https://example.com/images/tools.jpg")
            );

            categoryRepository.saveAll(categories);
            logger.info("Categories initialized successfully!");
        }
    }

    private void initializeCourses() {
        if (courseRepository.count() == 0) {
            logger.info("Initializing courses...");

            User instructor = userRepository.findByEmail("instructor@finwise.com").orElse(null);
            Category personalFinance = categoryRepository.findByName("Personal Finance").orElse(null);
            Category investment = categoryRepository.findByName("Investment").orElse(null);
            Category insurance = categoryRepository.findByName("Insurance").orElse(null);

            if (instructor != null && personalFinance != null) {
                List<Course> courses = Arrays.asList(
                    createCourse("Complete Personal Finance Mastery", 
                        "Master the art of personal finance with comprehensive budgeting, saving, and investment strategies",
                        "Learn everything from basic budgeting to advanced investment techniques",
                        new BigDecimal("2999"), new BigDecimal("1999"), personalFinance, instructor, 40, Course.DifficultyLevel.BEGINNER),
                    
                    createCourse("Stock Market Investment for Beginners", 
                        "Start your investment journey with fundamental and technical analysis of stock markets",
                        "Complete guide to stock market investing for beginners",
                        new BigDecimal("3999"), new BigDecimal("2499"), investment, instructor, 35, Course.DifficultyLevel.BEGINNER),
                    
                    createCourse("Advanced Trading Strategies", 
                        "Learn advanced trading techniques, options, futures, and derivatives",
                        "Advanced course for experienced traders",
                        new BigDecimal("5999"), new BigDecimal("3999"), investment, instructor, 50, Course.DifficultyLevel.ADVANCED),
                    
                    createCourse("Insurance Planning Made Easy", 
                        "Complete guide to life, health, and general insurance planning",
                        "Understand different types of insurance and choose the right coverage",
                        new BigDecimal("1999"), new BigDecimal("1299"), insurance, instructor, 25, Course.DifficultyLevel.BEGINNER),
                    
                    createCourse("Mutual Fund Investment Strategies", 
                        "Learn to select and invest in mutual funds for long-term wealth creation",
                        "Comprehensive guide to mutual fund investing",
                        new BigDecimal("2499"), new BigDecimal("1699"), investment, instructor, 30, Course.DifficultyLevel.INTERMEDIATE)
                );

                courseRepository.saveAll(courses);
                logger.info("Courses initialized successfully!");
            }
        }
    }

    private void initializeItems() {
        if (itemRepository.count() == 0) {
            logger.info("Initializing items...");

            User admin = userRepository.findByEmail("admin@finwise.com").orElse(null);

            if (admin != null) {
                List<Item> items = Arrays.asList(
                    createItem("Financial Planning Consultation", 
                        "One-on-one financial planning session with certified financial planner", 
                        new BigDecimal("5000"), admin),
                    
                    createItem("Tax Filing Service", 
                        "Complete income tax return filing service with expert guidance", 
                        new BigDecimal("2500"), admin),
                    
                    createItem("Investment Portfolio Review", 
                        "Comprehensive review and analysis of your investment portfolio", 
                        new BigDecimal("3500"), admin),
                    
                    createItem("Insurance Policy Analysis", 
                        "Detailed analysis of your existing insurance policies", 
                        new BigDecimal("2000"), admin),
                    
                    createItem("Retirement Planning Package", 
                        "Complete retirement planning with goal setting and investment strategies", 
                        new BigDecimal("7500"), admin)
                );

                itemRepository.saveAll(items);
                logger.info("Items initialized successfully!");
            }
        }
    }

    private void initializeInvestmentProducts() {
        if (investmentProductRepository.count() == 0) {
            logger.info("Initializing investment products...");

            List<InvestmentProduct> products = Arrays.asList(
                createInvestmentProduct("SBI Large Cap Fund", 
                    "A diversified equity mutual fund investing in large-cap stocks",
                    InvestmentProduct.ProductType.MUTUAL_FUND, InvestmentProduct.RiskLevel.MODERATE,
                    new BigDecimal("12.5"), new BigDecimal("500"), new BigDecimal("1000000"), 0, "SBI Mutual Fund"),
                
                createInvestmentProduct("HDFC Balanced Advantage Fund", 
                    "Dynamic asset allocation fund balancing equity and debt",
                    InvestmentProduct.ProductType.MUTUAL_FUND, InvestmentProduct.RiskLevel.MODERATE,
                    new BigDecimal("10.8"), new BigDecimal("1000"), new BigDecimal("5000000"), 0, "HDFC Mutual Fund"),
                
                createInvestmentProduct("Fixed Deposit - 1 Year", 
                    "Bank fixed deposit with guaranteed returns",
                    InvestmentProduct.ProductType.FD, InvestmentProduct.RiskLevel.LOW,
                    new BigDecimal("6.5"), new BigDecimal("10000"), new BigDecimal("10000000"), 12, "Various Banks"),
                
                createInvestmentProduct("PPF (Public Provident Fund)", 
                    "Government-backed long-term savings scheme with tax benefits",
                    InvestmentProduct.ProductType.SIP, InvestmentProduct.RiskLevel.LOW,
                    new BigDecimal("7.1"), new BigDecimal("500"), new BigDecimal("150000"), 180, "Government of India"),
                
                createInvestmentProduct("Gold ETF", 
                    "Exchange-traded fund tracking gold prices",
                    InvestmentProduct.ProductType.GOLD, InvestmentProduct.RiskLevel.MODERATE,
                    new BigDecimal("8.0"), new BigDecimal("1000"), new BigDecimal("5000000"), 0, "Various Fund Houses"),
                
                createInvestmentProduct("NIFTY 50 Index Fund", 
                    "Passive fund tracking NIFTY 50 index",
                    InvestmentProduct.ProductType.ETF, InvestmentProduct.RiskLevel.HIGH,
                    new BigDecimal("11.2"), new BigDecimal("500"), new BigDecimal("10000000"), 0, "Various Fund Houses")
            );

            investmentProductRepository.saveAll(products);
            logger.info("Investment products initialized successfully!");
        }
    }

    private Category createCategory(String name, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        category.setIsActive(true);
        return category;
    }

    private Course createCourse(String title, String description, String shortDescription, 
                               BigDecimal price, BigDecimal discountPrice, Category category, 
                               User instructor, Integer duration, Course.DifficultyLevel difficulty) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setShortDescription(shortDescription);
        course.setPrice(price);
        course.setDiscountPrice(discountPrice);
        course.setCategory(category);
        course.setInstructor(instructor);
        course.setDurationHours(duration);
        course.setDifficultyLevel(difficulty);
        course.setIsPublished(true);
        course.setImageUrl("https://example.com/images/course-" + title.toLowerCase().replace(" ", "-") + ".jpg");
        return course;
    }

    private Item createItem(String name, String description, BigDecimal price, User createdBy) {
        Item item = new Item();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setCreatedBy(createdBy);
        return item;
    }

    private InvestmentProduct createInvestmentProduct(String name, String description, 
                                                     InvestmentProduct.ProductType type, 
                                                     InvestmentProduct.RiskLevel riskLevel,
                                                     BigDecimal returnRate, BigDecimal minInvestment, 
                                                     BigDecimal maxInvestment, Integer lockInPeriod, 
                                                     String provider) {
        InvestmentProduct product = new InvestmentProduct();
        product.setName(name);
        product.setDescription(description);
        product.setProductType(type);
        product.setRiskLevel(riskLevel);
        product.setExpectedReturnRate(returnRate);
        product.setMinimumInvestment(minInvestment);
        product.setMaximumInvestment(maxInvestment);
        product.setLockInPeriodMonths(lockInPeriod);
        product.setProviderName(provider);
        product.setIsActive(true);
        return product;
    }
}
