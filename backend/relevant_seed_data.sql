-- Relevant seed data for report development/testing
-- Usage:
-- 1) Import structure dump first (Dump20260219strecture.sql)
-- 2) Then run this file

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE salesperson_target_history;
TRUNCATE TABLE salesperson_centre_map;
TRUNCATE TABLE f_reciept;
TRUNCATE TABLE patient_labinvestigation_opd;
TRUNCATE TABLE f_ledgertransaction;
TRUNCATE TABLE employee_master;
TRUNCATE TABLE payment_mode;
TRUNCATE TABLE centre_master;
TRUNCATE TABLE city_master;
TRUNCATE TABLE state_master;
TRUNCATE TABLE f_subcategorymaster;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO state_master (id, state, IsActive) VALUES
(1, 'Telangana', 1),
(2, 'Andhra Pradesh', 1),
(3, 'Karnataka', 1);

INSERT INTO city_master (ID, City, stateID, Country, IsActive) VALUES
(101, 'Hyderabad', 1, 'India', 1),
(102, 'Warangal', 1, 'India', 1),
(201, 'Vijayawada', 2, 'India', 1),
(202, 'Vizag', 2, 'India', 1),
(301, 'Bangalore', 3, 'India', 1),
(302, 'Mysore', 3, 'India', 1);

INSERT INTO centre_master (CentreID, CentreCode, Centre, CityID, City, StateID, State, isActive) VALUES
(1001, 'HYD01', 'Hyderabad Main', 101, 'Hyderabad', 1, 'Telangana', 1),
(1002, 'HYD02', 'Hyderabad West', 101, 'Hyderabad', 1, 'Telangana', 1),
(1003, 'WRG01', 'Warangal Centre', 102, 'Warangal', 1, 'Telangana', 1),
(2001, 'VJW01', 'Vijayawada Centre', 201, 'Vijayawada', 2, 'Andhra Pradesh', 1),
(2002, 'VZG01', 'Vizag Centre', 202, 'Vizag', 2, 'Andhra Pradesh', 1),
(3001, 'BLR01', 'Bangalore Centre', 301, 'Bangalore', 3, 'Karnataka', 1),
(3002, 'MYS01', 'Mysore Centre', 302, 'Mysore', 3, 'Karnataka', 1);

INSERT INTO payment_mode (PaymentModeId, PaymentMode, Active) VALUES
(1, 'Cash', 1),
(2, 'Credit', 1),
(3, 'UPI', 1),
(4, 'Card', 1),
(5, 'NetBanking', 1);

INSERT INTO employee_master (Employee_ID, Name, City, IsActive, Category, Designation)
SELECT 5000 + n, CONCAT('Salesperson ', n),
       CASE
         WHEN MOD(n,7)=0 THEN 'Mysore'
         WHEN MOD(n,6)=0 THEN 'Bangalore'
         WHEN MOD(n,5)=0 THEN 'Vizag'
         WHEN MOD(n,4)=0 THEN 'Vijayawada'
         WHEN MOD(n,3)=0 THEN 'Warangal'
         WHEN MOD(n,2)=0 THEN 'Hyderabad'
         ELSE 'Hyderabad'
       END,
       1, 'Sales', 'Sales Executive'
FROM (
  SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
  UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
  UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15
  UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20
  UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
  UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
  UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34 UNION ALL SELECT 35
  UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39 UNION ALL SELECT 40
  UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44 UNION ALL SELECT 45
  UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49 UNION ALL SELECT 50
) t;

INSERT INTO salesperson_centre_map (salesperson_id, centre_id, is_active)
SELECT e.Employee_ID,
       CASE e.City
         WHEN 'Hyderabad' THEN 1001
         WHEN 'Warangal' THEN 1003
         WHEN 'Vijayawada' THEN 2001
         WHEN 'Vizag' THEN 2002
         WHEN 'Bangalore' THEN 3001
         WHEN 'Mysore' THEN 3002
         ELSE 1001
       END,
       1
FROM employee_master e
WHERE e.Employee_ID BETWEEN 5001 AND 5050;

INSERT INTO f_subcategorymaster (SubCategoryID, CategoryID, Name, Active)
VALUES
('SC001', 'LAB', 'Hematology', 1),
('SC002', 'LAB', 'Biochemistry', 1),
('SC003', 'RAD', 'XRay', 1),
('SC004', 'RAD', 'CT Scan', 1),
('SC005', 'LAB', 'Microbiology', 1);

DROP PROCEDURE IF EXISTS seed_report_data;
DELIMITER $$
CREATE PROCEDURE seed_report_data()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE cId INT;
  DECLARE pmId INT;
  DECLARE subId VARCHAR(20);

  WHILE i <= 2000 DO
    SET cId = ELT(1 + MOD(i,7), 1001,1002,1003,2001,2002,3001,3002);
    SET pmId = ELT(1 + MOD(i,5), 1,2,3,4,5);
    SET subId = ELT(1 + MOD(i,5), 'SC001','SC002','SC003','SC004','SC005');

    INSERT INTO f_ledgertransaction (
      LedgerTransactionNo, Date, NetAmount, GrossAmount, IsCancel, CentreID, PName
    ) VALUES (
      CONCAT('LT', LPAD(i, 8, '0')),
      DATE_SUB(CURDATE(), INTERVAL MOD(i, 120) DAY),
      500 + MOD(i*37, 4500),
      600 + MOD(i*41, 5000),
      0,
      cId,
      CONCAT('Patient ', i)
    );

    INSERT INTO f_reciept (
      ReceiptNo, LedgerTransactionNo, LedgerTransactionID, PaymentModeID, PaymentMode, Amount, EntryDateTime, IsCancel, CentreID
    ) VALUES (
      CONCAT('RC', LPAD(i, 8, '0')),
      CONCAT('LT', LPAD(i, 8, '0')),
      LAST_INSERT_ID(),
      pmId,
      ELT(pmId, 'Cash','Credit','UPI','Card','NetBanking'),
      500 + MOD(i*31, 5000),
      DATE_SUB(NOW(), INTERVAL MOD(i, 120) DAY),
      0,
      cId
    );

    INSERT INTO patient_labinvestigation_opd (
      LedgerTransactionID, SubCategoryID, Amount, IsRefund, Date
    ) VALUES (
      LAST_INSERT_ID(),
      subId,
      300 + MOD(i*17, 3000),
      0,
      DATE_SUB(NOW(), INTERVAL MOD(i, 120) DAY)
    );

    SET i = i + 1;
  END WHILE;
END$$
DELIMITER ;

CALL seed_report_data();
DROP PROCEDURE IF EXISTS seed_report_data;

INSERT INTO salesperson_target_history (salesperson_id, salesperson_name, branch, region, start_date, end_date, target_amount)
SELECT
  CAST(e.Employee_ID AS CHAR),
  e.Name,
  c.Centre,
  c.State,
  DATE_SUB(CURDATE(), INTERVAL 30 DAY),
  CURDATE(),
  100000 + (MOD(e.Employee_ID, 10) * 25000)
FROM employee_master e
JOIN salesperson_centre_map scm ON scm.salesperson_id = e.Employee_ID AND scm.is_active = 1
JOIN centre_master c ON c.CentreID = scm.centre_id
WHERE e.Employee_ID BETWEEN 5001 AND 5050;
