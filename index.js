const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the ${process.env.DB_NAME} database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + db.threadId);
  start();
});

const viewEmployeesByDepartment = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewEmployeesByManager = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN employee manager ON manager.id = employee.manager_id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewEmployeesByRole = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const viewAllEmployees = () => {
  db.query(
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
  db.query(
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
  db.query(
    `SELECT department.id, department.name
        FROM department;`,
    (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    }
  );
};

const addEmployee = () => {
  let roleChoices = [];
  let managerChoices = [];

  // get roles from database
  db.query(`SELECT * FROM role;`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      res.forEach((role) => roleChoices.push(role));
      // Once roles are retrieved, get managers from the database
      db.query(
        `SELECT employee.id, employee.first_name, employee.last_name FROM employee;`,
        (err, res) => {
          if (err) {
            console.log(err);
          } else {
            res.forEach((manager) => managerChoices.push(manager));

            const roleTitles = roleChoices.map((role) => role.title);
            const managerNames = managerChoices.map((manager) => {
              return manager.first_name + " " + manager.last_name;
            });

            inquirer
              .prompt([
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
                  choices: roleTitles,
                },
                {
                  type: "list",
                  name: "manager",
                  message: "Who is the employee's manager?",
                  choices: managerNames,
                },
              ])
              .then((employee) => {
                const role = roleChoices.find(
                  (role) => role.title === employee.role
                );
                const manager = managerChoices.find(
                  (manager) =>
                    manager.first_name + " " + manager.last_name ===
                    employee.manager
                );
                db.query(
                  `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${employee.firstName}", "${employee.lastName}", ${role.id}, ${manager.id});`,
                  (err, res) => {
                    if (err) throw err;
                    console.log("Employee added!");
                    start();
                  }
                );
              });
          }
        }
      );
    }
  });
};

const addRole = () => {
  const departmentChoices = [];
  db.query(`SELECT * FROM department;`, (err, res) => {
    err
      ? console.log(err)
      : res.forEach((department) => departmentChoices.push(department));
  });
  inquirer
    .prompt([
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
        choices: departmentChoices,
      },
    ])
    .then((role) => {
      const department = departmentChoices.find(
        (department) => department.name === role.department
      );
      db.query(
        `INSERT INTO role (title, salary, department_id)
                VALUES ("${role.title}", ${role.salary}, ${department.id});`,
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${role.title} to the database!`);
          start();
        }
      );
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the department's name?",
      },
    ])
    .then((department) => {
      db.query(
        `INSERT INTO department (name)
                VALUES ("${department.name}");`,
        (err, res) => {
          if (err) throw err;
          console.log(`Added ${department.name} to the database!`);
          start();
        }
      );
    });
};

const updateEmployeeRole = () => {
  const employeeChoices = [];
  const roleChoices = [];

  db.query(`SELECT * FROM employee;`, (err, res) => {
    err
      ? console.log(err)
      : res.forEach((employee) => employeeChoices.push(employee));

    db.query(`SELECT * FROM role;`, (err, res) => {
      err ? console.log(err) : res.forEach((role) => roleChoices.push(role));

      const employeeNames = employeeChoices.map(
        (employee) => employee.first_name + " " + employee.last_name
      );
      const roleTitles = roleChoices.map((role) => role.title);

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeNames,
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's new role?",
            choices: roleTitles,
          },
        ])
        .then((employee) => {
          const role = roleChoices.find((role) => role.title === employee.role);
          const employeeName = employee.employee.split(" ");
          db.query(
            `UPDATE employee SET role_id = ${role.id} WHERE first_name = "${employeeName[0]}" AND last_name = "${employeeName[1]}";`,
            (err, res) => {
              if (err) throw err;
              console.log("Employee updated!");
              start();
            }
          );
        });
    });
  });
};

const updateEmployeeManager = () => {
  const employeeChoices = [];
  const managerChoices = [];

  db.query(`SELECT * FROM employee;`, (err, res) => {
    err
      ? console.log(err)
      : res.forEach((employee) => employeeChoices.push(employee));

    db.query(`SELECT * FROM employee;`, (err, res) => {
      err
        ? console.log(err)
        : res.forEach((manager) => managerChoices.push(manager));

      const employeeNames = employeeChoices.map(
        (employee) => employee.first_name + " " + employee.last_name
      );

      const managerNames = managerChoices.map(
        (manager) => manager.first_name + " " + manager.last_name
      );

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employeeNames,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's new manager?",
            choices: managerNames,
          },
        ])
        .then((data) => {
          const employeeToUpdate = employeeChoices.find(
            (employee) =>
              employee.first_name + " " + employee.last_name === data.employee
          );
          const manager = managerChoices.find(
            (manager) =>
              manager.first_name + " " + manager.last_name === data.manager
          );

          db.query(
            `UPDATE employee
        SET manager_id = ${manager.id}
        WHERE id = ${employeeToUpdate.id};`,
            (err, res) => {
              if (err) throw err;
              console.log(
                `Updated ${employeeToUpdate.first_name} ${employeeToUpdate.last_name}'s manager to ${manager.first_name} ${manager.last_name}!`
              );
              start();
            }
          );
        });
    });
  });
};

const deleteEmployee = () => {
  const employees = [];
  db.query(`SELECT * FROM employee;`, (err, res) => {
    err
      ? console.log(err)
      : res.forEach((employee) => employees.push(employee));

    const employeeChoices = employees.map(
      (employee) => employee.first_name + " " + employee.last_name
    );
    inquirer
      .prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to delete?",
          choices: employeeChoices,
        },
      ])
      .then((data) => {
        const employeeToDelete = employees.find(
          (employee) =>
            employee.first_name + " " + employee.last_name === data.employee
        );
        db.query(
          `DELETE FROM employee
                    WHERE id = ${employeeToDelete.id};`,
          (err, res) => {
            if (err) throw err;
            console.log(
              `Deleted ${employeeToDelete.first_name} ${employeeToDelete.last_name} from the database!`
            );
            start();
          }
        );
      });
  });
};

const deleteRole = () => {
  const roles = [];
  db.query(`SELECT * FROM role;`, (err, res) => {
    err ? console.log(err) : res.forEach((role) => roles.push(role));

    const roleChoices = roles.map((role) => role.title);
    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: roleChoices,
        },
      ])
      .then((data) => {
        const roleToDelete = roles.find((role) => role.title === data.role);
        db.query(
          `DELETE FROM role
                    WHERE id = ${roleToDelete.id};`,
          (err, res) => {
            if (err) throw err;
            console.log(`Deleted ${roleToDelete.title} from the database!`);
            start();
          }
        );
      });
  });
};

const deleteDepartment = () => {
  const departments = [];
  db.query(`SELECT * FROM department;`, (err, res) => {
    err
      ? console.log(err)
      : res.forEach((department) => departments.push(department));

    const departmentChoices = departments.map((department) => department.name);
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to delete?",
          choices: departmentChoices,
        },
      ])
      .then((data) => {
        const departmentToDelete = departments.find(
          (department) => department.name === data.department
        );
        db.query(
          `DELETE FROM department
                    WHERE id = ${departmentToDelete.id};`,
          (err, res) => {
            if (err) throw err;
            console.log(
              `Deleted ${departmentToDelete.name} from the database!`
            );
            start();
          }
        );
      });
  });
};

const viewBudgetByDepartment = () => {
  const departments = [];
  db.query(`SELECT * FROM department;`, (err, res) => {
    err
      ? console.log(err)
      : res.forEach((department) => departments.push(department));

    const departmentChoices = departments.map((department) => department.name);
    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to view?",
          choices: departmentChoices,
        },
      ])
      .then((data) => {
        const departmentToView = departments.find(
          (department) => department.name === data.department
        );
        db.query(
          `SELECT SUM(salary) AS budget
                    FROM employee
                    LEFT JOIN role ON employee.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id
                    WHERE department.id = ${departmentToView.id};`,
          (err, res) => {
            if (err) throw err;
            console.log(
              `The total utilized budget of the ${departmentToView.name} department is $${res[0].budget}.`
            );
            start();
          }
        );
      });
  });
};

const exit = () => {
  db.end();
  process.exit();
};

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "View all employees by role",
        "View all roles",
        "View all departments",
        "Add an employee",
        "Add a role",
        "Add a department",
        "Update an employee's role",
        "Update an employee's manager",
        "Delete an employee",
        "Delete a role",
        "Delete a department",
        "View the total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all employees by department":
          viewEmployeesByDepartment();
          break;
        case "View all employees by manager":
          viewEmployeesByManager();
          break;
        case "View all employees by role":
          viewEmployeesByRole();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Update an employee's role":
          updateEmployeeRole();
          break;
        case "Update an employee's manager":
          updateEmployeeManager();
          break;
        case "Delete an employee":
          deleteEmployee();
          break;
        case "Delete a role":
          deleteRole();
          break;
        case "Delete a department":
          deleteDepartment();
          break;
        case "View the total utilized budget of a department":
          viewBudgetByDepartment();
          break;
        case "Exit":
          exit();
          break;
      }
    });
};
