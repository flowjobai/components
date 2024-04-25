import { RDSDataClient, ExecuteStatementCommand, BatchExecuteStatementCommand } from "@aws-sdk/client-rds-data";
import { SqlParameter } from "@aws-sdk/client-rds-data/dist-types/models/models_0";
// @ts-ignore
import speeddate from "speed-date";

console.log("Initializing data api", process.env.DATA_API_ARN);

let rdsDataApi: RDSDataClient;
if (process.env.ACCESS_KEY_ID && process.env.SECRET_ACCESS_KEY) {
    rdsDataApi = new RDSDataClient({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID!,
            secretAccessKey: process.env.SECRET_ACCESS_KEY!,
        },
        region: process.env.REGION,
    });
} else {
    rdsDataApi = new RDSDataClient({
        region: process.env.REGION,
    });
}

const database = {
    resourceArn: process.env.DATA_API_ARN,
    secretArn: process.env.DATA_API_SECRET_ARN,
    database: process.env.DATA_API_DATABASE,
};

export interface Field {
    type: "string" | "number" | "boolean" | "json" | "date";
    value: any;
    fmt: string;
}

class ExecuteResult {
    constructor(public rows: Record<string, Field>[], public updated: number) {}

    single() {
        return this.rows[0];
    }
    singleValues() {
        return Object.fromEntries(Object.entries(this.rows[0]).map(([key, field]) => [key, field.value]));
    }
    formatted() {
        return Object.fromEntries(Object.entries(this.rows).map(([key, field]) => [key, field.fmt]));
    }
    values() {
        return Object.fromEntries(Object.entries(this.rows).map(([key, field]) => [key, field.value]));
    }
}



//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rds-data/command/ExecuteStatementCommand/
export async function execute(sql: string, params?: Record<string, any>): Promise<ExecuteResult> {
    const parameters: SqlParameter[] = params ? Object.entries(params).map(([key, value]) => asParameter(key, value)) : [];
    const command = new ExecuteStatementCommand({
        sql,
        parameters,
        ...database,
        includeResultMetadata: true,
    });
    // try {
    const rows: Record<string, any>[] = [];
    const { columnMetadata, records, numberOfRecordsUpdated } = await rdsDataApi.send(command);
    if (columnMetadata && records) {
        //console.log(columnMetadata, records)
        for (const record of records) {
            // A record is an array of fields matching the columnMetadata array
            // [
            //     { longValue: 3 },
            //     { stringValue: 'apollo-contacts-export - 2024-03-27T095203.105.csv' },
            //     { isNull: true },
            //     { stringValue: '2024-04-09 17:48:17.510924' }
            const row: Record<string, any> = {};
            for (let i = 0; i < columnMetadata.length; i++) {
                const { name, typeName } = columnMetadata[i];
                const field = record[i];
                // Look for a null, then get the value irrespective of the key, which is longValue, stringValue...
                const value = field.isNull ? null : Object.values(field)[0];
                switch (typeName) {
                    case "timestamp":
                        const date = new Date(value);
                        row[name!] = {
                            type: "date",
                            value: date,
                            fmt: value === null ? "" : speeddate.cached("DD MMM HH:mm", date),
                        };
                        break;
                    case "int4":
                        row[name!] = {
                            type: "number",
                            value,
                            fmt: value === null ? "" : value.toLocaleString("en-US"),
                        };
                        break;
                    default:
                        row[name!] = {
                            type: "string",
                            value,
                            fmt: value === null ? "" : value,
                        }; // The value is already the correct type
                }
            }
            rows.push(row);
        }
    }
    return new ExecuteResult(rows, numberOfRecordsUpdated || 0);
    // }
    // catch (err) {
    //     return err;
    // }
}

// Convert the deeper detailed fields to just the fmt value
export function formatted(rows: Record<string, Field>[]): Record<string, string>[] {
    return rows.map((row) => Object.fromEntries(Object.entries(row).map(([key, field]) => [key, field.fmt])));
}

export async function batch(sql: string, params: Record<string, any>[]) {
    homogeniseFields(sql, params);
    const parameterSets: SqlParameter[][] = params ? params.map((param) => Object.entries(param).map(([key, value]) => asParameter(key, value))) : [];
    const command = new BatchExecuteStatementCommand({
        sql,
        parameterSets,
        ...database,
    });
    const result = await rdsDataApi.send(command);
}

function asParameter(key: string, value: any): SqlParameter {
    if (value === null || value === undefined) {
        return { name: key, value: { isNull: true } };
    }
    switch (typeof value) {
        case "string":
            return { name: key, value: { stringValue: value } };
        case "number":
            return { name: key, value: { longValue: value } };
        case "boolean":
            return { name: key, value: { booleanValue: value } };
        case "object":
            if (value instanceof Date) {
                return { name: key, value: { stringValue: value.toISOString() } };
            }
            return { name: key, value: { stringValue: JSON.stringify(value) } };
        default:
            return { name: key, value: { stringValue: JSON.stringify(value) } };
    }
}

// Add entries with null for missing fields
export function homogeniseFields(sql: string, rows: Record<string, any>[]) {
    // Find all the fields in the SQL - fields start with a colon
    const fields = sql.match(/:([a-zA-Z0-9_]+)/g)?.map((field) => field.slice(1)) as string[];
    for (const row of rows) {
        for (const field of fields) {
            if (!row[field]) {
                row[field] = null;
            }
        }
    }
}
