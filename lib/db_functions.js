const db = require('../db');
const inquirer = require('inquirer');
const validate = require('../lib/validate');

function viewAllEmployees() {
    db.viewAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.table(employees);
    });
};

function viewByDepartment() {
    db.getDepartments()
    .then(([rows]) => {
        let departments = [];
        rows.forEach(element => {
            const department_Object = {
                name: element.name,
                value: element.id
            }
            if(departments.length == 0 || validate(department_Object.name,departments) === false)
            departments.push(department_Object);
        });
        departments.push(new inquirer.Separator( "-- End of List --" ));
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Choose Department to see? (Required)',
                choices: departments,
                validate: departmentInput => {
                    if(departmentInput){
                        return  true;
                    } else {
                        console.log('Please choose a department!');
                        return false;
                    }
                } 
            }
        ])
        .then(selected_department => {
            db.viewByDepartment(selected_department.department)
            .then(([rows]) => {
                let employees = rows;
                console.table(employees);
            });
        });
    });
};

function viewByManager() {
    db.getManagers()
    .then(rows => {
        let managers = [];
        rows[0].forEach(element => {
            const manager_Object = {
                name: element.manager,
                value: element.manager_id
            }
            if(managers.length == 0 || validate(manager_Object.name,managers) === false)
            managers.push(manager_Object);
        });
        managers.push(new inquirer.Separator( "-- End of List --" ));
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Select Manager? (Required)',
                choices: managers,
                validate: managerInput => {
                    if(managerInput){
                        return  true;
                    } else {
                        console.log('Please select a manager!');
                        return false;
                    }
                } 
            }
        ])
        .then(selected_manager => {
            console.log(selected_manager.manager);
            db.viewByManager(selected_manager.manager)
            .then(([rows]) => {
                let employees = rows;
                console.table(employees);
            });
        });      
    });
};

async function addEmployee() {
    let data = await getData();
    const departments = data[0];
    const managers = data[1];
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "Please provide the employee's first name. (Required)",
                validate: firstnameInput => {
                    if(firstnameInput){
                        return  true;
                    } else {
                        console.log("Please enter the employee's first name!");
                        return false;
                    }
                } 
            },
            {
                type: 'input',
                name: 'last_name',
                message: "Please provide the employee's last name. (Required)",
                validate: lastnameInput => {
                    if(lastnameInput){
                        return  true;
                    } else {
                        console.log("Please enter the employee's last name!");
                        return false;
                    }
                } 
            },
            {
                type: 'input',
                name: 'title',
                message: "Please provide the employee's title. (Required)",
                validate: titleInput => {
                    if(titleInput){
                        return  true;
                    } else {
                        console.log("Please enter the employee's title!");
                        return false;
                    }
                } 
            },
            {
                type: 'list',
                name: 'department',
                message: 'Choose Department? (Required)',
                choices: departments,
                validate: departmentInput => {
                    if(departmentInput){
                        return  true;
                    } else {
                        console.log('Please choose a department!');
                        return false;
                    }
                } 
            },
            {
                type: 'input',
                name: 'salary',
                message: "Please provide the employee's salary. (Required)",
                validate: salaryInput => {
                    if(salaryInput){
                        return  true;
                    } else {
                        console.log("Please enter the employee's salary!");
                        return false;
                    }
                } 
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Select Manager? (Required)',
                choices: managers,
                validate: managerInput => {
                    if(managerInput){
                        return  true;
                    } else {
                        console.log('Please select a manager!');
                        return false;
                    }
                } 
            }
        ])
        .then(employee => db.addEmployee(employee));
}

function getData(){
    let data = [];

 db.getDepartments()
    .then(([rows]) => {
        let departments = [];
        rows.forEach(element => {
            const department_Object = {
                name: element.name,
                value: element.id
            }
            if(departments.length == 0 || validate(department_Object.name,departments) === false)
            departments.push(department_Object);
        });
        data.push(departments);
    });
return db.getEmployees()
        .then(rows => {
            let employees = [];
            rows[0].forEach(element => {
                const employee_Object = {
                    name: element.employee,
                    value: element.id
                }
                if(employees.length == 0 || validate(employee_Object.name,employees) === false)
                employees.push(employee_Object);
            });
            employees.push({name:'None', value: null});
            employees.push(new inquirer.Separator( "-- End of List --" ));
            data.push(employees);
            return data;
        });
};

module.exports = {
    viewAllEmployees,
    viewByDepartment,
    viewByManager,
    addEmployee
};