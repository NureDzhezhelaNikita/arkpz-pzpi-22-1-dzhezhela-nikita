#ifndef GPS_H
#define GPS_H

#include <Arduino.h>
#include <TinyGPS.h>
#include "state.h"

class IoTGPS
{
private:
  TinyGPS gps;
  State *state;
  HardwareSerial *serial;
  unsigned long lastUpdate;
  int updateInterval;

  float lastLatitude;
  float lastLongitude;
  float lastSpeed;
  unsigned long lastFixAge;

public:
  IoTGPS(HardwareSerial *serial, int updateInterval = 1000);

  void begin(unsigned long baud = 9600);
  void loop();

  bool hasValidData() const
  {
    return lastFixAge != TinyGPS::GPS_INVALID_AGE;
  }
  float getLatitude() const
  {
    return lastLatitude;
  }
  float getLongitude() const
  {
    return lastLongitude;
  }
  float getSpeed() const
  {
    return lastSpeed;
  }
  unsigned long getLastUpdate() const
  {
    return lastUpdate;
  }
};

#endif