import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import { parseJson } from "../common/Common";
import { DbContext } from "../common/DbContext";
import { Employee } from "../entity/Employee";
import * as uuid from 'uuid';

interface CreateEmployeeRequest
{
    firstName:string;
    lastName:string;
    email:string;
    role:string;
}
export class CreateEmployee
{
    dbContext: DbContext;

    constructor()
    {
        this.dbContext = new DbContext();
    }
    create(req:CreateEmployeeRequest):Promise<Employee>
    {
        let employee = new Employee();
        employee.id = uuid.v4();
        employee.firstName = req.firstName;
        employee.lastName = req.lastName;
        employee.role = req.role
        employee.email = req.email;
        return this.dbContext.put('employees', employee).then(()=>
        {
            return employee;
        });
    }
}

export  function handler(event:APIGatewayEvent, context:APIGatewayEventRequestContext, done)
{
    let req = parseJson<CreateEmployeeRequest>(event.body);

    let createEmployee = new CreateEmployee()
    createEmployee.create(req).then((employee)=>
    {
        done(null, {
            status: 200,
            body: JSON.stringify({
                employee: employee,
                message: 'employee created'
            })
        });
    }).catch((err)=>
    {
        console.log(err);
        done(null, {
            status: 500,
            body: JSON.stringify({
                message: err.message
            })
        })
    });
}