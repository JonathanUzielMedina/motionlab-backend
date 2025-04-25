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
exports.Student = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const StudentTeam_1 = require("./StudentTeam");
const StudentScore_1 = require("./StudentScore");
let Student = class Student extends sequelize_typescript_1.Model {
    played_rounds;
    average_time;
    average_match_position;
    average_historic_position;
    studentTeams;
    student_scores;
};
exports.Student = Student;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Student.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Student.prototype, "played_rounds", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
    }),
    __metadata("design:type", Number)
], Student.prototype, "average_time", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Student.prototype, "average_match_position", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Student.prototype, "average_historic_position", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => StudentTeam_1.StudentTeam),
    __metadata("design:type", Array)
], Student.prototype, "studentTeams", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => StudentScore_1.StudentScore),
    __metadata("design:type", Array)
], Student.prototype, "student_scores", void 0);
exports.Student = Student = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "students",
        timestamps: false,
    })
], Student);
