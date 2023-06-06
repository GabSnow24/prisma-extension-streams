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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStreams = exports.PrismaFindManyReadableStream = void 0;
const client_1 = require("@prisma/client");
const Readable_js_1 = require("./Readable.js");
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
                const _a = this.args, { batchSize } = _a, otherArgs = __rest(_a, ["batchSize"]);
                const items = yield this.prismaClient.findMany(Object.assign({ take: this.readableHighWaterMark, skip: this.cursorId ? 1 : 0, cursor: this.cursorId ? { id: this.cursorId } : undefined }, otherArgs));
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
//# sourceMappingURL=find-many-stream.js.map