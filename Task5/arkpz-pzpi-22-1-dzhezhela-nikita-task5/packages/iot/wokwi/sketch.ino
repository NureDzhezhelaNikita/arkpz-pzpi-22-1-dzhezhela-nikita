#include <ArduinoJson.h>
#include "config.h"
#include "state.h"
#include "network.h"
#include "gps.h"
#include "can.h"

#define GPS_RX_PIN 16
#define GPS_TX_PIN 17

Config config;
State *state = State::getInstance();
IoTNetwork network(&config);
IoTGPS gps(&Serial2);
IoTCAN can;

void setup()
{
    Serial.begin(115200);

    Serial2.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

    config.initialize();

    gps.begin(9600);

    can.begin();

    network.connect();

    state->setVehicleStatus(VehicleStatus::AVAILABLE);
}

void loop()
{
    static unsigned long lastUpdate = 0;
    unsigned long currentMillis = millis();

    gps.loop();
    can.loop();

    int delayInterval = (state->getVehicleStatus() == VehicleStatus::IN_USE) ? config.getActiveDelay() : config.getSuspendedDelay();

    if (currentMillis - lastUpdate >= delayInterval)
    {
        lastUpdate = currentMillis;

        // Prepare and send data
        StaticJsonDocument<256> doc;
        doc["latitude"] = state->getLatitude();
        doc["longitude"] = state->getLongitude();
        doc["speed"] = state->getSpeed();
        doc["mileage"] = state->getMileage();
        doc["fuel"] = state->getFuel();
        doc["isLocked"] = state->getIsLocked();
        doc["isStarted"] = state->getIsStarted();

        String payload;
        serializeJson(doc, payload);

        String message = network.preparePackage(MessageType::VEHICLE_STATUS, payload);

        if (network.isWebSocketConnected())
        {
            network.send(message);
        }
        else
        {
            Serial.println("WebSocket not connected. Retrying...");
            network.connect();
        }
    }

    network.loop();
}
