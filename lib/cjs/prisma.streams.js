"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStreams = exports.PrismaFindManyReadableStream = void 0;
const client_1 = require("@prisma/client");
const Readable_js_1 = require("../core/Readable.js");
;
class PrismaFindManyReadableStream extends Readable_js_1.Readable {
    constructor(opts) {
        super({
            objectMode: true,
            highWaterMark: opts === null || opts === void 0 ? void 0 : opts.batchSize,
        });
        this.prismaClient = opts === null || opts === void 0 ? void 0 : opts.prismaClient;
        this.args = opts === null || opts === void 0 ? void 0 : opts.args;
    }
    _read() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.prismaClient.findMany(Object.assign({ take: this.readableHighWaterMark, skip: this.cursorId ? 1 : 0, cursor: this.cursorId ? { id: this.cursorId } : undefined }, this.args));
                for (const item of items) {
                    //@ts-ignore
                    this.push(item);
                }
                if (items.length < this.readableHighWaterMark) {
                    this.push(null);
                    return;
                }
                this.cursorId = items[items.length - 1]['id'];
            }
            catch (err) {
                this.destroy(err);
            }
        });
    }
}
exports.PrismaFindManyReadableStream = PrismaFindManyReadableStream;
exports.PrismaStreams = client_1.Prisma.defineExtension({
    model: {
        $allModels: {
            findManyStream(args) {
                const { batchSize } = args;
                return new PrismaFindManyReadableStream({ prismaClient: this, batchSize, args });
            },
        },
    },
});
//# sourceMappingURL=prisma.streams.js.map