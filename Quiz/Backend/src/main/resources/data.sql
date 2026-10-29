-- Initial Sample Data for Online Quiz System
-- EC4307 Project

-- Insert Quizzes
INSERT IGNORE INTO quizzes (id, title, description, category, category_label, time_limit, difficulty) VALUES
(1, 'Web Development Basics', 'Test your foundational knowledge on HTML5, CSS3, and JavaScript modern syntax.', 'web', 'Web Dev', 5, 'Easy'),
(2, 'Java & Object-Oriented Programming', 'Master classes, inheritance, polymorphism, encapsulation, and Java 17 features.', 'java', 'Java / OOP', 7, 'Medium'),
(3, 'Database & SQL Fundamentals', 'Assess relational database schemas, JOINs, primary/foreign keys, and JPA concepts.', 'db', 'Database', 6, 'Medium'),
(4, 'Data Structures & Algorithms', 'Master time complexity, binary search trees, stacks, queues, and graph traversal algorithms.', 'dsa', 'DSA', 8, 'Hard'),
(5, 'Software Architecture & Design Patterns', 'Explore creational, structural, and behavioral design patterns and clean architectural principles.', 'se', 'Architecture', 6, 'Medium'),
(6, 'Computer Networks & Cyber Security', 'Assess OSI model protocols, TCP/IP handshakes, TLS/SSL cryptography, and network defense.', 'network', 'Networking', 7, 'Medium'),
(7, 'Cloud Computing & Distributed Systems', 'Analyze IaaS/PaaS architecture, containerization, microservices communication, and CAP theorem.', 'cloud', 'Cloud / DevOps', 7, 'Medium'),
(8, 'Artificial Intelligence & Machine Learning', 'Test foundational neural networks, supervised vs unsupervised learning, loss functions, and NLP.', 'ai', 'AI / ML', 8, 'Hard');

-- Insert Questions for Quiz 1 (Web Development)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(101, 1, 'What does HTML stand for in modern web technology?', 'Hyper Tool Modern Language', 'HyperText Markup Language', 'High Texture Machine Language', 'Hyperlink Transfer Mark Logic', 'B', 'HTML stands for HyperText Markup Language, the standard markup language for documents designed to be displayed in a web browser.'),
(102, 1, 'Which CSS property is used to create space INSIDE the border of an element?', 'margin', 'border-spacing', 'padding', 'outline', 'C', 'The padding property sets the inner space between the element content and its border.'),
(103, 1, 'Which JavaScript method is used to make asynchronous HTTP requests to a REST API?', 'fetch()', 'http.get()', 'request.send()', 'asyncCall()', 'A', 'The fetch() API provides a modern JavaScript interface for accessing and manipulating HTTP pipeline requests and responses.'),
(104, 1, 'Which HTTP method is typically used to retrieve data from a RESTful API?', 'POST', 'PUT', 'DELETE', 'GET', 'D', 'GET requests are safe and idempotent methods used in REST to fetch/retrieve resources from a server.');

-- Insert Questions for Quiz 2 (Java & OOP)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(201, 2, 'Which principle of OOP is demonstrated by hiding internal implementation details and exposing only public methods?', 'Inheritance', 'Encapsulation', 'Polymorphism', 'Abstraction', 'B', 'Encapsulation is the bundling of data with the methods that operate on that data, restricting direct access to some components.'),
(202, 2, 'What is the default port for a Spring Boot web application embedded Tomcat server?', '3000', '8000', '8080', '5000', 'C', 'Spring Boot starts embedded Tomcat server on port 8080 by default.'),
(203, 2, 'Which Spring annotation is used to create a RESTful web controller that returns JSON directly?', '@Controller', '@RestController', '@Service', '@Component', 'B', '@RestController is a convenience annotation that combines @Controller and @ResponseBody, serializing return values directly to JSON.');

-- Insert Questions for Quiz 3 (Database & SQL)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(301, 3, 'Which SQL command is used to retrieve data from a database table?', 'EXTRACT', 'GET', 'SELECT', 'PULL', 'C', 'The SELECT statement is used to select and query data from a database.'),
(302, 3, 'Which key uniquely identifies each record in a relational database table?', 'Foreign Key', 'Composite Key', 'Primary Key', 'Index Key', 'C', 'A Primary Key column or set of columns uniquely identifies every single row in a table.');

-- Insert Questions for Quiz 4 (DSA)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(401, 4, 'What is the worst-case time complexity of searching an element in a balanced Binary Search Tree (AVL tree)?', 'O(1)', 'O(n)', 'O(log n)', 'O(n log n)', 'C', 'In a height-balanced BST such as an AVL tree, the height is guaranteed to be O(log n), so search, insertion, and deletion are all O(log n).'),
(402, 4, 'Which data structure follows the Last-In, First-Out (LIFO) operational principle?', 'Queue', 'Stack', 'Linked List', 'Priority Queue', 'B', 'A Stack follows the Last-In, First-Out (LIFO) order where the most recently added element is removed first.'),
(403, 4, 'Which algorithmic paradigm does Dijkstra shortest path algorithm utilize?', 'Greedy Approach', 'Divide and Conquer', 'Dynamic Programming', 'Backtracking', 'A', 'Dijkstra algorithm uses a greedy approach, repeatedly choosing the vertex with minimum tentative distance.'),
(404, 4, 'What is the space complexity of an in-place QuickSort algorithm in the average case?', 'O(1)', 'O(log n)', 'O(n)', 'O(n^2)', 'B', 'In-place QuickSort requires O(log n) auxiliary stack space for recursive function call frames in the average case.');

-- Insert Questions for Quiz 5 (Software Architecture)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(501, 5, 'Which Gang of Four (GoF) design pattern ensures a class has only a single instance and provides a global access point?', 'Factory Method', 'Singleton', 'Observer', 'Prototype', 'B', 'The Singleton pattern restricts the instantiation of a class to one single instance and provides a global access point to it.'),
(502, 5, 'In the Model-View-Controller (MVC) architectural pattern, which component handles user interaction and updates the model?', 'Model', 'View', 'Controller', 'Router', 'C', 'The Controller interprets user input, invokes updates on the Model, and determines which View should be rendered.'),
(503, 5, 'Which design pattern defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically?', 'Strategy', 'Decorator', 'Observer', 'Adapter', 'C', 'The Observer pattern defines a subscription mechanism to notify multiple objects about events that happen to the subject they are observing.');

-- Insert Questions for Quiz 6 (Computer Networks & Cyber Security)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(601, 6, 'Which standard layer of the 7-layer OSI model does the TCP protocol operate on?', 'Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'Data Link Layer (Layer 2)', 'Session Layer (Layer 5)', 'B', 'The Transmission Control Protocol (TCP) is a core protocol of the Transport Layer (Layer 4) in the OSI model.'),
(602, 6, 'What is the standard default port number used by HTTPS for secure encrypted web traffic?', '80', '8080', '443', '22', 'C', 'HTTPS communications are encrypted using Transport Layer Security (TLS/SSL) and default to port 443.'),
(603, 6, 'Which of the following is an asymmetric public-key cryptography algorithm?', 'AES-256', 'DES', 'RSA', 'Blowfish', 'C', 'RSA is an asymmetric cryptographic algorithm that uses a key pair (public key and private key), unlike symmetric ciphers like AES.');

-- Insert Questions for Quiz 7 (Cloud Computing & Distributed Systems)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(701, 7, 'Which cloud service model provides virtualized computing infrastructure where users manage the OS and application runtime?', 'SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'IaaS (Infrastructure as a Service)', 'FaaS (Function as a Service)', 'C', 'IaaS provides raw infrastructure such as AWS EC2 or Google Compute Engine where users install and configure the OS and application runtime.'),
(702, 7, 'What is the primary role of a container orchestration system like Kubernetes?', 'Compiling source code into container binaries', 'Automating deployment, scaling, load balancing, and health management of containers', 'Providing a physical hardware hypervisor', 'Directly writing database tables to disk', 'B', 'Kubernetes automates the deployment, scaling, networking, and self-healing of containerized workloads across server clusters.'),
(703, 7, 'According to the CAP Theorem for distributed systems, what can a distributed data store NOT guarantee simultaneously?', 'Consistency, Availability, and Partition Tolerance', 'Concurrency, Atomicity, and Performance', 'Caching, Authentication, and Persistence', 'Capacity, Agility, and Portability', 'A', 'The CAP theorem states that a distributed data store can simultaneously provide at most two of the three guarantees: Consistency, Availability, and Partition tolerance.'),
(704, 7, 'In microservices architecture, which pattern prevents cascading failures by stopping calls to a failing service?', 'Circuit Breaker', 'Service Registry', 'API Gateway', 'Saga Pattern', 'A', 'The Circuit Breaker pattern detects failures and encapsulates the logic of preventing a failure from constantly recurring during maintenance or downtime.');

-- Insert Questions for Quiz 8 (AI & Machine Learning)
INSERT IGNORE INTO questions (id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES
(801, 8, 'Which machine learning paradigm trains models using labeled input-output pairs?', 'Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Self-Supervised Clustering', 'B', 'Supervised Learning algorithms learn a mapping function from input variables to an output variable using labeled training datasets.'),
(802, 8, 'What is the primary purpose of Dropout in deep neural network architectures?', 'Accelerating GPU memory transfer', 'Preventing overfitting by randomly deactivating neurons during training', 'Normalizing input pixel intensities', 'Converting weights to integer precision', 'B', 'Dropout is a regularization technique that randomly drops out units during training to prevent co-adaptation of features and reduce overfitting.'),
(803, 8, 'Which neural network architecture introduced the Self-Attention mechanism, forming the foundation of modern Large Language Models?', 'Convolutional Neural Networks (CNN)', 'Recurrent Neural Networks (RNN)', 'Transformer Architecture', 'Generative Adversarial Networks (GAN)', 'C', 'The Transformer architecture (Vaswani et al., 2017) introduced multi-head self-attention, replacing recurrent networks for NLP and vision models.'),
(804, 8, 'When evaluating a classification model on an imbalanced dataset, which metric is preferred over standard Accuracy?', 'F1-Score / PR-AUC', 'Mean Squared Error (MSE)', 'R-Squared Score', 'Raw Training Loss', 'A', 'In imbalanced datasets, Accuracy can be misleadingly high; F1-score (harmonic mean of Precision and Recall) and PR-AUC provide a truthful measure of performance.');

-- Insert Sample Submissions
INSERT IGNORE INTO quiz_results (id, student_name, student_id, quiz_id, quiz_title, score, total_questions, percentage, time_taken_seconds, attempted_at) VALUES
(1, 'Kamal Perera', 'EG/2021/1001', 1, 'Web Development Basics', 4, 4, 100, 145, CURRENT_TIMESTAMP),
(2, 'Nimal Silva', 'EG/2021/1042', 2, 'Java & Object-Oriented Programming', 2, 3, 67, 210, CURRENT_TIMESTAMP),
(3, 'Kasun Wickramasinghe', 'EG/2021/1090', 3, 'Database & SQL Fundamentals', 2, 2, 100, 115, CURRENT_TIMESTAMP);
