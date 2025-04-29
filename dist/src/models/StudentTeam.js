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
exports.StudentTeam = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Student_1 = require("./Student");
const Team_1 = require("./Team");
let StudentTeam = class StudentTeam extends sequelize_typescript_1.Model {
    id_student;
    id_team;
    student;
    team;
};
exports.StudentTeam = StudentTeam;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => Student_1.Student),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], StudentTeam.prototype, "id_student", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.ForeignKey)(() => Team_1.Team),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], StudentTeam.prototype, "id_team", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Student_1.Student, {
        foreignKey: "id_student",
    }),
    __metadata("design:type", Student_1.Student)
], StudentTeam.prototype, "student", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Team_1.Team, {
        foreignKey: "id_team",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Team_1.Team)
], StudentTeam.prototype, "team", void 0);
exports.StudentTeam = StudentTeam = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "student_team",
        timestamps: false,
    })
], StudentTeam);
