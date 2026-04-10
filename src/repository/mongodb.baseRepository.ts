// import { InjectModel } from '@nestjs/mongoose';
// import { Document, Model, Query } from 'mongoose';

// export class baseMongodbRepository<Table,Document> {
//     constructor(
//         @InjectModel('TableName') private readonly docModel: Model<Document>
//     ) { }

//     async findWithPopulate(filter: any, populateFields: { [key: string]: string[] }): Promise<Document[]> {
//         let query: Query<Document[], Document> = this.requestModel.find(filter);

//         for (const [table, fields] of Object.entries(populateFields)) {
//             query = query.populate(table, fields.join(' ')); // Aplica populate dinámicamente
//         }

//         return query.exec(); // Esto debería funcionar correctamente si los tipos son compatibles
//     }
// }
