const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  console.log("Connected to the employee_db database.")
);

const questions = [
  {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees By Department",
      "View All Employees By Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "View All Departments",
      "Add Department",
      "Remove Department",
      "Quit",
    ],
  },
];

const addEmployeeQuestions = [
  {
    type: "input",
    name: "firstName",
    message: "What is the employee's first name?",
  },
  {
    type: "input",
    name: "lastName",
    message: "What is the employee's last name?",
  },
  {
    type: "list",
    name: "role",
    message: "What is the employee's role?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer",
    ],
  },
  {
    type: "list",
    name: "manager",
    message: "Who is the employee's manager?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
      "Michael Scott",
    ],
  },
];

const addRoleQuestions = [
  {
    type: "input",
    name: "title",
    message: "What is the role's title?",
  },
  {
    type: "input",
    name: "salary",
    message: "What is the role's salary?",
  },
  {
    type: "list",
    name: "department",
    message: "What is the role's department?",
    choices: ["Sales", "Engineering", "Finance", "Legal"],
  },
];

const addDepartmentQuestions = [
  {
    type: "input",
    name: "name",
    message: "What is the department's name?",
  },
];

const removeEmployeeQuestions = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to remove?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
      "Michael Scott",
    ],
  },
];

const removeRoleQuestions = [
  {
    type: "list",
    name: "role",
    message: "Which role would you like to remove?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer",
    ],
  },
];

const removeDepartmentQuestions = [
  {
    type: "list",
    name: "department",
    message: "Which department would you like to remove?",
    choices: ["Sales", "Engineering", "Finance", "Legal"],
  },
];

const updateEmployeeRoleQuestions = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
      "Michael Scott",
    ],
  },
  {
    type: "list",
    name: "role",
    message: "What is the employee's new role?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer",
    ],
  },
];

const updateEmployeeManagerQuestions = [
  {
    type: "list",
    name: "employee",
    message: "Which employee would you like to update?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
      "Michael Scott",
    ],
  },
  {
    type: "list",
    name: "manager",
    message: "Who is the employee's new manager?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
      "Michael Scott",
    ],
  },
];

const viewEmployeesByDepartmentQuestions = [
  {
    type: "list",
    name: "department",
    message: "Which department would you like to view?",
    choices: ["Sales", "Engineering", "Finance", "Legal"],
  },
];

const viewEmployeesByManagerQuestions = [
  {
    type: "list",
    name: "manager",
    message: "Which manager would you like to view?",
    choices: [
      "John Doe",
      "Mike Chan",
      "Ashley Rodriguez",
      "Kevin Tupik",
      "Malia Brown",
      "Sarah Lourd",
      "Tom Allen",
      "Michael Scott",
    ],
  },
];

const viewEmployeesByRoleQuestions = [
  {
    type: "list",
    name: "role",
    message: "Which role would you like to view?",
    choices: [
      "Sales Lead",
      "Salesperson",
      "Lead Engineer",
      "Software Engineer",
      "Account Manager",
      "Accountant",
      "Legal Team Lead",
      "Lawyer",
    ],
  },
];

const viewEmployeesByDepartment = (department) => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
        WHERE department.name = "${department}";`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewEmployeesByManager = (manager) => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
        WHERE CONCAT(manager.first_name, " ", manager.last_name) = "${manager}";`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewEmployeesByRole = (role) => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id
        WHERE role.title = "${role}";`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewAllEmployees = () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON manager.id = employee.manager_id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewAllRoles = () => {
  connection.query(
    `SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        LEFT JOIN department ON role.department_id = department.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewAllDepartments = () => {
  connection.query(
    `SELECT department.id, department.name
        FROM department;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const addEmployee = (employee) => {
  connection.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES ("${employee.firstName}", "${employee.lastName}", ${employee.role}, ${employee.manager});`,
    (err, res) => {
      if (err) throw err;
      console.log(
        `Added ${employee.firstName} ${employee.lastName} to the database!`
      );
      start();
    }
  );
};

const addRole = (role) => {
  connection.query(
    `INSERT INTO role (title, salary, department_id)
        VALUES ("${role.title}", ${role.salary}, ${role.department});`,
    (err, res) => {
      if (err) throw err;
      console.log(`Added ${role.title} to the database!`);
      start();
    }
  );
};

const addDepartment = (department) => {
  connection.query(
    `INSERT INTO department (name)
        VALUES ("${department.name}");`,
    (err, res) => {
      if (err) throw err;
      console.log(`Added ${department.name} to the database!`);
      start();
    }
  );
};

const updateEmployeeRole = (employee) => {
  connection.query(
    `UPDATE employee
        SET role_id = ${employee.role}
        WHERE id = ${employee.id};`,
    (err, res) => {
      if (err) throw err;
      console.log(
        `Updated ${employee.firstName} ${employee.lastName}'s role to ${employee.role}!`
      );
      start();
    }
  );
};

const updateEmployeeManager = (employee) => {
  connection.query(
    `UPDATE employee
        SET manager_id = ${employee.manager}
        WHERE id = ${employee.id};`,
    (err, res) => {
      if (err) throw err;
      console.log(
        `Updated ${employee.firstName} ${employee.lastName}'s manager to ${employee.manager}!`
      );
      start();
    }
  );
};

const deleteEmployee = (employee) => {
  connection.query(
    `DELETE FROM employee
        WHERE id = ${employee.id};`,
    (err, res) => {
      if (err) throw err;
      console.log(
        `Deleted ${employee.firstName} ${employee.lastName} from the database!`
      );
      start();
    }
  );
};

const deleteRole = (role) => {
  connection.query(
    `DELETE FROM role
        WHERE id = ${role.id};`,
    (err, res) => {
      if (err) throw err;
      console.log(`Deleted ${role.title} from the database!`);
      start();
    }
  );
};

const deleteDepartment = (department) => {
  connection.query(
    `DELETE FROM department
        WHERE id = ${department.id};`,
    (err, res) => {
      if (err) throw err;
      console.log(`Deleted ${department.name} from the database!`);
      start();
    }
  );
};

const viewBudgetByDepartment = (department) => {
  connection.query(
    `SELECT department.name AS department, SUM(role.salary) AS budget
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        WHERE department.name = "${department}";`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const exit = () => {
  connection.end();
  process.exit();
};

start();

inquirer.prompt(questions).then((answers) => {
  console.log(answers);
});

module.exports = {
  viewEmployeesByDepartment,
  viewEmployeesByManager,
  viewEmployeesByRole,
  viewAllEmployees,
  viewAllRoles,
  viewAllDepartments,
  addEmployee,
  addRole,
  addDepartment,
  updateEmployeeRole,
  updateEmployeeManager,
  deleteEmployee,
  deleteRole,
  deleteDepartment,
  viewBudgetByDepartment,
  exit,
};
