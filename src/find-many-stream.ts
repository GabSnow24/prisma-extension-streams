import { Prisma } from "@prisma/client";
import { Readable } from "./Readable.js";

export interface IPrismaFindManyOptions {
    searchStatement: any
};

interface IPrismaFindManyReadableStreamOpts<T, A> {
    prismaClient: T;
    batchSize: number;
    args: any;
}

export class PrismaFindManyReadableStream<T, A> extends Readable<Prisma.Result<T, A, "findUnique">>{
    private readonly prismaClient: T | undefined;
    private cursorId: number | undefined;
    private readonly args: IPrismaFindManyReadableStreamOpts<T, A>['args'];

    constructor(opts?: IPrismaFindManyReadableStreamOpts<T, A>) {
        super({
            objectMode: true,
            highWaterMark: opts?.batchSize,
        });
        this.prismaClient = opts?.prismaClient;
        this.args = opts?.args;
    }

    public override async _read() {
        try {
            const { batchSize, ...otherArgs} = this.args
            const items: Prisma.Result<T, A, "findMany"> = await (this as any).prismaClient.findMany({
                take: this.readableHighWaterMark,
                skip: this.cursorId ? 1 : 0,
                cursor: this.cursorId ? { id: this.cursorId } : undefined,
                ...otherArgs
            });
            for (const item of items) {
                //@ts-ignore
                this.push(item);
            }
            if (items.length < this.readableHighWaterMark) {
                this.push(null);
                return;
            }
            this.cursorId = items[items.length - 1]['id'];
        } catch (err) {
            this.destroy(err as Error);
        }
    }
}

export const PrismaStreams = Prisma.defineExtension({
    model: {
        $allModels: {
            findManyStream<T, A>(this: T, args?: Prisma.Exact<A, Prisma.Args<T, 'findMany'>> & { batchSize: number }): Readable<Prisma.Result<T, A, "findUnique">> {
                const { batchSize } = args
                return new PrismaFindManyReadableStream({ prismaClient: this, batchSize, args });
            },
        },
    },
})

