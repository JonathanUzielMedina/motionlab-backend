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
exports.TeamStats = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Team_1 = require("./Team");
let TeamStats = class TeamStats extends sequelize_typescript_1.Model {
    played_rounds;
    average_time;
    average_position;
    team_id;
    team;
};
exports.TeamStats = TeamStats;
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], TeamStats.prototype, "played_rounds", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], TeamStats.prototype, "average_time", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], TeamStats.prototype, "average_position", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Team_1.Team),
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.INTEGER),
    __metadata("design:type", Number)
], TeamStats.prototype, "team_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Team_1.Team),
    __metadata("design:type", Team_1.Team)
], TeamStats.prototype, "team", void 0);
exports.TeamStats = TeamStats = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "team_stats",
        timestamps: false,
    })
], TeamStats);
