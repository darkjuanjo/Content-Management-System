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

    getRoles(){
        return this.connection.promise().query(
            `SELECT DISTINCT
            role.id , 
            role.title,
            department.name
        AS
            department
        FROM 
            role
        JOIN 
            department
        ON
            role.department_id = department.id;
            `
        );
    };

    getManagers() {
        return this.connection.promise().query(
            `
            SELECT DISTINCT
                manager.id,
            CONCAT
                (manager.first_name, ' ', manager.last_name) 
            AS 
                manager
            FROM
                employee manager

            JOIN 
                employee 
            ON 
                manager.id = employee.manager_id;
`
        );
    };

    getTotalEmployees() {
        return this.connection.promise().query(
            `
            SELECT 
                COUNT(*)
            AS
                count
            FROM
                employee`
        );
    };

    getTotalRoles() {
        return this.connection.promise().query(
            `
            SELECT 
                COUNT(*)
            AS
                count
            FROM
                role`
        );
    };

    getTotalDepartments() {
        return this.connection.promise().query(
            `
            SELECT 
                COUNT(*)
            AS
                count
            FROM
                department`
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

    departmentBudget(department) {
        return this.connection.promise().query(
                `
            SELECT 
                department.name 
            AS 
                department, 
                SUM(role.salary) total_budget
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
                role.department_id = ?;
                `
                ,department
        );
    };

    addDepartment(department) {
        return this.connection.promise().query(
            `INSERT INTO 
                department (name) 
            VALUES 
                (?);
            `
            , department
        );
    };

    addEmployee(employee) {
        let sql =             
                    `INSERT INTO
                    employee (first_name, last_name, role_id, manager_id)
                VALUES
                    (?,?,?,?);             
                    `;
        let params = [employee.first_name, employee.last_name, employee.role, employee.manager];
      return  this.connection
      .promise()
      .query(sql,params, (err,rows) => {
          if(err)
          {
              return err.message;
          }
          return {message:'Employee added sucessfully!', data: rows}
      });
    };

    addRole(title, salary, department) {
        return  this.connection.promise().query(
              `INSERT INTO
                  role(title, salary, department_id)
              VALUES
                  (?,?,?);                  
              `
              ,[
                  title, 
                  salary, 
                  department,
              ]
          );
    };

    updateEmployeeRole(employee_data) {
        return this.connection.promise().query(
            `
            UPDATE 
                employee
            SET 
                employee.role_id = ?
            WHERE 
                employee.id = ?;
            `
            , [employee_data.role, employee_data.id]
        );
    };

    updateEmployeeManager(employee) {
        return this.connection.promise().query(
            `
            UPDATE 
                employee
            SET 
                employee.manager_id = ?
            WHERE 
                employee.id = ?;
            `
            , [employee.manager, employee.id]
        );
    };

    updateRoleDepartment(employee_data) {
        return this.connection.promise().query(
            `
            UPDATE 
                role
            SET 
                role.department_id = ?
            WHERE 
                role.id = ?;
            `
            , [employee_data.department, employee_data.role]
        );
    };

    removeEmployee(employee_id){
        return this.connection.promise().query(
            `DELETE 
            FROM 
                employee 
            WHERE
                employee.id = ?
                `,
            employee_id
        );
    }

    removeRole(role_id){
        return this.connection.promise().query(
            `DELETE 
            FROM 
                role 
            WHERE
                role.id = ?
                `,
            role_id
        );
    }

    removeDepartment(department_id){
        return this.connection.promise().query(
            `DELETE 
            FROM 
                department 
            WHERE
                department.id = ?
                `,
            department_id
        );
    }
};

module.exports = new DB(connection);