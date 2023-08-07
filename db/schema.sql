DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
  `id` int(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`),
  `name` varchar(30) NOT NULL
);
CREATE TABLE role (
  `id` int(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`),
  `title` varchar(30) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `department_id` int(11) NOT NULL
);
CREATE TABLE employee (
  `id` int(11) NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`),
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `role_id` int(11) NOT NULL,
  `manager_id` int(11) DEFAULT NULL
);