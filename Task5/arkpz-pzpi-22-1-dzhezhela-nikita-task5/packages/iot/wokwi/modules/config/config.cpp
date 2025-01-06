#include "config.h"

Config::Config()
{
    activeDelay = 1000;
    suspendedDelay = 5000;
    reconnectionRetryDelay = 5000;
}

void Config::promptForValue(const char *prompt, String &value)
{
    Serial.println(prompt);
    while (Serial.available() == 0)
    {
    }
    value = Serial.readStringUntil('\n');
    value.trim();
}

void Config::promptForIntValue(const char *prompt, int &value)
{
    Serial.println(prompt);
    while (Serial.available() == 0)
    {
    }
    value = Serial.parseInt();
    Serial.readStringUntil('\n');
}

void Config::initialize()
{

    promptForValue("Enter WiFi SSID:", ssid);
    promptForValue("Enter WiFi Password:", password);

    promptForValue("Enter Vehicle Auth Token:", authToken);

    promptForValue("Enter WebSocket URL:", wsUrl);

    promptForValue("Enter CAN config filename:", canConfigFilename);

    promptForIntValue("Enter Active Delay (ms):", activeDelay);
    promptForIntValue("Enter Suspended Delay (ms):", suspendedDelay);
    promptForIntValue("Enter Reconnection Retry Delay (ms):", reconnectionRetryDelay);
}