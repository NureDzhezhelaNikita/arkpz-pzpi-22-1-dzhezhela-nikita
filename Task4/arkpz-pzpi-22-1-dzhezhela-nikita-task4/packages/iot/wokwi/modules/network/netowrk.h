#ifndef NETWORK_H
#define NETWORK_H

#include <Arduino.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include "config.h"
#include "state.h"

enum class MessageType
{
    VEHICLE_STATUS,
    SET_VEHICLE_STATUS,
    CAR_INTERNAL
};

class IoTNetwork
{
private:
    websockets::WebsocketsClient webSocket;
    Config *config;
    State *state;
    bool isConnected;
    unsigned long lastReconnectAttempt;

    void setupWebSocket();
    bool connectToWiFi();

public:
    IoTNetwork(Config *config);

    bool connect();
    bool isWebSocketConnected() const
    {
        return isConnected;
    }
    void loop();

    String preparePackage(MessageType type, String &payload);
    bool send(String &message);
};

#endif