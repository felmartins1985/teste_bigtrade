// import { ItemType } from "src/infrastructure/item";
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import { DynamoTable } from "src/infrastructure/dynamodb.table";

// export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
//   console.log(event)
//   const item = {
//     pk : event.pathParameters.id,
//     sk: Date.now().toString(),
//     type: ItemType.REQUEST
//   }
//   const table = new DynamoTable('felipe-lambda-study-sbx-main')
//   const result = await table.putItem(item)
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: `The putItem function was executed as ${result}`,
//         input: item,
//       },
//       null,
//       2
//     ),
//   };
// };
