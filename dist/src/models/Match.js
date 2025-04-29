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
exports.Match = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Teacher_1 = require("./Teacher");
const Round_1 = require("./Round");
const Team_1 = require("./Team");
let Match = class Match extends sequelize_typescript_1.Model {
    teams;
    members;
    rpm;
    wheel_size;
    distance;
    code;
    active;
    start_time;
    end_time;
    teacher_id;
    teacher;
    rounds;
    team;
};
exports.Match = Match;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Match.prototype, "teams", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Match.prototype, "members", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
    }),
    __metadata("design:type", Number)
], Match.prototype, "rpm", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
    }),
    __metadata("design:type", Number)
], Match.prototype, "wheel_size", void 0);
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.FLOAT,
    }),
    __metadata("design:type", Number)
], Match.prototype, "distance", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Match.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        allowNull: false,
    }),
    __metadata("design:type", Boolean)
], Match.prototype, "active", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Match.prototype, "start_time", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Match.prototype, "end_time", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Teacher_1.Teacher),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Match.prototype, "teacher_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Teacher_1.Teacher, {
        foreignKey: "teacher_id",
        constraints: false,
    }),
    __metadata("design:type", Teacher_1.Teacher)
], Match.prototype, "teacher", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Round_1.Round),
    __metadata("design:type", Array)
], Match.prototype, "rounds", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Team_1.Team),
    __metadata("design:type", Array)
], Match.prototype, "team", void 0);
exports.Match = Match = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "matches",
        timestamps: false,
    })
], Match);
