#include "gps.h"

IoTGPS::IoTGPS(HardwareSerial *serial, int updateInterval)
    : serial(serial), updateInterval(updateInterval)
{
  state = State::getInstance();
  lastUpdate = 0;
  lastLatitude = 0;
  lastLongitude = 0;
  lastSpeed = 0;
  lastFixAge = TinyGPS::GPS_INVALID_AGE;
}

void IoTGPS::begin(unsigned long baud)
{
  serial->begin(baud);
}

void IoTGPS::loop()
{
  bool isUpdated = false;

  while (serial->available())
  {
    int c = serial->read();
    if (gps.encode(c))
    {
      isUpdated = true;
    }
  }

  if (isUpdated && (millis() - lastUpdate >= updateInterval))
  {
    float lat, lon;
    unsigned long age;

    gps.f_get_position(&lat, &lon, &age);

    if (age != TinyGPS::GPS_INVALID_AGE)
    {
      lastLatitude = lat;
      lastLongitude = lon;
      lastFixAge = age;

      float speed = gps.f_speed_kmph();
      if (speed != TinyGPS::GPS_INVALID_F_SPEED)
      {
        lastSpeed = speed;
      }

      // Update global state
      state->setLatitude(lastLatitude);
      state->setLongitude(lastLongitude);
      state->setSpeed(lastSpeed);
    }

    lastUpdate = millis();
  }
}