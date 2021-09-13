const inquirer = require('inquirer');
const db = require('./db/connection');


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
        return selected_action.action
    });
};

DisplayEmployeeManagementOptions()
.then(response => console.log(response));
