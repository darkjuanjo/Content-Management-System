const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }

    getEmployees() {
        return this.connection.promise().query(
            `SELECT
                id,
            CONCAT
                (first_name, ' ', last_name)
            AS
                employee
            FROM
                employee`
        );
    }

    getDepartments(){
        return this.connection.promise().query(
            `SELECT 
                id , 
                name  
            FROM department`
        );
    };

    getManagers() {
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
        this.connection.promise().query(
            `INSERT INTO
                role(title, salary, department_id)
            VALUES
                (?,?,?);

            INSERT INTO
                employee(first_name, last_name, manager_id,role_id)
            VALUES
                (?,?,?,
                (SELECT LAST_INSERT_ID())
                );                   
            `
            ,[
                employee.title, 
                employee.salary, 
                employee.department,
                employee.first_name,
                employee.last_name,
                employee.manager
            ]
        );
        // this.connection.promise().query(
        //     `INSERT INTO
        //         employee(first_name, last_name, manager_id,role_id)
        //     VALUES
        //         (?,
        //         ?,
        //         ?,
        //         (
        //             SELECT 
        //                 LAST_INSERT_ID()
        //         )
        //         );   
        //     `
        //     ,[ 
        //         employee.first_name,
        //         employee.last_name,
        //         employee.manager
        //     ]
        // );
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