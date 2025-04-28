import { Request, Response, RequestHandler } from "express";
import { Match } from "../models/Match";

export const calculateSimulation: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (!req.body) {
    res.status(500).json({
      message: "La solicitud no contiene informacion",
      status: "error",
      payload: null,
    });
    return;
  }

  const { pilotMass, chassisMass, additionalMass, motorPower, matchId } =
    req.body;
  try {
    const matchInfo = await Match.findByPk(matchId);
    console.log(matchInfo);
    if (!matchInfo) {
      res.status(500).json({
        message: "No existe la partida de la que se solicitaron los parametros",
        status: "error",
        payload: null,
      });
      return;
    }
    const rpm = matchInfo.dataValues.rpm;
    const wheelSize = matchInfo.dataValues.wheel_size;
    const distance = matchInfo.dataValues.distance;
    const GRAVITY = 9.81;
    const HP_TO_WATTS = 745.7;
    const CM_TO_M = 0.01;
    const PIXELS_PER_METER = 30;
    const groundLevel = 200;
    const CAR_WIDTH = 50;
    const rampStartX = 250;
    const rampEndX = rampStartX + distance * PIXELS_PER_METER;
    const rampHeight = 120;
    const platformLength = 120;
    const platformEndX = rampEndX + platformLength;
    const wallX = platformEndX;
    const startX = 50;
    const flag1X = rampStartX - 25;
    const flag2X = rampEndX;
    const flag3X = wallX - 25;
    const tramo1Pixels = flag1X - startX;
    const tramo2Pixels = flag2X - flag1X;
    const tramo3Pixels = flag3X - flag2X;
    const totalCoursePixels = tramo1Pixels + tramo2Pixels + tramo3Pixels;

    // Calcular masa total
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

    const calculateAccelerationForSimulation = (
      velocity: number,
      position: any
    ) => {
      const totalMass = getTotalMass();
      if (totalMass <= 0 || motorPower <= 0) {
        return 0;
      }

      const maxVelocity = calculateMaxVelocity();
      console.log(maxVelocity);
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
      if (position.x >= rampStartX && position.x <= rampEndX) {
        const rampAngle = calculateRampAngle();

        hillResistance = GRAVITY * Math.sin(rampAngle) * totalMass;

        const frictionCoefficient = 0.1;
        const frictionForce =
          frictionCoefficient * totalMass * GRAVITY * Math.cos(rampAngle);
        hillResistance += frictionForce;
      }

      const netForce =
        massAdjustedAcceleration * velocityFactor * totalMass -
        hillResistance -
        velocityResistance * totalMass;

      const finalAcceleration = netForce / totalMass;

      return finalAcceleration;
    };

    const calculateYPosition = (xPos: number) => {
      if (xPos < rampStartX) {
        return 0;
      } else if (xPos > rampEndX) {
        return rampHeight;
      } else {
        const rampProgress = (xPos - rampStartX) / (rampEndX - rampStartX);
        return rampProgress * rampHeight;
      }
    };

    const calculateTotalProgress = (xPos: number) => {
      if (xPos <= flag1X) {
        return ((xPos - startX) / totalCoursePixels) * 100;
      } else if (xPos <= flag2X) {
        const tramo1Percent = (tramo1Pixels / totalCoursePixels) * 100;
        const tramo2Progress = (xPos - flag1X) / tramo2Pixels;
        const tramo2Percent =
          tramo2Progress * ((tramo2Pixels / totalCoursePixels) * 100);
        return tramo1Percent + tramo2Percent;
      } else if (xPos <= flag3X) {
        const tramo1Percent = (tramo1Pixels / totalCoursePixels) * 100;
        const tramo2Percent = (tramo2Pixels / totalCoursePixels) * 100;
        const tramo3Progress = (xPos - flag2X) / tramo3Pixels;
        const tramo3Percent =
          tramo3Progress * ((tramo3Pixels / totalCoursePixels) * 100);
        return tramo1Percent + tramo2Percent + tramo3Percent;
      } else {
        return 100;
      }
    };

    const precalculateMovement = () => {
      const movementData = [];
      let currentX = 50;
      let currentY = 0;
      let currentVelocity = 0;
      let distanceTraveled = 0;
      let time = 0;
      let isRunning = true;
      let isGoalOneCompleted = false;
      let isGoalTwoCompleted = false;
      let isGoalThreeCompleted = false;
      let failedToClimbHill = false;

      const deltaTime = 1 / 60;

      while (isRunning && time < 100) {
        const tempPositionRef = { x: currentX, y: currentY };
        const acceleration = calculateAccelerationForSimulation(
          currentVelocity,
          tempPositionRef
        );

        currentVelocity += acceleration * deltaTime;

        const isOnRamp = currentX >= rampStartX && currentX <= rampEndX;
        if (isOnRamp && currentVelocity < 0) {
          currentVelocity = Math.max(currentVelocity, -3.0);
          if (currentVelocity < -0.5 && currentX > rampStartX + 50) {
            failedToClimbHill = true;
          }
        }

        if (isOnRamp && Math.abs(currentVelocity) < 0.05) {
          currentVelocity = 0;
          isRunning = false;
        }

        const distanceIncrement =
          currentVelocity * deltaTime +
          0.5 * acceleration * Math.pow(deltaTime, 2);
        distanceTraveled += distanceIncrement;

        let newX = 50 + distanceTraveled * PIXELS_PER_METER;

        if (newX < 50) {
          newX = 50;
          currentVelocity = 0;
          distanceTraveled = 0;
          isRunning = false;
        }

        if (newX + CAR_WIDTH >= wallX) {
          newX = wallX - CAR_WIDTH;
          distanceTraveled = (newX - 50) / PIXELS_PER_METER;
          currentVelocity = 0;
          isGoalThreeCompleted = true;
          isRunning = false;
        }

        currentX = newX;
        currentY = calculateYPosition(currentX);

        const isRampBaseReached = currentX >= rampStartX;
        const isRampTopReached = currentX >= rampEndX;

        if (!isGoalOneCompleted && isRampBaseReached) {
          isGoalOneCompleted = true;
        }

        if (!isGoalTwoCompleted && isRampTopReached) {
          isGoalTwoCompleted = true;
          failedToClimbHill = false;
        }

        const progressPercent = Math.round(calculateTotalProgress(currentX));

        movementData.push({
          time,
          x: currentX,
          y: currentY,
          velocity: currentVelocity,
          acceleration: acceleration,
          isRampBaseReached,
          isRampTopReached,
          isGoalOneCompleted,
          isGoalTwoCompleted,
          isGoalThreeCompleted,
          distanceTraveled,
          progressPercent,
          failedToClimbHill,
          isOnRamp,
        });
        time += deltaTime;
      }
      return movementData;
    };

    const data = precalculateMovement();

    res.status(200).json({
      message: "Calculos hechos correctamento",
      status: "success",
      payload: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hubo problemas en el servidor " + error,
      status: "error",
      payload: null,
    });
  }
};
