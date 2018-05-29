import { APIGatewayEvent, APIGatewayEventRequestContext } from "aws-lambda";
import { DbContext } from "../common/DbContext";
import { Employee } from "../entity/Employee";

export class GetEmployees
{
    dbContext: DbContext;

    constructor()
    {
        this.dbContext = new DbContext();
    }
    get(page='1', limit='10', search)
    {
        return this.dbContext.query<Employee>({
            TableName: 'employees'
        });
    }
}
export  function handler(event:APIGatewayEvent, context:APIGatewayEventRequestContext, done)
{
    let params = event.queryStringParameters || {};
    new GetEmployees().get(params.page, params.limit, params.search).then((employees)=>
    {
        done(null, {
            statusCode: 200,
            body: JSON.stringify({employees:employees})
        })

    }).catch((err)=>
    {
        console.log(err);
    });
}