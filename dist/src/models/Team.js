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
exports.Team = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Match_1 = require("./Match");
const TeamScore_1 = require("./TeamScore");
const TeamStats_1 = require("./TeamStats");
const StudentTeam_1 = require("./StudentTeam");
let Team = class Team extends sequelize_typescript_1.Model {
    ready;
    match_id;
    match;
    team_scores;
    team_stats;
    studentTeams;
};
exports.Team = Team;
__decorate([
    (0, sequelize_typescript_1.AllowNull)(false),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Team.prototype, "ready", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Match_1.Match),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Team.prototype, "match_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Team, {
        foreignKey: "match_id",
        constraints: false,
    }),
    __metadata("design:type", Match_1.Match)
], Team.prototype, "match", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => TeamScore_1.TeamScore),
    __metadata("design:type", Array)
], Team.prototype, "team_scores", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => TeamStats_1.TeamStats),
    __metadata("design:type", TeamStats_1.TeamStats)
], Team.prototype, "team_stats", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => StudentTeam_1.StudentTeam, { onDelete: "CASCADE" }),
    __metadata("design:type", Array)
], Team.prototype, "studentTeams", void 0);
exports.Team = Team = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "teams",
        timestamps: false,
    })
], Team);
