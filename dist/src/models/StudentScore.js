"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentScore = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Student_1 = require("./Student");
const Round_1 = require("./Round");
let StudentScore = class StudentScore extends sequelize_typescript_1.Model {
    score;
    time;
    position;
    student_id;
    round_id;
    student;
    round;
};
exports.StudentScore = StudentScore;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], StudentScore.prototype, "score", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
    }),
    __metadata("design:type", Number)
], StudentScore.prototype, "time", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], StudentScore.prototype, "position", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Student_1.Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], StudentScore.prototype, "student_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Round_1.Round),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], StudentScore.prototype, "round_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Student_1.Student, {
        foreignKey: "student_id",
        constraints: false,
    }),
    __metadata("design:type", Student_1.Student)
], StudentScore.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Round_1.Round, {
        foreignKey: "round_id",
        constraints: false,
    }),
    __metadata("design:type", Round_1.Round)
], StudentScore.prototype, "round", void 0);
exports.StudentScore = StudentScore = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "student_scores",
        timestamps: true,
        updatedAt: false,
    })
], StudentScore);
