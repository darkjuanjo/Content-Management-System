const inquirer = require('inquirer');
const db_functions = require('./lib/db_functions');
const cTable = require('console.table');
const db = require('./db');


//Show Menu Prompt
const DisplayEmployeeManagementOptions = () => {
    console.log(`Employee Management System`);
    return inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do? (Required)',
            choices: [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager'
            ],
            validate: actionInput => {
                if(actionInput){
                    return  true;
                } else {
                    console.log('Please enter choose an action!');
                    return false;
                }
            } 
        }
    ])
    .then(selected_action => {
        return selected_action.action;
    });
};

//Execute action
function Actions(action) {
    switch (action) {
        case 'View All Employees':
        db_functions.viewAllEmployees();
        break;
        case 'View All Employees By Department':
            db_functions.viewByDepartment()
            .then(employees => console.table(employees));
        break;
            case 'View All Employees by Manager':
                db_functions.viewByManager();
                break;
                case 'Add Employee':
                    db_functions.addEmployee();
                    break;
                    case 'Remove Employee':
                        db_functions.removeEmployee();
                        break;
                        case 'Update Employee Role':
                            db_functions.updateInfo('role');
                            break;
                            case 'Update Employee Manager':
                                db_functions.updateInfo('manager');
                                break;
    }
}

DisplayEmployeeManagementOptions()
.then(response => Actions(response));
