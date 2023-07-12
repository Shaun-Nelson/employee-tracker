INSERT INTO department (id, name)
VALUES
  	(1, 'Sales'),
  	(2, 'Marketing'),
  	(3, 'Engineering');

INSERT INTO role (id, title, salary, department_id)
VALUES
  	(1, 'Sales Manager', 5000, 1),
  	(2, 'Marketing Coordinator', 3000, 2),
  	(3, 'Software Engineer', 6000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
  	(1, 'John', 'Doe', 1, NULL),
  	(2, 'Jane', 'Smith', 2, 1),
  	(3, 'Shaun', 'Nelson', 3, 2);
