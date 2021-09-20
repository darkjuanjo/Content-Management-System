const db = require('../db');
const inquirer = require('inquirer');
const validate = require('../lib/validate');

function viewAllEmployees() {
  return db.viewAllEmployees()
    .then(([rows]) => {
        return rows;
    });
};

function viewALLRoles() {
    return db.getRoles()
    .then(([rows]) => {
        return rows;
    });
}

function viewALLDepartments() {
    return db.getDepartments()
    .then(([rows]) => {
        return rows;
    });
}

function viewByDepartment() {
return db.getDepartments()
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
           return db.viewByDepartment(selected_department.department)
            .then(([rows]) => {
                return rows;
            });
        });
    });
};

function viewByManager() {
return db.getManagers()
    .then(rows => {
        let managers = [];
        rows[0].forEach(element => {
            const manager_Object = {
                name: element.manager,
                value: element.id
            }
            managers.push(manager_Object);
        });
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
        return db.viewByManager(selected_manager.manager)
            .then(([rows]) => {
                return rows;
            });
        });      
    });
};

function departmentBudget() {
    return db.getDepartments()
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
               return db.departmentBudget(selected_department.department)
                .then(([rows]) => {
                    return rows;
                });
            });
        });
    };

function addEmployee() {
    let data = [];
    let employee = {first_name:null,last_name:null,role:null,manager:null};
    return db.getRoles()
        .then(([rows]) => {
            let roles = [];
            rows.forEach(element => {
                const roles_Object = {
                    name: element.title,
                    value: element.id
                }
                roles.push(roles_Object);
            });
            data.push(roles);
            return data;
        })
        .then(result => {
            return db.getEmployees()
            .then(([rows]) => {
                let managers = [];
                rows.forEach(element => {
                    const manager_Object = {
                        name: element.employee,
                        value: element.id
                    }
                    managers.push(manager_Object);
                });
                managers.push({name: 'None',value:null});
                data.push(managers);
                return data;
            })
            .then(result => {
                let [roles,managers] = result;
                return inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: 'Please enter employees first name',
                            validate: first_nameInput => {
                                if(first_nameInput){
                                    return true;
                                } else {
                                    console.log("Please enter the employee's first name!");
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: 'Please enter employees last name',
                            validate: last_nameInput => {
                                if(last_nameInput){
                                    return true;
                                } else {
                                    console.log("Please enter the employee's last name!");
                                    return false;
                                }
                            }
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Please enter employees role',
                            choices: roles
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Please enter employees manager',
                            choices: managers,
                        },
                    ])
                    .then(employee_data => {
                        Object.assign(employee,employee_data);
                        return db.addEmployee(employee)
                        .then(() => db.viewAllEmployees()
                        .then(rows => {
                            return rows[0];
                        }))
                    });
            })
        });
};

function addRole() {
    return db.getDepartments()
    .then(rows => {
        let departments = [];
        rows[0].forEach(element => {
            const department_object = 
            {
                name: element.name,
                value: element.id
            }
            departments.push(department_object);
        });
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'Title',
                    message: "Please enter new Role Title (Required)",
                    validate: TitleInput => {
                        if(TitleInput){
                            return  true;
                        } else {
                            console.log("Please enter new Role Title!");
                            return false;
                        }
                    } 
                },
                {
                    type: 'input',
                    name: 'Salary',
                    message: "Please enter new Role's Salary (Required)",
                    validate: salaryInput => {
                        if(salaryInput){
                            return  true;
                        } else {
                            console.log("Please enter new Role's Salary!");
                            return false;
                        }
                    } 
                },
                {
                    type: 'list',
                    name: 'Department',
                    message: "Please enter new Role's Department (Required)",
                    choices: departments,
                    validate: departmentInput => {
                        if(departmentInput){
                            return  true;
                        } else {
                            console.log("Please enter new Role's Salary!");
                            return false;
                        }
                    } 
                },
            ])
            .then(new_role => {
                return db.addRole(new_role.Title, new_role.Salary, new_role.Department)
                    .then(() => db.getRoles()
                    .then(rows => {
                        return rows[0]
                    }));
            });
    });
}

function addDepartment() {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'department',
                    message: "Please enter the new Department (Required)",
                    validate: TitleInput => {
                        if(TitleInput){
                            return  true;
                        } else {
                            console.log("Please enter the new Department!");
                            return false;
                        }
                    } 
                },
            ])
            .then(new_department => {
                return db.addDepartment(new_department.department)
                    .then(() => db.getDepartments()
                    .then(rows => {
                        return rows[0]
                    }));
            });
}

function updateEmployeeInfo(type) {
    if(type === 'role')
    {
    return db.getEmployees().then(rows => {
        let employees = [] || null;
        let roles = [] || null;
        const employee = {};
        rows[0].forEach(element => {
            const employee_object = {
                name: element.employee,
                value: element.id
            }
            employees.push(employee_object);
        })
            return inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Please select employee to update',
                        choices: employees
                    }
                ])
                .then(selected_employee => {
                employee.id = selected_employee.employee;
                return db.getRoles()
                .then(rows => {
                    rows[0].forEach(element => {
                        const role_object = {
                            name: element.title,
                            value: element.id
                        }
                        roles.push(role_object);
                    });
                    return inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Please select new role',
                            choices: roles
                        }
                    ])
                    .then(selected_role => {
                        employee.role = selected_role.role;
                    return db.updateEmployeeRole(employee)
                    .then(() => db.viewAllEmployees()
                    .then(rows => {
                        return rows[0];
                    }))
                    });
                });
                });
        });
    }
    else if (type === 'manager') {
        return db.getEmployees().then(rows => {
            let employees = [] || null;
            let managers = [] || null;
            const employee = {};
            rows[0].forEach(element => {
                const employee_object = {
                    name: element.employee,
                    value: element.id
                }
                employees.push(employee_object);
            })
                return inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Please select employee to update',
                            choices: employees
                        }
                    ])
                    .then(selected_employee => {
                    employee.id = selected_employee.employee;
                    return db.getEmployees()
                    .then(rows => {
                        rows[0].forEach(element => {
                            if(employee.id != element.id)
                            {
                            const manager_object = {
                                name: element.employee,
                                value: element.id
                            }
                            managers.push(manager_object);
                            } else {
                                managers.push({name:'None',value:null});
                            }
                        });
                        return inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: 'Please select new manager',
                                choices: managers
                            }
                        ])
                        .then(selected_manager => {
                            employee.manager = selected_manager.manager;
                            console.log(employee);
                        return db.updateEmployeeManager(employee)
                        .then(() => db.viewAllEmployees()
                        .then(rows => {
                            return rows[0];
                        }))
                        });
                    });
                    });
            });
 
    }
};

function removeEmployee() {
    return db.getEmployees()
        .then(rows => {
            let employees = [];
            rows[0].forEach(element => {
                const employee_Object = {
                    name:  element.employee,
                    value: element.id
                };
                employees.push(employee_Object);
            });
            return employees;
        })
        .then(employees => {
            return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'delete_employee',
                    message: 'Choose employee to delete? (Required)',
                    choices: employees,
                    validate: delete_employeeInput => {
                        if(delete_employeeInput){
                            return  true;
                        } else {
                            console.log('Please choose an employee to delete!');
                            return false;
                        }
                    } 
                }
            ])
            .then(selected_employee => {
            return db.removeEmployee(selected_employee.delete_employee)
                .then(() => db.viewAllEmployees()
                .then(rows => {
                    return rows[0];
                }));               
            });
        });        
};

function removeRole() {
    return db.getRoles()
        .then(rows => {
            let roles = [];
            rows[0].forEach(element => {
                const role_Object = {
                    name:  element.title,
                    value: element.id
                };
                roles.push(role_Object);
            });
            return roles;
        })
        .then(roles => {
            return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'delete_role',
                    message: 'Choose role to delete? (Required)',
                    choices: roles,
                }
            ])
            .then(selected_role => {
            return db.removeRole(selected_role.delete_role)
                .then(() => db.getRoles()
                    .then(rows => {
                        return rows[0];
                    }));                
            });
        });        
};

function removeDepartment() {
    return db.getDepartments()
        .then(rows => {
            let departments = [];
            rows[0].forEach(element => {
                const department_Object = {
                    name:  element.name,
                    value: element.id
                };
                departments.push(department_Object);
            });
            return departments;
        })
        .then(departments => {
            return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'delete_department',
                    message: 'Choose department to delete? (Required)',
                    choices: departments, 
                }
            ])
            .then(selected_department => {
            return db.removeDepartment(selected_department.delete_department)
                .then(() => {
                    db.getDepartments()
                    .then(rows => {
                        return rows[0];
                    });
                });
                
            });
        });
        
        
};

function validateTables() {
    let validation = [];
    return db.getTotalDepartments()
    .then(([[result]]) => {
        validation.push({name:'Total_Departments' ,department_count:result.count});
    return db.getTotalRoles()
        .then(([[result]]) => {
            validation.push({name:'Total_Roles' ,role_count:result.count});
        return db.getTotalEmployees()
            .then(([[result]]) => {
                validation.push({name:'Total_Employees' ,employee_count:result.count});
                return validation;
            });
        });
    });
};

module.exports = {
    viewAllEmployees,
    viewALLRoles,
    viewALLDepartments,
    viewByDepartment,
    viewByManager,
    departmentBudget,
    addEmployee,
    addRole,
    addDepartment,
    updateEmployeeInfo,
    removeEmployee,
    removeRole,
    removeDepartment,
    validateTables
};