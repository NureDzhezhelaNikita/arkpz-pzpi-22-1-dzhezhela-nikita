#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

class Config
{
private:
    String ssid;
    String password;
    String authToken;
    String wsUrl;
    String canConfigFilename;
    int activeDelay;
    int suspendedDelay;
    int reconnectionRetryDelay;

    void promptForValue(const char *prompt, String &value);
    void promptForIntValue(const char *prompt, int &value);

public:
    Config();

    void initialize();

    String getSSID() const
    {
        return ssid;
    }
    String getPassword() const
    {
        return password;
    }
    String getAuthToken() const
    {
        return authToken;
    }
    String getWsUrl() const
    {
        return wsUrl;
    }
    String getCanConfigFilename() const
    {
        return canConfigFilename;
    }
    int getActiveDelay() const
    {
        return activeDelay;
    }
    int getSuspendedDelay() const
    {
        return suspendedDelay;
    }
    int getReconnectionRetryDelay() const
    {
        return reconnectionRetryDelay;
    }
};

#endif