#ifndef STATE_H
#define STATE_H

#include <Arduino.h>

enum class VehicleStatus
{
    IN_USE,
    PAUSED,
    AVAILABLE,
    UNAVAILABLE,
    SERVICE,
    RESERVED
};

enum class TripStatus
{
    ACTIVE,
    PAUSED,
    DONE
};

struct TripInfo
{
    String id;
    float totalMileage;
    float averageSpeed;
    float fuelSpent;
    TripStatus status;
};

class State
{
private:
    VehicleStatus vehicleStatus;
    bool isLocked;
    bool isStarted;
    float fuel;
    double latitude;
    double longitude;
    float speed;
    float mileage;

    TripInfo currentTrip;

    static State *instance;
    State();

public:
    static State *getInstance();

    VehicleStatus getVehicleStatus() const { return vehicleStatus; }
    void setVehicleStatus(VehicleStatus status) { vehicleStatus = status; }

    bool getIsLocked() const { return isLocked; }
    void setIsLocked(bool locked) { isLocked = locked; }

    bool getIsStarted() const { return isStarted; }
    void setIsStarted(bool started) { isStarted = started; }

    float getFuel() const { return fuel; }
    void setFuel(float value) { fuel = value; }

    double getLatitude() const { return latitude; }
    void setLatitude(double value) { latitude = value; }

    double getLongitude() const { return longitude; }
    void setLongitude(double value) { longitude = value; }

    float getSpeed() const { return speed; }
    void setSpeed(float value) { speed = value; }

    float getMileage() const { return mileage; }
    void setMileage(float value) { mileage = value; }

    const TripInfo &getCurrentTrip() const { return currentTrip; }
    void startNewTrip(const String &tripId);
    void updateTripStatus(TripStatus status);
    void updateTripMetrics(float mileage, float speed, float fuel);
    void endTrip();
};

#endif