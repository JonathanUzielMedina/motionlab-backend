"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSimulation = void 0;
const Match_1 = require("../models/Match");
const calculateSimulation = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "El cuerpo de la solicitud está vacío",
            payload: null,
            status: "Error",
        });
        return;
    }
    const { id } = req.params;
    const { pilotMass, chassisMass, additionalMass, motorPower } = req.body;
    // Constants
    const GRAVITY = 9.81;
    const HP_TO_WATTS = 745.7;
    const CM_TO_M = 0.01;
    const PIXELS_PER_METER = 30;
    const FRAME_RATE = 60; // frames per second
    const DELTA_TIME = 1 / FRAME_RATE; // time step in seconds
    const CAR_WIDTH = 50;
    const groundLevel = 80;
    try {
        const match = await Match_1.Match.findByPk(id);
        if (!match) {
            res.status(404).json({
                message: "No existe esa id de match",
                payload: null,
                status: "Error",
            });
            return;
        }
        const rpm = match.rpm;
        const wheelSize = match.wheel_size;
        const distance = match.distance;
        // Course configuration
        const rampStartX = 250;
        const rampEndX = rampStartX + distance * PIXELS_PER_METER;
        const rampHeight = 120;
        const platformLength = 120;
        const platformEndX = rampEndX + platformLength;
        const wallX = platformEndX;
        // Flag positions
        const startX = 50;
        const flag1X = rampStartX - 25;
        const flag2X = rampEndX;
        const flag3X = wallX - 25;
        // Tramos for progress calculation
        const tramo1Pixels = flag1X - startX;
        const tramo2Pixels = flag2X - flag1X;
        const tramo3Pixels = flag3X - flag2X;
        const totalCoursePixels = tramo1Pixels + tramo2Pixels + tramo3Pixels;
        // Helper functions
        const getTotalMass = () => pilotMass + chassisMass + additionalMass;
        const calculateMaxVelocity = () => {
            const radiansPerSecond = (rpm * 2 * Math.PI) / 60;
            const wheelCircumference = 2 * Math.PI * (wheelSize * CM_TO_M);
            return radiansPerSecond * wheelCircumference;
        };
        const calculateRampAngle = () => {
            const heightInMeters = rampHeight / PIXELS_PER_METER;
            const rampAngleRadians = Math.atan(heightInMeters / distance);
            return rampAngleRadians;
        };
        const calculateYPosition = (xPos) => {
            if (xPos < rampStartX) {
                return 0;
            }
            else if (xPos > rampEndX) {
                return rampHeight;
            }
            else {
                const rampProgress = (xPos - rampStartX) / (rampEndX - rampStartX);
                return rampProgress * rampHeight;
            }
        };
        const calculateTotalProgress = (xPos) => {
            if (xPos <= flag1X) {
                return ((xPos - startX) / totalCoursePixels) * 100;
            }
            else if (xPos <= flag2X) {
                const tramo1Percent = (tramo1Pixels / totalCoursePixels) * 100;
                const tramo2Progress = (xPos - flag1X) / tramo2Pixels;
                const tramo2Percent = tramo2Progress * ((tramo2Pixels / totalCoursePixels) * 100);
                return tramo1Percent + tramo2Percent;
            }
            else if (xPos <= flag3X) {
                const tramo1Percent = (tramo1Pixels / totalCoursePixels) * 100;
                const tramo2Percent = (tramo2Pixels / totalCoursePixels) * 100;
                const tramo3Progress = (xPos - flag2X) / tramo3Pixels;
                const tramo3Percent = tramo3Progress * ((tramo3Pixels / totalCoursePixels) * 100);
                return tramo1Percent + tramo2Percent + tramo3Percent;
            }
            else {
                return 100;
            }
        };
        const calculateAcceleration = (velocity, xPos) => {
            const totalMass = getTotalMass();
            if (totalMass <= 0 || motorPower <= 0) {
                return 0;
            }
            const maxVelocity = calculateMaxVelocity();
            const powerFactor = motorPower / 8;
            const baseAcceleration = 3 * powerFactor;
            const rpmFactor = rpm > 0 ? rpm / 3000 : 0.5;
            const rpmAdjustedAcceleration = baseAcceleration * rpmFactor;
            const massRatio = 130 / totalMass;
            const massAdjustedAcceleration = rpmAdjustedAcceleration * massRatio;
            const velocityRatio = maxVelocity > 0 ? velocity / maxVelocity : 0;
            const velocityFactor = Math.max(0, 1 - Math.pow(velocityRatio, 2));
            const velocityResistance = 0.05 * Math.pow(velocity, 2);
            let hillResistance = 0;
            if (xPos >= rampStartX && xPos <= rampEndX) {
                const rampAngle = calculateRampAngle();
                hillResistance = GRAVITY * Math.sin(rampAngle) * totalMass;
                const frictionCoefficient = 0.1;
                const frictionForce = frictionCoefficient * totalMass * GRAVITY * Math.cos(rampAngle);
                hillResistance += frictionForce;
            }
            const availablePower = motorPower * HP_TO_WATTS;
            const motorForce = velocity > 0.001 ? availablePower / velocity : availablePower * 10;
            const netForce = massAdjustedAcceleration * velocityFactor * totalMass -
                hillResistance -
                velocityResistance * totalMass;
            const finalAcceleration = netForce / totalMass;
            return finalAcceleration;
        };
        // Run simulation
        const simulationStates = [];
        let currentState = {
            time: 0,
            position: { x: 50, y: 0 },
            velocity: 0,
            acceleration: 0,
            distanceTraveled: 0,
            isGoalOneCompleted: false,
            isGoalTwoCompleted: false,
            isGoalThreeCompleted: false,
            statusMessage: "",
            statusType: "",
            completed: false,
        };
        // Calculate simulation for max 30 seconds (1800 frames at 60fps)
        const MAX_FRAMES = 1800;
        let completed = false;
        for (let frame = 0; frame < MAX_FRAMES && !completed; frame++) {
            // Store current state
            simulationStates.push({ ...currentState });
            // Calculate next state
            const acceleration = calculateAcceleration(currentState.velocity, currentState.position.x);
            let newVelocity = currentState.velocity + acceleration * DELTA_TIME;
            // Check if on ramp
            const isOnRamp = currentState.position.x >= rampStartX &&
                currentState.position.x <= rampEndX;
            // Prevent excessive downhill speed
            if (isOnRamp && newVelocity < 0) {
                newVelocity = Math.max(newVelocity, -3.0);
            }
            // Check if car stopped on ramp
            if (isOnRamp && Math.abs(newVelocity) < 0.05) {
                newVelocity = 0;
                const progressPercent = Math.round(calculateTotalProgress(currentState.position.x));
                currentState = {
                    ...currentState,
                    velocity: 0,
                    acceleration: 0,
                    statusMessage: `El carro se detuvo al ${progressPercent}% del recorrido total.`,
                    statusType: "warning",
                    completed: true,
                };
                simulationStates.push({ ...currentState });
                completed = true;
                break;
            }
            // Calculate new position
            const distanceIncrement = currentState.velocity * DELTA_TIME +
                0.5 * acceleration * Math.pow(DELTA_TIME, 2);
            const newDistanceTraveled = currentState.distanceTraveled + distanceIncrement;
            let newX = 50 + newDistanceTraveled * PIXELS_PER_METER;
            // Check if car cannot start or moves backwards
            if (newX < 50) {
                newX = 50;
                currentState = {
                    ...currentState,
                    position: { x: 50, y: 0 },
                    velocity: 0,
                    acceleration: 0,
                    distanceTraveled: 0,
                    statusMessage: "El carro no tiene suficiente potencia para subir la rampa.",
                    statusType: "error",
                    completed: true,
                };
                simulationStates.push({ ...currentState });
                completed = true;
                break;
            }
            // Check if car hits the wall
            if (newX + CAR_WIDTH >= wallX) {
                newX = wallX - CAR_WIDTH;
                currentState = {
                    ...currentState,
                    position: { x: newX, y: calculateYPosition(newX) },
                    velocity: 0,
                    acceleration: 0,
                    distanceTraveled: (newX - 50) / PIXELS_PER_METER,
                    isGoalThreeCompleted: true,
                    statusMessage: "¡Simulación completada con éxito!",
                    statusType: "success",
                    completed: true,
                    time: currentState.time + DELTA_TIME,
                };
                simulationStates.push({ ...currentState });
                completed = true;
                break;
            }
            // Update state
            const newY = calculateYPosition(newX);
            // Check goals
            const isRampBaseReached = newX >= rampStartX;
            const isRampTopReached = newX >= rampEndX;
            currentState = {
                time: currentState.time + DELTA_TIME,
                position: { x: newX, y: newY },
                velocity: newVelocity,
                acceleration: acceleration,
                distanceTraveled: newDistanceTraveled,
                isGoalOneCompleted: currentState.isGoalOneCompleted || isRampBaseReached,
                isGoalTwoCompleted: currentState.isGoalTwoCompleted || isRampTopReached,
                isGoalThreeCompleted: currentState.isGoalThreeCompleted,
                statusMessage: isRampTopReached && !currentState.isGoalTwoCompleted
                    ? "¡El carro ha llegado al final del recorrido con éxito!"
                    : currentState.statusMessage,
                statusType: isRampTopReached && !currentState.isGoalTwoCompleted
                    ? "success"
                    : currentState.statusType,
                completed: false,
            };
        }
        // Create final response
        const simulationResult = {
            initialParams: {
                rpm,
                wheelSize,
                distance,
                pilotMass,
                chassisMass,
                additionalMass,
                motorPower,
            },
            courseConfig: {
                rampStartX,
                rampEndX,
                rampHeight,
                platformLength,
                platformEndX,
                wallX,
                groundLevel,
                carWidth: CAR_WIDTH,
                flag1X,
                flag2X,
                flag3X,
            },
            simulationStates,
            finalState: {
                time: currentState.time,
                distanceTraveled: currentState.distanceTraveled,
                isGoalOneCompleted: currentState.isGoalOneCompleted,
                isGoalTwoCompleted: currentState.isGoalTwoCompleted,
                isGoalThreeCompleted: currentState.isGoalThreeCompleted,
                statusMessage: currentState.statusMessage,
                statusType: currentState.statusType,
            },
        };
        res.status(200).json({
            message: "Simulación calculada con éxito",
            payload: simulationResult,
            status: "Success",
        });
    }
    catch (error) {
        console.error("Error in calculateSimulation:", error);
        res.status(500).json({
            message: "Hubo un fallo en el servidor",
            payload: null,
            status: "Error",
        });
    }
};
exports.calculateSimulation = calculateSimulation;
