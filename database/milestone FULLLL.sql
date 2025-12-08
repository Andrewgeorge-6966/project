 CREATE DATABASE IF NOT EXISTS HR;
USE HR;
DROP DATABASE IF EXISTS HR;
CREATE DATABASE HR;
USE HR;


CREATE TABLE UNIVERSITY (
    University_ID INT AUTO_INCREMENT PRIMARY KEY,
    University_Name VARCHAR(200) NOT NULL,
    Acronym VARCHAR(50),
    Established_Year YEAR,
    Accreditation_Body VARCHAR(200),
    Address VARCHAR(300),
    Contact_Email VARCHAR(150),
    Website_URL VARCHAR(200)
);

-- 2. FACULTY
CREATE TABLE FACULTY (
    Faculty_ID INT AUTO_INCREMENT PRIMARY KEY,
    Faculty_Name VARCHAR(200) NOT NULL,
    Location VARCHAR(200),
    Contact_Email VARCHAR(100),
    University_ID INT,
    FOREIGN KEY (University_ID) REFERENCES UNIVERSITY(University_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 3. DEPARTMENT
CREATE TABLE DEPARTMENT (
    Department_ID INT AUTO_INCREMENT PRIMARY KEY,
    Department_Name VARCHAR(200) NOT NULL,
    Department_Type ENUM('Academic','Administrative') NOT NULL,
    Location VARCHAR(200),
    Contact_Email VARCHAR(100),
    Faculty_ID INT,
    FOREIGN KEY (Faculty_ID) REFERENCES FACULTY(Faculty_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 4. ACADEMIC_DEPARTMENT
CREATE TABLE ACADEMIC_DEPARTMENT (
    Department_ID INT,
    Faculty_ID INT,
    PRIMARY KEY (Department_ID, Faculty_ID),
    FOREIGN KEY (Department_ID) REFERENCES DEPARTMENT(Department_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (Faculty_ID) REFERENCES FACULTY(Faculty_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 5. ADMINISTRATIVE_DEPARTMENT
CREATE TABLE ADMINISTRATIVE_DEPARTMENT (
    Department_ID INT PRIMARY KEY,
    University_ID INT,
    FOREIGN KEY (Department_ID) REFERENCES DEPARTMENT(Department_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (University_ID) REFERENCES UNIVERSITY(University_ID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE CONTRACT (
    Contract_ID INT PRIMARY KEY AUTO_INCREMENT,
    Contract_Name VARCHAR(200) NOT NULL,
    Type VARCHAR(50) NOT NULL,        
    Description TEXT,
    Default_Duration INT,              
    Work_Modality VARCHAR(50),         
    Eligibility_Criteria TEXT,
    CHECK (Default_Duration >= 0)
);
CREATE TABLE JOB (
    Job_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_Code VARCHAR(50) UNIQUE,
    Job_Title VARCHAR(200) NOT NULL,
    Job_Level VARCHAR(50),            
    Job_Category VARCHAR(100),
    Job_Grade VARCHAR(50),
    Min_Salary DECIMAL(10,2),
    Max_Salary DECIMAL(10,2),
    Job_Description TEXT,
    Status VARCHAR(30),
    Department_ID INT,                 
    Reports_To INT,                 
    FOREIGN KEY (Reports_To) REFERENCES JOB(Job_ID) ON DELETE SET NULL,
    CHECK (Min_Salary >= 0 AND Max_Salary >= Min_Salary)
);

CREATE TABLE JOB_OBJECTIVE (
    Objective_ID INT PRIMARY KEY AUTO_INCREMENT,
    Job_ID INT NOT NULL,
    Objective_Title VARCHAR(250) NOT NULL,
    Description TEXT,
    Weight DECIMAL(5,2),
    Salary DECIMAL(5,2),
    FOREIGN KEY (Job_ID) REFERENCES JOB(Job_ID) ON DELETE CASCADE,
    CHECK (Weight >= 0 AND Weight <= 100)
);
CREATE TABLE OBJECTIVE_KPI (
    KPI_ID INT PRIMARY KEY AUTO_INCREMENT,
    Objective_ID INT NOT NULL,
    KPI_Name VARCHAR(200) NOT NULL,
    Description TEXT,
    Measurement_Unit VARCHAR(50),
    Target_Value VARCHAR(100),
    Weight DECIMAL(5,2),
    FOREIGN KEY (Objective_ID) REFERENCES JOB_OBJECTIVE(Objective_ID) ON DELETE CASCADE,
    CHECK (Weight >= 0 AND Weight <= 100)
);
CREATE TABLE EMPLOYEE (
  Employee_ID INT PRIMARY KEY AUTO_INCREMENT,
  First_Name VARCHAR(100) NOT NULL,
  Middle_Name VARCHAR(100),
  Last_Name VARCHAR(100) NOT NULL,
  Arabic_Name VARCHAR(200),
  Gender VARCHAR(12),
  Nationality VARCHAR(100),
  DOB DATE,
  Place_of_Birth VARCHAR(150),
  Marital_Status VARCHAR(20),
  Religion VARCHAR(50),
  Employment_Status VARCHAR(30),
  Mobile_Phone VARCHAR(30),
  Work_Phone VARCHAR(30),
  Work_Email VARCHAR(150),
  Personal_Email VARCHAR(150),
  Emergency_Contact_Name VARCHAR(150),
  Emergency_Contact_Phone VARCHAR(30),
  Emergency_Contact_Relationship VARCHAR(50),
  Residential_City VARCHAR(100),
  Residential_Area VARCHAR(100),
  Residential_Street VARCHAR(200),
  Residential_Country VARCHAR(100),
  Permanent_City VARCHAR(100),
  Permanent_Area VARCHAR(100),
  Permanent_Street VARCHAR(200),
  Permanent_Country VARCHAR(100),
  Medical_Clearance_Status VARCHAR(30),
  Criminal_Status VARCHAR(30),
  CHECK (Gender IN ('Male','Female','Other') OR Gender IS NULL),
  CHECK (Employment_Status IN ('Active','Probation','Leave','Resigned','Retired') OR Employment_Status IS NULL),
  CHECK (Marital_Status IN ('Single','Married','Divorced','Widowed') OR Marital_Status IS NULL)
);

-- EMPLOYEE_DISABILITY
CREATE TABLE EMPLOYEE_DISABILITY (
  Employee_ID INT,
  Disability_Type VARCHAR(200),
  Severity_Level VARCHAR(50),
  Required_Support VARCHAR(50),
  PRIMARY KEY (Employee_ID, Disability_Type),
  FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE CASCADE
);

-- SOCIAL_INSURANCE
CREATE TABLE SOCIAL_INSURANCE (
  Insurance_ID INT PRIMARY KEY AUTO_INCREMENT,
  Employee_ID INT,
  Insurance_Number VARCHAR(100),
  Coverage_Details TEXT,
  Start_Date DATE,
  End_Date DATE,
  status VARCHAR(30),
  FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE CASCADE,
  CHECK (Start_Date IS NULL OR End_Date IS NULL OR Start_Date <= End_Date)
);

-- EDUCATIONAL_QUALIFICATION
CREATE TABLE EDUCATIONAL_QUALIFICATION (
  Qualification_ID INT PRIMARY KEY AUTO_INCREMENT,
  Employee_ID INT,
  Institution_Name VARCHAR(100),
  Major VARCHAR(50),
  Degree_Type VARCHAR(50),
  FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE CASCADE
);

-- PROFESSIONAL_CERTIFICATE
CREATE TABLE PROFESSIONAL_CERTIFICATE (
  Certificate_ID INT PRIMARY KEY AUTO_INCREMENT,
  Employee_ID INT,
  Certification_Name VARCHAR(100),
  Issuing_Organization VARCHAR(100),
  Issue_Date DATE,
  Expiry_Date DATE,
  Credential_ID VARCHAR(200),
  FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE CASCADE,
  CHECK (Issue_Date IS NULL OR Expiry_Date IS NULL OR Issue_Date <= Expiry_Date)
);

-- PERFORMANCE_CYCLE
CREATE TABLE PERFORMANCE_CYCLE (
  Cycle_ID INT PRIMARY KEY AUTO_INCREMENT,
  Cycle_Name VARCHAR(100),
  Cycle_Type VARCHAR(100),
  Start_Date DATE,
  End_Date DATE,
  Submission_Deadline DATE,
  CHECK (Start_Date IS NULL OR End_Date IS NULL OR Start_Date <= End_Date)
);

-- EMPLOYEE_TRAINING


 CREATE TABLE JOB_ASSIGNMENT(
  Assignment_ID INT PRIMARY KEY AUTO_INCREMENT,
  Employee_ID INT,
  Job_ID INT,
  Contract_ID INT,
  Start_Date DATE,
  End_Date DATE,
  Status VARCHAR(30),
  Assigned_Salary DECIMAL(12,2),
  FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE SET NULL,
  FOREIGN KEY (Job_ID) REFERENCES JOB(Job_ID) ON DELETE SET NULL,
  FOREIGN KEY (Contract_ID) REFERENCES CONTRACT(Contract_ID) ON DELETE SET NULL,
  CHECK (Start_Date IS NULL OR End_Date IS NULL OR Start_Date <= End_Date),
  CHECK (Assigned_Salary IS NULL OR Assigned_Salary >= 0)
);

CREATE TABLE EMPLOYEE_KPI_SCORE (
  Score_ID INT PRIMARY KEY AUTO_INCREMENT,
  Assignment_ID INT,
  KPI_ID INT,
  Performance_Cycle_ID INT,
  Actual_Value VARCHAR(100),
  Employee_Score DECIMAL(5,2),
  Weighted_Score DECIMAL(6,2),
  Reviewer_ID INT,
  Comments TEXT,
  Review_Date DATE,
  FOREIGN KEY (Assignment_ID) REFERENCES JOB_ASSIGNMENT(Assignment_ID) ON DELETE CASCADE,
  FOREIGN KEY (KPI_ID) REFERENCES OBJECTIVE_KPI(KPI_ID) ON DELETE CASCADE,
  FOREIGN KEY (Performance_Cycle_ID) REFERENCES PERFORMANCE_CYCLE(Cycle_ID) ON DELETE CASCADE,
  FOREIGN KEY (Reviewer_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE SET NULL,
  CHECK (Employee_Score BETWEEN 0 AND 100 OR Employee_Score IS NULL),
  CHECK (Weighted_Score BETWEEN 0 AND 100 OR Weighted_Score IS NULL)
);

CREATE TABLE APPRAISAL (
  Appraisal_ID INT PRIMARY KEY AUTO_INCREMENT,
  Assignment_ID INT,
  Cycle_ID INT,
  Appraisal_Date DATE,
  Overall_Score DECIMAL(5,2),
  Manager_Comments TEXT,
  HR_Comments TEXT,
  Employee_Comments TEXT,
  Reviewer_ID INT,
  FOREIGN KEY (Assignment_ID) REFERENCES JOB_ASSIGNMENT(Assignment_ID) ON DELETE CASCADE,
  FOREIGN KEY (Cycle_ID) REFERENCES PERFORMANCE_CYCLE(Cycle_ID) ON DELETE SET NULL,
  FOREIGN KEY (Reviewer_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE SET NULL,
  CHECK (Overall_Score BETWEEN 0 AND 100 OR Overall_Score IS NULL)
);
CREATE TABLE APPEAL (
  Appeal_ID INT PRIMARY KEY AUTO_INCREMENT,
  Appraisal_ID INT,
  Submission_Date DATE,
  Reason TEXT,
  Original_Score DECIMAL(5,2),
  Approval_Status VARCHAR(30),
  appeal_outcome_Score DECIMAL(5,2),
  FOREIGN KEY (Appraisal_ID) REFERENCES APPRAISAL(Appraisal_ID) ON DELETE CASCADE,
  CHECK (Approval_Status IN ('Pending','Approved','Rejected') OR Approval_Status IS NULL)
);

CREATE TABLE TRAINING_PROGRAM (
  Program_ID INT PRIMARY KEY AUTO_INCREMENT,
  Program_Code VARCHAR(50),
  Title VARCHAR(250),
  Objectives TEXT,
  Type VARCHAR(100),
  Subtype VARCHAR(100),
  Delivery_Method VARCHAR(100),
  Approval_Status VARCHAR(30),
  CHECK (Approval_Status IN ('Pending','Approved','Rejected') OR Approval_Status IS NULL)
);
CREATE TABLE EMPLOYEE_TRAINING (
  ET_ID INT PRIMARY KEY AUTO_INCREMENT,
  Employee_ID INT,
  Program_ID INT,
  Completion_Status VARCHAR(20),
  FOREIGN KEY (Employee_ID) REFERENCES EMPLOYEE(Employee_ID) ON DELETE CASCADE,
  FOREIGN KEY (Program_ID) REFERENCES TRAINING_PROGRAM(Program_ID) ON DELETE CASCADE
);
CREATE TABLE TRAINING_CERTIFICATE (
  Training_Certificate_ID INT PRIMARY KEY AUTO_INCREMENT,
  ET_ID INT,
  Issue_Date DATE,
  certificate_file_path VARCHAR(300),
  FOREIGN KEY (ET_ID) REFERENCES EMPLOYEE_TRAINING(ET_ID) ON DELETE CASCADE
);
INSERT INTO UNIVERSITY
  (University_Name, Acronym, Established_Year, Accreditation_Body, Address, Contact_Email, Website_URL)
VALUES
  ('Cairo University', 'CU', 1908, 'NAQAAE', 'Gamaa Street, Giza, Giza Governorate, Egypt', 'contact@cu.edu.eg', 'https://cu.edu.eg'),
  ('Ain Shams University', 'ASU', 1950, 'NAQAAE', 'Abbasiya, Cairo Governorate, Egypt', 'info@asu.edu.eg', 'https://ain‑shams.edu.eg'),
  ('Alexandria University', 'AU', 1938, 'NAQAAE', 'ElShatby, Alexandria Governorate, Egypt', 'info@alexu.edu.eg', 'https://alexu.edu.eg'),
  ('German University in Cairo', 'GUC', 2002, 'NAQAAE', 'Main Entrance ElTagamoa ElKhames, New Cairo City, Cairo Governorate, Egypt', 'info@guc.edu.eg', 'https://guc.edu.eg'),
  ('Mansoura University', 'MU', 1972, 'NAQAAE', 'Mansoura, Dakahlia Governorate, Egypt', 'info@mans.edu.eg', 'https://mans.edu.eg'),
  ('Helwan University', 'HU', 1975, 'NAQAAE', 'Helwan, Cairo Governorate, Egypt', 'info@helwan.edu.eg', 'https://helwan.edu.eg');


-- FACULTY (3) referencing Universities 1..6
INSERT INTO FACULTY (Faculty_Name, Location, Contact_Email, University_ID) VALUES
-- Cairo University (ID = 1)
('Faculty of Science','Main Campus','science@cu.edu.eg',1),
('Administration','CU Admin Building','admin@cu.edu.eg',1),

-- Ain Shams University (ID = 2)
('Faculty of Business','ASU Campus','business@asu.edu.eg',2),
('Administration','ASU Admin Building','admin@asu.edu.eg',2),

-- Alexandria University (ID = 3)
('Faculty of Science','Alexandria Campus','science@alexu.edu.eg',3),
('Administration','Alexandria Admin Building','admin@alexu.edu.eg',3),

-- German University in Cairo (ID = 4)
('Faculty of IT','GUC Campus','it@guc.edu.eg',4),
('Administration','GUC Admin Building','admin@guc.edu.eg',4),

-- Mansoura University (ID = 5)
('Faculty of Engineering','Mansoura Campus','eng@mcu.edu.eg',5),
('Administration','Mansoura Admin Building','admin@mcu.edu.eg',5),

-- Helwan University (ID = 6)
('Faculty of Media','Helwan Campus','media@helwan.edu.eg',6),
('Administration','Helwan Admin Building','admin@helwan.edu.eg',6);


-- DEPARTMENTS for all six universities

-- Cairo University (Faculties: 1 = Science, 2 = Administration)
INSERT INTO DEPARTMENT (Department_Name, Department_Type, Location, Contact_Email, Faculty_ID) VALUES
-- Cairo University
('Computer Science','Academic','Building 1, CU Campus','cs@cu.edu.eg',1),
('Human Resources','Administrative','Admin Block, CU Campus','hr@cu.edu.eg',2),

-- Ain Shams University
('Business Administration','Academic','Faculty of Business, ASU Campus','bus@asu.edu.eg',3),
('Finance','Administrative','Finance Office, ASU Campus','finance@asu.edu.eg',4),

-- Alexandria University
('Marketing','Academic','Building 4, Alexandria University','marketing@alexu.edu.eg',5),
('Quality Assurance','Administrative','QA Office, Alexandria University','qa@alexu.edu.eg',6),

-- German University in Cairo
('Information Technology','Academic','IT Building, GUC','it@guc.edu.eg',7),
('Corporate Services','Administrative','Corporate Services Block, GUC','services@guc.edu.eg',8),

-- Mansoura University
('Mechanical Engineering','Academic','Engg Building, Mansoura University','me@mcu.edu.eg',9),
('Administration & Planning','Administrative','Admin Block, Mansoura University','admin@mcu.edu.eg',10),

-- Helwan University
('Media & Communication','Academic','Media Building, Helwan University','media@helwan.edu.eg',11),
('Student Affairs','Administrative','Student Affairs Office, Helwan University','student.affairs@helwan.edu.eg',12);

INSERT INTO CONTRACT (Contract_Name, Type, Description, Default_Duration, Work_Modality, Eligibility_Criteria) VALUES
('Permanent Full-Time', 'Full-Time', 'Standard permanent employment', 0, 'Onsite', 'Pass selection and probation'),
('Fixed-Term 12m', 'Fixed-Term', 'One-year contract', 12, 'Onsite', 'Approved by department head'),
('Part-Time 20h', 'Part-Time', '20 hours per week', 0, 'Hybrid', 'Manager approval'),
('Temp 6m', 'Fixed-Term', 'Six-month temporary contract', 6, 'Onsite', 'Project need'),
('Remote Consultant', 'Contractor', 'Short-term remote consultancy', 3, 'Remote', 'Contract signed');

INSERT INTO JOB (Job_Code, Job_Title, Job_Level, Job_Category, Job_Grade, Min_Salary, Max_Salary, Job_Description, Status, Department_ID, Reports_To) VALUES
('CS-DEV-JR', 'Software Developer (Junior)', 'Entry', 'Technical', 'G1', 6000, 9000, 'Develop and test software modules', 'Open', 1, NULL),
('CS-DEV-SR', 'Software Developer (Senior)', 'Senior', 'Technical', 'G3', 18000, 30000, 'Lead development and software architecture', 'Open', 1, NULL),
('HR-COORD', 'HR Coordinator', 'Mid', 'HR', 'G2', 9000, 15000, 'Manage recruitment and employee records', 'Open', 2, NULL),
('QA-ENGINEER', 'QA Engineer', 'Entry', 'Quality', 'G2', 8000, 12000, 'Prepare and run test cases', 'Open', 5, NULL),
('MKT-EXEC', 'Marketing Executive', 'Entry', 'Marketing', 'G2', 7000, 11000, 'Support marketing campaigns and social media', 'Open', 6, NULL),
('FIN-ANAL', 'Finance Analyst', 'Mid', 'Finance', 'G3', 10000, 18000, 'Manage budgets and financial reports', 'Open', 4, NULL);

-- PERFORMANCE_CYCLE (5)
INSERT INTO PERFORMANCE_CYCLE (Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline) VALUES
('2023 Annual','Annual','2023-01-01','2023-12-31','2024-01-15'),
('2024 Annual','Annual','2024-01-01','2024-12-31','2025-01-15'),
('2024 Mid-Year','Mid','2024-01-01','2024-06-30','2024-07-15'),
('2025 Annual','Annual','2025-01-01','2025-12-31','2026-01-15'),
('2025 Mid-Year','Mid','2025-01-01','2025-06-30','2025-07-15');

-- TRAINING_PROGRAM (6)
INSERT INTO TRAINING_PROGRAM (Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status) VALUES
('TP-GOV-01','Research Methodology','Improve academic research skills','Academic','Course','Onsite','Approved'),
('TP-IT-01','Data Analytics with Python','Introduce data analysis tools','Technical','Course','Online','Approved'),
('TP-HR-01','Talent Acquisition','Best practices in recruitment','HR','Workshop','Onsite','Approved'),
('TP-SOFT-01','Communication Skills','Improve interpersonal skills','Soft','Seminar','Onsite','Approved'),
('TP-SAFE-01','Health & Safety','Workplace safety training','Compliance','Seminar','Onsite','Approved'),
('TP-MKT-01','Digital Marketing','Digital marketing essentials','Technical','Course','Online','Pending');

-- EMPLOYEES (8) — Egyptian realistic names and phones
INSERT INTO EMPLOYEE (First_Name, Middle_Name, Last_Name, Arabic_Name, Gender, Nationality, DOB, Place_of_Birth, Marital_Status, Religion, Employment_Status, Mobile_Phone, Work_Phone, Work_Email, Personal_Email, Emergency_Contact_Name, Emergency_Contact_Phone, Residential_City, Residential_Country) VALUES
('Ahmed','Mohamed','Elsayed','أحمد محمد السيد','Male','Egypt','1990-05-20','Cairo','Single','Muslim','Active','01010000001','0221000001','ahmed.elsayed@cu.edu.eg','ahmed.elsayed@gmail.com','Fatma Elsayed','0111000001','Cairo','Egypt'),
('Sara','Omar','Hassan','سارة عمر حسن','Female','Egypt','1988-03-11','Giza','Married','Muslim','Active','01010000002','0221000002','sara.hassan@asu.edu.eg','sara.hassan@gmail.com','Omar Hassan','0111000002','Giza','Egypt'),
('Youssef','Khaled','Ibrahim','يوسف خالد إبراهيم','Male','Egypt','1985-08-02','Alexandria','Married','Muslim','Active','01010000003','0321000003','youssef.ibrahim@alexu.edu.eg','youssef.ibrahim@gmail.com','Mona Ibrahim','0111000003','Alexandria','Egypt'),
('Mariam','Hassan','Adel','مريم حسن عادل','Female','Egypt','1992-02-10','Cairo','Single','Muslim','Active','01010000004','0221000004','mariam.adel@guc.edu.eg','mariam.adel@gmail.com','Hassan Adel','0111000004','Giza','Egypt'),
('Omar','Saeed','Mostafa','عمر سعيد مصطفى','Male','Egypt','1991-07-15','Cairo','Single','Muslim','Active','01010000005','0221000005','omar.mostafa@mans.edu.eg','omar.mostafa@gmail.com','Samah Mostafa','0111000005','Mansoura','Egypt'),
('Lina','Fawzy','Naguib','لينا فوزي نجيب','Female','Egypt','1994-11-30','Alexandria','Single','Christian','Active','01010000006','0321000006','lina.naguib@alexu.edu.eg','lina.naguib@gmail.com','Hany Naguib','0111000006','Alexandria','Egypt'),
('Khaled','Mahmoud','Farouk','خالد محمود فاروق','Male','Egypt','1989-09-09','Cairo','Married','Muslim','Active','01010000007','0221000007','khaled.farouk@helwan.edu.eg','khaled.farouk@gmail.com','Mona Farouk','0111000007','Cairo','Egypt'),
('Dina','Samir','Galal','دينا سمير جلال','Female','Egypt','1993-06-18','Alexandria','Single','Muslim','Active','01010000008','0321000008','dina.galal@cu.edu.eg','dina.galal@gmail.com','Samir Galal','0111000008','Alexandria','Egypt');


-- ACADEMIC_DEPARTMENT (3)
INSERT INTO ACADEMIC_DEPARTMENT (Department_ID, Faculty_ID) VALUES
(1,2), -- Computer Science -> Faculty of Science (CU)
(3,3), -- Business Admin -> Faculty of Commerce (Mansoura)
(6,1); -- Marketing -> Faculty of Engineering (GUC) (example mapping)

-- ADMINISTRATIVE_DEPARTMENT (3)
INSERT INTO ADMINISTRATIVE_DEPARTMENT (Department_ID, University_ID) VALUES
(2,1), -- HR -> CU
(4,1), -- Finance -> CU
(5,5); -- QA -> Mansoura
-- JOB_OBJECTIVE (6)
INSERT INTO JOB_OBJECTIVE (Job_ID, Objective_Title, Description, Weight, Salary) VALUES
(1,'Deliver Module A','Implement and deliver Module A features',40,0),
(1,'Fix Priority Bugs','Resolve P1/P2 bugs within SLA',30,0),
(2,'Architect Review','Design and review architecture',45,0),
(3,'Hire New Staff','Complete recruitment cycle',40,0),
(4,'Test Coverage','Reach 85% test coverage',50,0),
(6,'Monthly Reports','Prepare monthly finance reports',60,0);

-- OBJECTIVE_KPI (6)
INSERT INTO OBJECTIVE_KPI (Objective_ID, KPI_Name, Description, Measurement_Unit, Target_Value, Weight) VALUES
(1,'Features Delivered','Number of features','count','4',50),
(2,'Bugs Resolved','Bugs fixed per month','count','15',50),
(3,'Architecture Reviews','Reviews completed','count','6',50),
(4,'Test Cases Created','Test cases','count','30',50),
(6,'Reports On Time','Reports delivered','count','12',100),
(5,'Hires Completed','Number of hires','count','5',50);

-- JOB_ASSIGNMENT (8) — use Employee_ID 1..8, Job_ID 1..6, Contract_ID 1..5
INSERT INTO JOB_ASSIGNMENT (Employee_ID, Job_ID, Contract_ID, Start_Date, End_Date, Status, Assigned_Salary) VALUES
(1,1,1,'2019-09-01',NULL,'Active',8000.00),
(2,3,1,'2017-05-20',NULL,'Active',12000.00),
(3,2,2,'2016-03-10',NULL,'Active',22000.00),
(4,4,1,'2021-05-01',NULL,'Active',9000.00),
(5,5,1,'2022-01-10',NULL,'Active',7500.00),
(6,6,4,'2020-02-01',NULL,'Active',13000.00),
(7,1,3,'2018-07-01',NULL,'Active',8500.00),
(8,5,2,'2023-03-15',NULL,'Active',7200.00);

-- EMPLOYEE_DISABILITY (8)
INSERT INTO EMPLOYEE_DISABILITY (Employee_ID, Disability_Type, Severity_Level, Required_Support) VALUES
(1,'None','N/A','N/A'),
(2,'Visual Impairment','Mild','Screen reader software'),
(3,'None','N/A','N/A'),
(4,'None','N/A','N/A'),
(5,'Hearing Impairment','Mild','Hearing aid support'),
(6,'None','N/A','N/A'),
(7,'Mobility Limitation','Moderate','Wheelchair access'),
(8,'None','N/A','N/A');

-- SOCIAL_INSURANCE (8)
INSERT INTO SOCIAL_INSURANCE (Employee_ID, Insurance_Number, Coverage_Details, Start_Date, End_Date, Status) VALUES
(1,'EG-SIN-10001','Full','2019-01-01',NULL,'Active'),
(2,'EG-SIN-10002','Full','2018-02-15',NULL,'Active'),
(3,'EG-SIN-10003','Full','2016-04-10',NULL,'Active'),
(4,'EG-SIN-10004','Full','2021-06-01',NULL,'Active'),
(5,'EG-SIN-10005','Basic','2022-03-20',NULL,'Active'),
(6,'EG-SIN-10006','Full','2020-08-01',NULL,'Active'),
(7,'EG-SIN-10007','Full','2018-09-01',NULL,'Active'),
(8,'EG-SIN-10008','Partial','2023-03-01',NULL,'Active');
-- EDUCATIONAL_QUALIFICATION (8)
INSERT INTO EDUCATIONAL_QUALIFICATION (Employee_ID, Institution_Name, Major, Degree_Type) VALUES
(1,'Cairo University','Computer Science','BSc'),
(2,'Ain Shams University','Business Administration','BBA'),
(3,'Alexandria University','Software Engineering','BSc'),
(4,'German University in Cairo','Biology','BSc'),
(5,'Mansoura University','Marketing','BBA'),
(6,'Alexandria University','Finance','BSc'),
(7,'Helwan University','Computer Science','BSc'),
(8,'Cairo University','Mass Communication','BA');

-- PROFESSIONAL_CERTIFICATE (8)
INSERT INTO PROFESSIONAL_CERTIFICATE (Employee_ID, Certification_Name, Issuing_Organization, Issue_Date, Expiry_Date, Credential_ID) VALUES
(1,'ICDL','Ministry of Communications','2018-05-10',NULL,'ICDL-EG-2018-01'),
(2,'Google Analytics','Google','2019-04-01',NULL,'GA-2019-148'),
(3,'PMP','PMI','2017-09-01','2023-09-01','PMP-EG-55001'),
(4,'TOEFL','ETS','2016-11-11',NULL,'TOEFL-54567'),
(5,'HubSpot Inbound','HubSpot','2022-02-12',NULL,'HS-2022-3332'),
(6,'CFA Level 1','CFA Institute','2017-06-05',NULL,'CFA-EG-1001'),
(7,'AWS Cloud Practitioner','AWS','2020-08-20',NULL,'AWS-CP-2020-77'),
(8,'Digital Marketing','Coursera','2021-03-12',NULL,'DM-COURSE-2021-55');

-- EMPLOYEE_TRAINING (8) referencing Program_ID 1..6
INSERT INTO EMPLOYEE_TRAINING (Employee_ID, Program_ID, Completion_Status) VALUES
(1,1,'Completed'),
(2,3,'Completed'),
(3,2,'Completed'),
(4,4,'Completed'),
(5,5,'In Progress'),
(6,6,'Completed'),
(7,2,'Completed'),
(8,1,'Completed');

-- TRAINING_CERTIFICATE (5) - reference ET_IDs (these will be 1..8)
INSERT INTO TRAINING_CERTIFICATE (ET_ID, Issue_Date, Certificate_File_Path) VALUES
(1,'2023-02-20','/certs/ahmed_research.pdf'),
(3,'2022-10-01','/certs/youssef_data.pdf'),
(4,'2023-08-05','/certs/mariam_communication.pdf'),
(6,'2021-09-12','/certs/khaled_cloud.pdf'),
(7,'2022-05-30','/certs/khaled_data.pdf');

-- EMPLOYEE_KPI_SCORE (8) — refer Assignment_ID 1..8, KPI_ID approx 1..6, Cycle_ID 1..5
INSERT INTO EMPLOYEE_KPI_SCORE 
(Assignment_ID, KPI_ID, Performance_Cycle_ID, Actual_Value, Employee_Score, Weighted_Score, Reviewer_ID, Comments, Review_Date) 
VALUES
(1,1,2,'5',88,44,2,'Meets expectations','2024-12-15'),
(1,2,2,'12',85,42.5,2,'Good bug resolution','2024-12-15'),
(2,5,1,'Met Target',75,30,3,'Recruitment progressing','2023-12-20'),
(3,3,2,'Excellent',92,55.2,1,'Strong leadership','2024-12-15'),
(4,4,3,'32',95,47.5,2,'Excellent test coverage','2024-06-30'),
(5,5,3,'Below Target',70,28,3,'Needs improvement','2024-06-30'),
(6,6,1,'95%',83,49.8,1,'Good reporting accuracy','2023-12-20'),
(7,1,2,'Achieved',80,40,2,'New starter performing well','2024-12-15');


-- APPRAISAL (6)
INSERT INTO APPRAISAL (Assignment_ID, Cycle_ID, Appraisal_Date, Overall_Score, Manager_Comments, HR_Comments, Employee_Comments, Reviewer_ID) VALUES
(1,2,'2024-12-15',88,'Solid work','Validated','Happy',2),
(2,1,'2023-12-20',76,'Needs more hires','OK','Agree',3),
(3,2,'2024-12-15',91,'Exceptional leadership','Validated','Proud',1),
(4,3,'2024-06-30',94,'Excellent','Completed','Pleased',2),
(5,3,'2024-06-30',72,'Below expectation','Review training','Will improve',3),
(6,1,'2023-12-20',80,'Good','OK','Acceptable',1);

-- APPEAL (3)
INSERT INTO APPEAL (Appraisal_ID, Submission_Date, Reason, Original_Score, Approval_Status, Appeal_Outcome_Score) VALUES
(2,'2024-01-05','Dispute on two KPIs',76,'Rejected',76),
(3,'2024-07-10','Calculation error on KPI',91,'Approved',93),
(5,'2024-07-15','Request clarification',72,'Pending',NULL);
USE HR;
SHOW TABLES;


SELECT ja.* 
FROM JOB_ASSIGNMENT ja
LEFT JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
WHERE e.Employee_ID IS NULL;


SELECT ja.* 
FROM JOB_ASSIGNMENT ja
LEFT JOIN JOB j ON ja.Job_ID = j.Job_ID
WHERE j.Job_ID IS NULL;


SELECT ja.* 
FROM JOB_ASSIGNMENT ja
LEFT JOIN CONTRACT c ON ja.Contract_ID = c.Contract_ID
WHERE c.Contract_ID IS NULL;


SELECT ed.* FROM EMPLOYEE_DISABILITY ed
LEFT JOIN EMPLOYEE e ON ed.Employee_ID = e.Employee_ID
WHERE e.Employee_ID IS NULL;


SELECT si.* FROM SOCIAL_INSURANCE si
LEFT JOIN EMPLOYEE e ON si.Employee_ID = e.Employee_ID
WHERE e.Employee_ID IS NULL;


SELECT eq.* FROM EDUCATIONAL_QUALIFICATION eq
LEFT JOIN EMPLOYEE e ON eq.Employee_ID = e.Employee_ID
WHERE e.Employee_ID IS NULL;


SELECT pc.* FROM PROFESSIONAL_CERTIFICATE pc
LEFT JOIN EMPLOYEE e ON pc.Employee_ID = e.Employee_ID
WHERE e.Employee_ID IS NULL;


SELECT et.* FROM EMPLOYEE_TRAINING et
LEFT JOIN EMPLOYEE e ON et.Employee_ID = e.Employee_ID
LEFT JOIN TRAINING_PROGRAM tp ON et.Program_ID = tp.Program_ID
WHERE e.Employee_ID IS NULL OR tp.Program_ID IS NULL;

SELECT tc.* FROM TRAINING_CERTIFICATE tc
LEFT JOIN EMPLOYEE_TRAINING et ON tc.ET_ID = et.ET_ID
WHERE et.ET_ID IS NULL;

SELECT jo.* FROM JOB_OBJECTIVE jo
LEFT JOIN JOB j ON jo.Job_ID = j.Job_ID
WHERE j.Job_ID IS NULL;


SELECT ok.* FROM OBJECTIVE_KPI ok
LEFT JOIN JOB_OBJECTIVE jo ON ok.Objective_ID = jo.Objective_ID
WHERE jo.Objective_ID IS NULL;

SELECT eks.* FROM EMPLOYEE_KPI_SCORE eks
LEFT JOIN JOB_ASSIGNMENT ja ON eks.Assignment_ID = ja.Assignment_ID
LEFT JOIN OBJECTIVE_KPI ok ON eks.KPI_ID = ok.KPI_ID
LEFT JOIN PERFORMANCE_CYCLE pc ON eks.Performance_Cycle_ID = pc.Cycle_ID
WHERE ja.Assignment_ID IS NULL OR ok.KPI_ID IS NULL OR pc.Cycle_ID IS NULL;

SELECT 
  e.Employee_ID,
  CONCAT(e.First_Name,' ',e.Last_Name) AS Employee_Name,
  ja.Assignment_ID,
  j.Job_Code,
  j.Job_Title,
  d.Department_Name,
  ja.Start_Date,
  ja.End_Date,
  ja.Status,
  ja.Assigned_Salary
FROM EMPLOYEE e
JOIN JOB_ASSIGNMENT ja ON e.Employee_ID = ja.Employee_ID
JOIN JOB j ON ja.Job_ID = j.Job_ID
LEFT JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID;

SELECT
  e.Employee_ID,
  CONCAT(e.First_Name,' ',e.Last_Name) AS Employee_Name,
  j.Job_Title,
  jo.Objective_Title,
  ok.KPI_Name,
  eks.Actual_Value,
  eks.Employee_Score,
  pc.Cycle_Name
FROM EMPLOYEE_KPI_SCORE eks
JOIN JOB_ASSIGNMENT ja ON eks.Assignment_ID = ja.Assignment_ID
JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
JOIN OBJECTIVE_KPI ok ON eks.KPI_ID = ok.KPI_ID
JOIN JOB_OBJECTIVE jo ON ok.Objective_ID = jo.Objective_ID
JOIN JOB j ON jo.Job_ID = j.Job_ID
LEFT JOIN PERFORMANCE_CYCLE pc ON eks.Performance_Cycle_ID = pc.Cycle_ID;

SELECT
  e.Employee_ID,
  CONCAT(e.First_Name,' ',e.Last_Name) AS Employee_Name,
  tp.Program_Code,
  tp.Title,
  et.Completion_Status
FROM EMPLOYEE_TRAINING et
JOIN EMPLOYEE e ON et.Employee_ID = e.Employee_ID
JOIN TRAINING_PROGRAM tp ON et.Program_ID = tp.Program_ID;

SELECT
  a.Appraisal_ID,
  e.Employee_ID,
  CONCAT(e.First_Name,' ',e.Last_Name) AS Employee_Name,
  a.Appraisal_Date,
  a.Overall_Score,
  a.Manager_Comments,
  j.Job_Title
FROM APPRAISAL a
JOIN JOB_ASSIGNMENT ja ON a.Assignment_ID = ja.Assignment_ID
JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
LEFT JOIN JOB j ON ja.Job_ID = j.Job_ID;

SELECT d.Department_Name, COUNT(DISTINCT ja.Employee_ID) AS Num_Employees
FROM JOB_ASSIGNMENT ja
JOIN JOB j ON ja.Job_ID = j.Job_ID
JOIN DEPARTMENT d ON j.Department_ID = d.Department_ID
GROUP BY d.Department_Name;

SELECT 'EMPLOYEE' tbl, COUNT(*) cnt FROM EMPLOYEE
UNION ALL SELECT 'JOB', COUNT(*) FROM JOB
UNION ALL SELECT 'CONTRACT', COUNT(*) FROM CONTRACT
UNION ALL SELECT 'JOB_ASSIGNMENT', COUNT(*) FROM JOB_ASSIGNMENT
UNION ALL SELECT 'JOB_OBJECTIVE', COUNT(*) FROM JOB_OBJECTIVE
UNION ALL SELECT 'OBJECTIVE_KPI', COUNT(*) FROM OBJECTIVE_KPI
UNION ALL SELECT 'EMPLOYEE_KPI_SCORE', COUNT(*) FROM EMPLOYEE_KPI_SCORE;



DELIMITER $$

CREATE PROCEDURE AddKPIToObjective(
    IN p_Objective_ID INT,
    IN p_KPI_Name VARCHAR(200),
    IN p_Description TEXT,
    IN p_Measurement_Unit VARCHAR(50),
    IN p_Target_Value VARCHAR(100),
    IN p_Weight DECIMAL(5,2)
)
BEGIN
    INSERT INTO OBJECTIVE_KPI (
        Objective_ID, KPI_Name, Description, Measurement_Unit, Target_Value, Weight
    )
    VALUES (
        p_Objective_ID, p_KPI_Name, p_Description, p_Measurement_Unit, p_Target_Value, p_Weight
    );

    SELECT 'KPI added successfully!' AS Message;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AssignJobToEmployee(
    IN p_Employee_ID INT,
    IN p_Job_ID INT,
    IN p_Contract_ID INT,
    IN p_Start_Date DATE,
    IN p_End_Date DATE,
    IN p_Status VARCHAR(30),
    IN p_Assigned_Salary DECIMAL(12,2)
)
BEGIN

    IF NOT EXISTS (SELECT 1 FROM CONTRACT WHERE Contract_ID = p_Contract_ID) THEN
        SELECT 'Contract does not exist!' AS Message;


    ELSEIF NOT EXISTS (SELECT 1 FROM EMPLOYEE WHERE Employee_ID = p_Employee_ID) THEN
        SELECT 'Employee does not exist!' AS Message;


    ELSEIF EXISTS (
        SELECT 1
        FROM JOB_ASSIGNMENT
        WHERE Employee_ID = p_Employee_ID
        AND Status = 'Active'
        AND (End_Date IS NULL OR End_Date >= p_Start_Date)
    ) THEN
        SELECT 'Employee already has an active job assignment!' AS Message;


    ELSE
        INSERT INTO JOB_ASSIGNMENT (
            Employee_ID, Job_ID, Contract_ID, Start_Date, End_Date, Status, Assigned_Salary
        )
        VALUES (
            p_Employee_ID, p_Job_ID, p_Contract_ID, p_Start_Date, p_End_Date, p_Status, p_Assigned_Salary
        );

        SELECT 'Job assigned to employee successfully!' AS Message;
    END IF;

END $$

DELIMITER ;







DELIMITER $$

CREATE PROCEDURE CloseJobAssignment(
    IN p_Assignment_ID INT,
    IN p_End_Date DATE,
    IN p_Status VARCHAR(30)
)
BEGIN
    UPDATE JOB_ASSIGNMENT
    SET End_Date = p_End_Date,
        Status = p_Status
    WHERE Assignment_ID = p_Assignment_ID;

    SELECT 'Job assignment closed successfully!' AS Message;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE CreatePerformanceCycle(
    IN p_Cycle_Name VARCHAR(100),
    IN p_Cycle_Type VARCHAR(100),
    IN p_Start_Date DATE,
    IN p_End_Date DATE,
    IN p_Submission_Deadline DATE
)
BEGIN
    INSERT INTO PERFORMANCE_CYCLE (
        Cycle_Name, Cycle_Type, Start_Date, End_Date, Submission_Deadline
    )
    VALUES (
        p_Cycle_Name, p_Cycle_Type, p_Start_Date, p_End_Date, p_Submission_Deadline
    );

    SELECT 'Performance cycle created successfully!' AS Message;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE AddEmployeeKPIScore(
    IN p_Assignment_ID INT,
    IN p_KPI_ID INT,
    IN p_Cycle_ID INT,
    IN p_Actual_Value VARCHAR(100),
    IN p_Employee_Score DECIMAL(5,2),
    IN p_Reviewer_ID INT,
    IN p_Comments TEXT
)
BEGIN

    IF NOT EXISTS (SELECT 1 FROM JOB_ASSIGNMENT WHERE Assignment_ID = p_Assignment_ID) THEN
        SELECT 'Assignment does not exist!' AS Message;


    ELSEIF NOT EXISTS (SELECT 1 FROM OBJECTIVE_KPI WHERE KPI_ID = p_KPI_ID) THEN
        SELECT 'KPI does not exist!' AS Message;


    ELSEIF NOT EXISTS (SELECT 1 FROM PERFORMANCE_CYCLE WHERE Cycle_ID = p_Cycle_ID) THEN
        SELECT 'Performance cycle does not exist!' AS Message;

    ELSE

        INSERT INTO EMPLOYEE_KPI_SCORE (
            Assignment_ID, KPI_ID, Performance_Cycle_ID,
            Actual_Value, Employee_Score, Weighted_Score,
            Reviewer_ID, Comments, Review_Date
        )
        VALUES (
            p_Assignment_ID, p_KPI_ID, p_Cycle_ID,
            p_Actual_Value, p_Employee_Score,
            NULL,
            p_Reviewer_ID, p_Comments, CURDATE()
        );

        SELECT 'Employee KPI score added successfully!' AS Message;
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE CalculateEmployeeWeightedScore(
    IN p_Score_ID INT
)
BEGIN
    DECLARE v_score DECIMAL(5,2);
    DECLARE v_weight DECIMAL(5,2);


    IF NOT EXISTS (
        SELECT 1 FROM EMPLOYEE_KPI_SCORE WHERE Score_ID = p_Score_ID
    ) THEN
        SELECT 'Score record does not exist!' AS Message;

    ELSE
        
        SELECT s.Employee_Score, k.Weight
        INTO v_score, v_weight
        FROM EMPLOYEE_KPI_SCORE s
        JOIN OBJECTIVE_KPI k ON s.KPI_ID = k.KPI_ID
        WHERE s.Score_ID = p_Score_ID;


        UPDATE EMPLOYEE_KPI_SCORE
        SET Weighted_Score = (v_score * v_weight) / 100
        WHERE Score_ID = p_Score_ID;

        SELECT 'Weighted score calculated successfully!' AS Message;
    END IF;

END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE CreateAppraisal(
    IN p_Assignment_ID INT,
    IN p_Cycle_ID INT,
    IN p_Overall_Score DECIMAL(5,2),
    IN p_Manager_Comments TEXT,
    IN p_Reviewer_ID INT
)
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM JOB_ASSIGNMENT WHERE Assignment_ID = p_Assignment_ID
    ) THEN
        SELECT 'Assignment does not exist!' AS Message;

    ELSEIF NOT EXISTS (
        SELECT 1 FROM PERFORMANCE_CYCLE WHERE Cycle_ID = p_Cycle_ID
    ) THEN
        SELECT 'Performance cycle does not exist!' AS Message;

    ELSE

        INSERT INTO APPRAISAL (
            Assignment_ID, Cycle_ID, Appraisal_Date,
            Overall_Score, Manager_Comments, Reviewer_ID
        )
        VALUES (
            p_Assignment_ID, p_Cycle_ID, CURDATE(),
            p_Overall_Score, p_Manager_Comments, p_Reviewer_ID
        );

        SELECT 'Appraisal created successfully!' AS Message;
    END IF;

END $$

DELIMITER ;
DELIMITER $$

CREATE PROCEDURE SubmitAppeal(
    IN p_Appraisal_ID INT,
    IN p_Reason TEXT,
    IN p_Original_Score DECIMAL(5,2)
)
BEGIN

    IF NOT EXISTS (
        SELECT 1 FROM APPRAISAL WHERE Appraisal_ID = p_Appraisal_ID
    ) THEN
        SELECT 'Appraisal does not exist!' AS Message;

    ELSE

        INSERT INTO APPEAL (
            Appraisal_ID,
            Submission_Date,
            Reason,
            Original_Score,
            Approval_Status,
            appeal_outcome_Score
        )
        VALUES (
            p_Appraisal_ID,
            CURDATE(),
            p_Reason,
            p_Original_Score,
            'Pending',
            NULL
        );

        SELECT 'Appeal submitted successfully!' AS Message;
    END IF;

END $$
DELIMITER ;


DELIMITER $$




CREATE PROCEDURE AddTrainingProgram(
    IN p_Program_Code VARCHAR(50),
    IN p_Title VARCHAR(250),
    IN p_Objectives TEXT,
    IN p_Type VARCHAR(100),
    IN p_Subtype VARCHAR(100),
    IN p_Delivery_Method VARCHAR(100),
    IN p_Approval_Status VARCHAR(30)
)
BEGIN
    IF EXISTS (SELECT 1 FROM TRAINING_PROGRAM WHERE Program_Code = p_Program_Code) THEN
        SELECT CONCAT('Program code ', p_Program_Code, ' already exists.') AS Message;
    ELSE
        INSERT INTO TRAINING_PROGRAM
            (Program_Code, Title, Objectives, Type, Subtype, Delivery_Method, Approval_Status)
        VALUES
            (p_Program_Code, p_Title, p_Objectives, p_Type, p_Subtype, p_Delivery_Method, p_Approval_Status);
        SELECT LAST_INSERT_ID() AS New_Program_ID, CONCAT('Program \"', p_Title, '\" added successfully.') AS Message;
    END IF;
END $$
DELIMITER ;
DELIMITER $$
CREATE PROCEDURE EnrollEmployeeInTraining(
    IN p_Employee_ID INT,
    IN p_Program_ID INT,
    IN p_Completion_Status VARCHAR(20)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM EMPLOYEE WHERE Employee_ID = p_Employee_ID) THEN
        SELECT 'Employee does not exist.' AS Message;
    ELSEIF NOT EXISTS (SELECT 1 FROM TRAINING_PROGRAM WHERE Program_ID = p_Program_ID) THEN
        SELECT 'Training program does not exist.' AS Message;
    ELSEIF EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE Employee_ID = p_Employee_ID AND Program_ID = p_Program_ID) THEN
        SELECT 'Employee is already enrolled in this program.' AS Message;
    ELSE
        IF p_Completion_Status IS NULL THEN
            SET p_Completion_Status = 'Pending';
        END IF;
        INSERT INTO EMPLOYEE_TRAINING (Employee_ID, Program_ID, Completion_Status)
        VALUES (p_Employee_ID, p_Program_ID, p_Completion_Status);
        SELECT LAST_INSERT_ID() AS New_ET_ID, 'Enrollment successful.' AS Message;
    END IF;
END $$
DELIMITER ;
DELIMITER $$
CREATE PROCEDURE RecordTrainingCompletion(
    IN p_ET_ID INT,
    IN p_Completion_Date DATE
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE ET_ID = p_ET_ID) THEN
        SELECT 'Employee training record not found.' AS Message;
    ELSE
        UPDATE EMPLOYEE_TRAINING
        SET Completion_Status = 'Completed'
        WHERE ET_ID = p_ET_ID;
        SELECT 'Training marked as Completed.' AS Message;
    END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE IssueTrainingCertificate(
    IN p_ET_ID INT,
    IN p_Issue_Date DATE,
    IN p_File_Path VARCHAR(300)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE ET_ID = p_ET_ID) THEN
        SELECT 'Training record not found.' AS Message;
    ELSEIF NOT EXISTS (SELECT 1 FROM EMPLOYEE_TRAINING WHERE ET_ID = p_ET_ID AND Completion_Status = 'Completed') THEN
        SELECT 'Certificate cannot be issued because training is not completed.' AS Message;
    ELSEIF EXISTS (SELECT 1 FROM TRAINING_CERTIFICATE WHERE ET_ID = p_ET_ID) THEN
        SELECT 'A certificate already exists for this training record.' AS Message;
    ELSE
        INSERT INTO TRAINING_CERTIFICATE (ET_ID, Issue_Date, certificate_file_path)
        VALUES (p_ET_ID, p_Issue_Date, p_File_Path);
        SELECT 'Certificate issued successfully.' AS Message;
    END IF;
END $$

DELIMITER ;













DELIMITER $$

CREATE FUNCTION fn_FullName(
    p_First VARCHAR(100),
    p_Middle VARCHAR(100),
    p_Last VARCHAR(100)
)
RETURNS VARCHAR(300)
DETERMINISTIC
BEGIN
    RETURN CONCAT(
        p_First,
        IF(p_Middle IS NULL OR p_Middle = '', '', CONCAT(' ', p_Middle)),
        ' ',
        p_Last
    );
END $$

DELIMITER ;

DELIMITER $$
CREATE FUNCTION fn_Age(p_DOB DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN YEAR(CURDATE()) - YEAR(p_DOB);
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION fn_ServiceYears(p_EmployeeID INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE startDate DATE;
    SELECT MIN(Start_Date)
    INTO startDate
    FROM JOB_ASSIGNMENT
    WHERE Employee_ID = p_EmployeeID;

    IF startDate IS NULL THEN
        RETURN 0; 
    END IF;

    RETURN YEAR(CURDATE()) - YEAR(startDate);
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION fn_CycleDuration(p_CycleID INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE s DATE;
    DECLARE e DATE;
    SELECT Start_Date, End_Date
    INTO s, e
    FROM PERFORMANCE_CYCLE
    WHERE Cycle_ID = p_CycleID;

    IF s IS NULL OR e IS NULL THEN
        RETURN NULL;
    END IF;

    RETURN DATEDIFF(e, s);
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION fn_TotalEmployees()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*)
    INTO total
    FROM EMPLOYEE;
    RETURN total;
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION fn_ActiveEmployees()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*)
    INTO total
    FROM EMPLOYEE
    WHERE Employment_Status = 'Active';
    RETURN total;
END $$
DELIMITER ;


DELIMITER $$
CREATE FUNCTION fn_TotalTrainingPrograms()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;
    SELECT COUNT(*)
    INTO total
    FROM TRAINING_PROGRAM;
    RETURN total;
END $$
DELIMITER ;


DELIMITER $$
CREATE FUNCTION getKPIScore(
    p_Employee_ID INT,
    p_KPI_ID INT,
    p_Cycle_ID INT
)
RETURNS DECIMAL(5,2)

DETERMINISTIC
BEGIN
    DECLARE score DECIMAL(5,2);

    SELECT eks.Employee_Score
    INTO score
    FROM EMPLOYEE_KPI_SCORE eks
    JOIN JOB_ASSIGNMENT ja
        ON eks.Assignment_ID = ja.Assignment_ID
    WHERE ja.Employee_ID = p_Employee_ID
      AND eks.KPI_ID = p_KPI_ID
      AND eks.Performance_Cycle_ID = p_Cycle_ID
    LIMIT 1;

    RETURN score;
END $$

DELIMITER ;



DELIMITER $$

CREATE FUNCTION getWeightedKPIScore(
    p_Employee_ID INT,
    p_KPI_ID INT,
    p_Cycle_ID INT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE result DECIMAL(5,2);

    SELECT (eks.Employee_Score * ok.Weight) / 100
    INTO result
    FROM EMPLOYEE_KPI_SCORE eks
    JOIN JOB_ASSIGNMENT ja
        ON eks.Assignment_ID = ja.Assignment_ID
    JOIN OBJECTIVE_KPI ok
        ON ok.KPI_ID = eks.KPI_ID
    WHERE ja.Employee_ID = p_Employee_ID
      AND eks.KPI_ID = p_KPI_ID
      AND eks.Performance_Cycle_ID = p_Cycle_ID
    LIMIT 1;

    RETURN result;
END $$

DELIMITER ;



DELIMITER $$
CREATE FUNCTION getJobObjectiveWeight(job_id INT)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
  DECLARE total DECIMAL(5,2);

  SELECT SUM(Weight) INTO total
  FROM JOB_OBJECTIVE
  WHERE Job_ID = job_id;

  RETURN total;
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION totalJobs()
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT;

  SELECT COUNT(*) INTO total
  FROM JOB;

  RETURN total;
END $$
DELIMITER ;


DELIMITER $$
CREATE FUNCTION activeJobs()
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT;

  SELECT COUNT(*) INTO total
  FROM JOB_ASSIGNMENT
  WHERE End_Date IS NULL;

  RETURN total;
END $$
DELIMITER ;


DELIMITER $$
CREATE FUNCTION totalCertificates()
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT;

  SELECT COUNT(*) INTO total
  FROM TRAINING_CERTIFICATE;

  RETURN total;
END $$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION kpiCompletionRate(
    p_Employee_ID INT,
    p_Cycle_ID INT
)
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
    DECLARE totalKPI INT;
    DECLARE completed INT;
    DECLARE rate DECIMAL(5,2);


    SELECT COUNT(*) INTO totalKPI
    FROM OBJECTIVE_KPI;


    SELECT COUNT(*) INTO completed
    FROM EMPLOYEE_KPI_SCORE eks
    JOIN JOB_ASSIGNMENT ja ON eks.Assignment_ID = ja.Assignment_ID
    WHERE ja.Employee_ID = p_Employee_ID
      AND eks.Performance_Cycle_ID = p_Cycle_ID;

    IF totalKPI = 0 THEN
        RETURN 0;
    END IF;

    SET rate = (completed / totalKPI) * 100;
    RETURN rate;
END $$

-- functions

DELIMITER ;

DELIMITER $$
CREATE FUNCTION avgAppraisalScore()
RETURNS DECIMAL(5,2)
DETERMINISTIC
BEGIN
  DECLARE avg_score DECIMAL(5,2);

  SELECT AVG(Overall_Score) INTO avg_score
  FROM APPRAISAL;

  RETURN avg_score;
END $$
DELIMITER ;










DELIMITER $$

CREATE TRIGGER objective_weight_insert
BEFORE INSERT ON JOB_OBJECTIVE
FOR EACH ROW
BEGIN
    DECLARE total_weight DECIMAL(5,2);

    SELECT IFNULL(SUM(Weight), 0)
    INTO total_weight
    FROM JOB_OBJECTIVE
    WHERE Job_ID = NEW.Job_ID;

    IF (total_weight + NEW.Weight) > 100 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Objective weight exceeds 100%';
    END IF;
END $$
DELIMITER  ;


DELIMITER $$

CREATE TRIGGER objective_no_delete
BEFORE DELETE ON JOB_OBJECTIVE
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM OBJECTIVE_KPI WHERE Objective_ID = OLD.Objective_ID
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot delete objective with KPIs';
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER employee_no_delete
BEFORE DELETE ON EMPLOYEE
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM JOB_ASSIGNMENT
        WHERE Employee_ID = OLD.Employee_ID
          AND End_Date IS NULL
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot delete employee with active assignment';
    END IF;
END $$

DELIMITER ;





DELIMITER $$

CREATE TRIGGER certificate_check
BEFORE INSERT ON TRAINING_CERTIFICATE
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM EMPLOYEE_TRAINING
        WHERE ET_ID = NEW.ET_ID
          AND Completion_Status = 'Completed'
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Training not completed';
    END IF;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_kpi_score_calc_insert
AFTER INSERT ON EMPLOYEE_KPI_SCORE
FOR EACH ROW
BEGIN
    UPDATE EMPLOYEE_KPI_SCORE
    SET Weighted_Score =
        (NEW.Employee_Score *
            (SELECT Weight FROM OBJECTIVE_KPI WHERE KPI_ID = NEW.KPI_ID)
        ) / 100
    WHERE Score_ID = NEW.Score_ID;
END $$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER program_no_delete
BEFORE DELETE ON TRAINING_PROGRAM
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1
        FROM EMPLOYEE_TRAINING
        WHERE Program_ID = OLD.Program_ID
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Program has enrolled employees';
    END IF;
END $$

DELIMITER ;




CREATE VIEW vw_EmployeeCountByDepartment AS
SELECT 
    d.Department_ID,
    d.Department_Name,
    COUNT(ja.Employee_ID) AS Employee_Count
FROM DEPARTMENT d
LEFT JOIN JOB j 
    ON d.Department_ID = j.Department_ID
LEFT JOIN JOB_ASSIGNMENT ja 
    ON j.Job_ID = ja.Job_ID
GROUP BY d.Department_ID, d.Department_Name;

SELECT * FROM vw_EmployeeCountByDepartment;


SELECT * FROM vw_EmployeeCountByDepartment;


CREATE VIEW vw_GenderDistribution AS
SELECT 
    Gender,
    COUNT(*) AS Total_Employees
FROM EMPLOYEE
GROUP BY Gender;

SELECT * FROM vw_GenderDistribution;


CREATE VIEW vw_EmploymentStatusDistribution AS
SELECT 
    Employment_Status,
    COUNT(*) AS Total_Employees
FROM EMPLOYEE
GROUP BY Employment_Status;

SELECT * FROM vw_EmploymentStatusDistribution;





CREATE VIEW vw_JobsByLevel AS
SELECT 
    Job_Level,
    COUNT(Job_ID) AS Total_Jobs
FROM JOB
GROUP BY Job_Level;

SELECT * FROM vw_JobsByLevel;


CREATE VIEW vw_SalaryStatsByCategory AS
SELECT
    Job_Category,
    MIN(Min_Salary) AS MinSalary,
    MAX(Max_Salary) AS MaxSalary,
    AVG((Min_Salary + Max_Salary)/2) AS AvgSalary
FROM JOB
GROUP BY Job_Category;

SELECT * FROM vw_SalaryStatsByCategory;


CREATE VIEW vw_ActiveJobAssignments AS
SELECT
    ja.Assignment_ID,
    e.First_Name,
    e.Last_Name,
    j.Job_Title,
    ja.Start_Date,
    ja.Status
FROM JOB_ASSIGNMENT ja
JOIN EMPLOYEE e ON ja.Employee_ID = e.Employee_ID
JOIN JOB j ON ja.Job_ID = j.Job_ID
WHERE ja.End_Date IS NULL;

SELECT * FROM vw_ActiveJobAssignments;


CREATE VIEW vw_KPIScoreSummary AS
SELECT 
    e.Employee_ID,
    CONCAT(e.First_Name, ' ', e.Last_Name) AS Employee_Name,
    pc.Cycle_Name,
    k.KPI_Name,
    eks.Employee_Score,
    eks.Weighted_Score
FROM EMPLOYEE_KPI_SCORE eks
JOIN JOB_ASSIGNMENT ja 
    ON eks.Assignment_ID = ja.Assignment_ID
JOIN EMPLOYEE e 
    ON e.Employee_ID = ja.Employee_ID
JOIN OBJECTIVE_KPI k 
    ON k.KPI_ID = eks.KPI_ID
JOIN PERFORMANCE_CYCLE pc 
    ON pc.Cycle_ID = eks.Performance_Cycle_ID;


SELECT * FROM vw_KPIScoreSummary;


CREATE VIEW vw_AppraisalScoresByCycle AS
SELECT
    pc.Cycle_Name,
    AVG(a.Overall_Score) AS Avg_Score,
    MIN(a.Overall_Score) AS Min_Score,
    MAX(a.Overall_Score) AS Max_Score
FROM APPRAISAL a
JOIN PERFORMANCE_CYCLE pc ON pc.Cycle_ID = a.Cycle_ID
GROUP BY pc.Cycle_Name;

SELECT * FROM vw_AppraisalScoresByCycle;


CREATE VIEW vw_FullAppraisalSummary AS
SELECT 
    e.Employee_ID,
    CONCAT(e.First_Name, ' ', e.Last_Name) AS Employee_Name,
    j.Job_Title,
    pc.Cycle_Name,
    a.Overall_Score,
    a.Manager_Comments,
    a.HR_Comments,
    a.Employee_Comments
FROM APPRAISAL a
JOIN JOB_ASSIGNMENT ja ON ja.Assignment_ID = a.Assignment_ID
JOIN EMPLOYEE e ON e.Employee_ID = ja.Employee_ID
JOIN JOB j ON j.Job_ID = ja.Job_ID
JOIN PERFORMANCE_CYCLE pc ON pc.Cycle_ID = a.Cycle_ID;

SELECT * FROM vw_FullAppraisalSummary;


CREATE VIEW vw_EmployeeTrainingParticipation AS
SELECT 
    e.Employee_ID,
    CONCAT(e.First_Name, ' ', e.Middle_Name, ' ', e.Last_Name) AS Full_Name,
    tp.Title AS Program_Title,
    et.Completion_Status
FROM EMPLOYEE_TRAINING et
JOIN EMPLOYEE e ON e.Employee_ID = et.Employee_ID
JOIN TRAINING_PROGRAM tp ON tp.Program_ID = et.Program_ID;

SELECT * FROM vw_EmployeeTrainingParticipation;


CREATE VIEW vw_TrainingCompletionStats AS
SELECT
    tp.Program_ID,
    tp.Title,
    COUNT(et.ET_ID) AS Total_Enrolled,
    COUNT(tc.Training_Certificate_ID) AS Total_Completed
FROM TRAINING_PROGRAM tp
LEFT JOIN EMPLOYEE_TRAINING et 
    ON tp.Program_ID = et.Program_ID
LEFT JOIN TRAINING_CERTIFICATE tc
    ON et.ET_ID = tc.ET_ID
GROUP BY tp.Program_ID, tp.Title;

SELECT * FROM vw_TrainingCompletionStats;

