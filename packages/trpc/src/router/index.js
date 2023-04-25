"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trpc_1 = require("../trpc");
var example_1 = require("./example");
var appRouter = (0, trpc_1.mergeRouters)(example_1.default);
exports.default = appRouter;
