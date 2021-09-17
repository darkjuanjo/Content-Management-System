const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllEmployees() {
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employee 
            LEFT JOIN role 
            ON employee.role_id = role.id 
            LEFT JOIN department 
            ON role.department_id = department.id 
            LEFT JOIN employee manager 
            on manager.id = employee.manager_id;`
        );
    };

    getDepartments(){
        return this.connection.promise().query(
            `SELECT 
                id , 
                name  
            FROM department`
        );
    };

    viewByDepartment(department) {
        return this.connection.promise().query(
            `SELECT 
                employee.id,
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name 
            AS 
                department, 
                role.salary, 
            CONCAT
                (manager.first_name, ' ', manager.last_name) 
            AS 
                manager 
            FROM 
                employee 
            LEFT JOIN 
                role 
            ON 
                employee.role_id = role.id 
            LEFT JOIN 
                department 
            ON 
                role.department_id = department.id 
            LEFT JOIN 
                employee manager 
            on manager.id = employee.manager_id
            WHERE
                role.department_id = ?
                `
                ,department
        );
    };

    getManager() {
        return this.connection.promise().query(
            `
            SELECT 
                employee.manager_id,

            CONCAT
                (manager.first_name, ' ', manager.last_name) 
            AS 
                manager 
            FROM
                employee

            LEFT JOIN 
                employee manager 
            ON 
                manager.id = employee.manager_id
            WHERE
                employee.manager_id IS NOT NULL`
        );
    };
    

    viewByManager(manager) {
        return this.connection.promise().query(
            `SELECT 
                employee.id,
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name 
            AS 
                department, 
                role.salary, 
            CONCAT
                (manager.first_name, ' ', manager.last_name) 
            AS 
                manager 
            FROM 
                employee 
            LEFT JOIN 
                role 
            ON 
                employee.role_id = role.id 
            LEFT JOIN 
                department 
            ON 
                role.department_id = department.id 
            LEFT JOIN 
                employee manager 
            on manager.id = employee.manager_id
            WHERE
                employee.manager_id = ?
                `
                ,manager
        );
    };

    addDepartment(department) {
        return this.connection.promise().query(
            `INSERT INTO 
                department 
            SET 
                ?
            `
            , department
        );
    };

    addEmployee(employee) {
        return this.connection.promise().query(
            `INSERT INTO 
                employee 
            SET 
                ?
            `
            , employee
        );
    };

    updateEmployeeManager(manager_id, employee_id) {
        return this.connection.promise().query(
            `UPDATE 
                employee  
            SET 
                manager_id = ?
            WHERE
                id = ?
            `
            , [manager_id, employee_id]
        );
    }

};

module.exports = new DB(connection);