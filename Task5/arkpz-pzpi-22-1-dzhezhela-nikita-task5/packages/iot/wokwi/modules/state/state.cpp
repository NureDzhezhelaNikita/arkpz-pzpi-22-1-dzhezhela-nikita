#include "state.h"

State *State::instance = nullptr;

State::State()
{
    vehicleStatus = VehicleStatus::AVAILABLE;
    isLocked = true;
    isStarted = false;
    fuel = 0.0;
    latitude = 0.0;
    longitude = 0.0;
    speed = 0.0;
    mileage = 0.0;

    currentTrip.id = "";
    currentTrip.totalMileage = 0.0;
    currentTrip.averageSpeed = 0.0;
    currentTrip.fuelSpent = 0.0;
    currentTrip.status = TripStatus::DONE;
}

State *State::getInstance()
{
    if (instance == nullptr)
    {
        instance = new State();
    }
    return instance;
}

void State::startNewTrip(const String &tripId)
{
    currentTrip.id = tripId;
    currentTrip.totalMileage = 0.0;
    currentTrip.averageSpeed = 0.0;
    currentTrip.fuelSpent = 0.0;
    currentTrip.status = TripStatus::ACTIVE;

    vehicleStatus = VehicleStatus::IN_USE;
}

void State::updateTripStatus(TripStatus status)
{
    currentTrip.status = status;

    if (status == TripStatus::PAUSED)
    {
        vehicleStatus = VehicleStatus::PAUSED;
    }
    else if (status == TripStatus::ACTIVE)
    {
        vehicleStatus = VehicleStatus::IN_USE;
    }
    else if (status == TripStatus::DONE)
    {
        vehicleStatus = VehicleStatus::AVAILABLE;
    }
}

void State::updateTripMetrics(float tripMileage, float currentSpeed, float fuelLevel)
{
    if (currentTrip.status != TripStatus::ACTIVE)
    {
        return;
    }

    currentTrip.totalMileage = tripMileage;
    currentTrip.fuelSpent = fuel - fuelLevel;

    if (currentSpeed > 0)
    {
        if (currentTrip.averageSpeed == 0)
        {
            currentTrip.averageSpeed = currentSpeed;
        }
        else
        {
            currentTrip.averageSpeed = (currentTrip.averageSpeed + currentSpeed) / 2;
        }
    }
}

void State::endTrip()
{
    updateTripStatus(TripStatus::DONE);
    currentTrip.id = "";
}