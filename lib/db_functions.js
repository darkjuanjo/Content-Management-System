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
    db.getManager()
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

// function addEmployee() {
//     return inquirer
//         .prompt([
//             {
//                 type: 'input',
//                 name: 'first_name',
//                 message: "Please provide the employee's first name. (Required)",
//                 validate: firstnameInput => {
//                     if(firstnameInput){
//                         return  true;
//                     } else {
//                         console.log("Please enter the employee's first name!");
//                         return false;
//                     }
//                 } 
//             },
//             {
//                 type: 'input',
//                 name: 'last_name',
//                 message: "Please provide the employee's last name. (Required)",
//                 validate: lastnameInput => {
//                     if(lastnameInput){
//                         return  true;
//                     } else {
//                         console.log("Please enter the employee's last name!");
//                         return false;
//                     }
//                 } 
//             },
//         ])
// }

module.exports = {
    viewAllEmployees,
    viewByDepartment,
    viewByManager
};