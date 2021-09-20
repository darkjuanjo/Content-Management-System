const inquirer = require('inquirer');
const db_functions = require('./lib/db_functions');
const console_table = require('console.table');
const { getTotalRoles } = require('./db');

console.log(`
################################################################ 
#                                                              #
#   #######                                                    #
#   #       #    # #####  #       ####  #   # ###### ######    #
#   #       ##  ## #    # #      #    #  # #  #      #         #
#   #####   # ## # #    # #      #    #   #   #####  #####     #
#   #       #    # #####  #      #    #   #   #      #         #
#   #       #    # #      #      #    #   #   #      #         #
#   ####### #    # #      ######  ####    #   ###### ######    #
#                                                              #
#   #     #                                           ###      #
#   ##   ##   ##   #    #   ##    ####  ###### #####  ###      #   
#   # # # #  #  #  ##   #  #  #  #    # #      #    # ###      #   
#   #  #  # #    # # #  # #    # #      #####  #    #  #       #    
#   #     # ###### #  # # ###### #  ### #      #####           #    
#   #     # #    # #   ## #    # #    # #      #   #  ###      #   
#   #     # #    # #    # #    #  ####  ###### #    # ###      #
#                                                              #
################################################################                                
                                                        `);

//Show Menu Prompt
const DisplayEmployeeManagementOptions = () => {
  return db_functions.validateTables()
    .then(result => {
        let [{department_count}, {role_count},{employee_count}] = result;
        let choices = [];
        if(employee_count > 0 && department_count > 0 && role_count > 0) {
            choices = [
                'View All Employees',
                'View All Roles',
                'View All Departments',
                'View All Employees By Department',
                'View All Employees by Manager',
                'View Budget by Deparment',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Update Employee Manager',
                'Update Employee Role',
                'Update Employee Department',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Exit'
            ];
        } 
        
        if(department_count <= 0)
        {
            choices = [
                'Add Department',
                'Exit'
            ];
        }
        if(role_count <= 0)
        {
            choices = [
            'Add Role',
            'Exit'
            ];
        }
    
        if(employee_count <= 0)
        {
            choices = [
            'Add Employee',
            'Exit'
            ];
        }
      
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What do you want to do? (Required)',
                choices: choices,
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

    });
};

//Execute action
function Actions(action) {  
    switch (action) {
        case 'View All Employees':
        db_functions.viewAllEmployees().then(response => {
            console.table(response);
            run();
        });
        break;
            case 'View All Roles':
            db_functions.viewALLRoles().then(response => {
                console.table(response);
                run();
            });
            break;
                case 'View All Departments':
                db_functions.viewALLDepartments().then(response => {
                    console.table(response);
                    run();
                });
                break;
                    case 'View All Employees By Department':
                        db_functions.viewByDepartment()
                        .then(employees => {
                            console.table(employees)
                            run();
                        });
                        break;
                        case 'View All Employees by Manager':
                            db_functions.viewByManager()
                            .then(response => {
                                console.table(response);
                                run();
                            });
                            break;
                            case 'View Budget by Deparment':
                                db_functions.departmentBudget().then(response => {
                                    console.table(response);
                                    run();
                                });
                                break; 
                                case 'Add Employee':
                                    db_functions.addEmployee()
                                    .then(response => {
                                        console.table(response);
                                        run();
                                    });
                                    break;
                                    case 'Add Role':
                                        db_functions.addRole()
                                        .then(response => {
                                            console.table(response);
                                            run();
                                        });
                                    break;
                                        case 'Add Department':
                                            db_functions.addDepartment()
                                            .then(response => {
                                                console.table(response);
                                                run();
                                            });
                                        break;
                                            case 'Update Employee Role':
                                                db_functions.updateEmployeeInfo('role')
                                                .then(response => {
                                                    console.table(response);
                                                    run();
                                                });
                                                break;
                                                case 'Update Employee Manager':
                                            db_functions.updateEmployeeInfo('manager')
                                            .then(response => {
                                                console.table(response);
                                                run();
                                            });
                                            break;
                                                    case 'Remove Employee':
                                            db_functions.removeEmployee()
                                            .then(response => {
                                                console.table(response);
                                                run();
                                            });
                                            break;
                                                        case 'Remove Role':
                                                            db_functions.removeRole()
                                                            .then(response => {
                                                                console.table(response);
                                                                run();
                                                            });
                                                            break;
                                                            case 'Remove Department':
                                                        db_functions.removeDepartment()
                                                        .then(response => {
                                                            console.table(response);
                                                            run();
                                                        });
                                                        break;
    };
};

function run(){
  DisplayEmployeeManagementOptions()
    .then(response => {
        if(response !== 'Exit')
        {
           Actions(response);
        }
        else {
            console.log('Bye Bye! :D');
            process.exit();
        }
    })
};

run();


