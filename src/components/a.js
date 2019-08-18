"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
class App extends vue_1.default {
    constructor() {
        super();
        console.log('这是一个子模块');
    }
}
exports.default = App;
