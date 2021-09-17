 
--  ,\s['a-zA-Z]+@[a-zA-Z]+\.(uk|us|de)?\.?(net|com|edu)?' regular expression used to remove emails
  INSERT INTO department (name)
    VALUES
  ('SALES'),
  ('HR'),
  ('ENGINEERING'),
  ('MANAGEMENT');

   INSERT INTO role (title, salary, department_id)
    VALUES
  ('IT Engineer', 80000.00,3),
  ('Product Engineer', 78000.00,3),
  ('Senior Product Engineer', 120000.00,3),
  ('Manager', 165000.00,4),
  ('Sales', 80000.00,1),
  ('HR', 75000.00,1),
  ('Operator', 25000.00,1),
  ('Technician', 30000.00,2);

  INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
      VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, 7);

    
