import { Prisma } from "@prisma/client";
import { Readable } from "../core/Readable.js";
export interface IPrismaFindManyOptions {
    searchStatement: any;
}
interface IPrismaFindManyReadableStreamOpts<T, A> {
    prismaClient: T;
    batchSize: number;
    args: any;
}
export declare class PrismaFindManyReadableStream<T, A> extends Readable<Prisma.Result<T, A, "findUnique">> {
    private readonly prismaClient;
    private cursorId;
    private readonly args;
    constructor(opts?: IPrismaFindManyReadableStreamOpts<T, A>);
    _read(): Promise<void>;
}
export declare const PrismaStreams: (client: any) => import("@prisma/client").PrismaClientExtends<{
    result: {};
    model: {
        $allModels: {
            findManyStream: () => <T, A>(this: T, args?: Prisma.Exact<A, Prisma.Args<T, "findMany">> & {
                batchSize: number;
            }) => Readable<Prisma.Result<T, A, "findUnique">>;
        };
    };
    query: {};
    client: {};
}>;
export {};
