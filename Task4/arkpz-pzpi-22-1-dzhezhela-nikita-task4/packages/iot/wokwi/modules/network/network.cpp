#include "network.h"
#include <ArduinoJson.h>

// openssl s_client -showcerts -connect example.com:443

const char ssl_cert[] PROGMEM = R"(

)";

IoTNetwork::IoTNetwork(Config *config) : config(config)
{
    isConnected = false;
    lastReconnectAttempt = 0;
    state = State::getInstance();
}

bool IoTNetwork::connectToWiFi()
{
    Serial.println("Connecting to WiFi...");
    WiFi.mode(WIFI_STA);
    WiFi.begin(config->getSSID().c_str(), config->getPassword().c_str());

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20)
    {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED)
    {
        Serial.println("\nWiFi connected");
        return true;
    }

    Serial.println("\nWiFi connection failed");
    return false;
}

void IoTNetwork::setupWebSocket()
{
    String wsUrl = config->getWsUrl();

    webSocket.setCACert(ssl_cert);

    webSocket.onMessage([&](websockets::WebsocketsMessage msg)
                        {
    Serial.print("Got Message: ");
    Serial.println(msg.data()); });

    webSocket.onEvent([&](websockets::WebsocketsEvent event, String data)
                      {
    if (event == websockets::WebsocketsEvent::ConnectionOpened) {
      Serial.println("WebSocket connection opened");
      isConnected = true;
    } else if (event == websockets::WebsocketsEvent::ConnectionClosed) {
      Serial.println("WebSocket connection closed");
      isConnected = false;
    } });

    Serial.print("Connecting to WS: ");
    Serial.println(wsUrl);

    bool connected = webSocket.connect(wsUrl);

    if (connected)
    {
        Serial.println("WebSocket connected!");
        isConnected = true;
    }
    else
    {
        Serial.println("WebSocket connection failed!");
        isConnected = false;
    }
}

bool IoTNetwork::connect()
{
    if (!connectToWiFi())
    {
        return false;
    }

    setupWebSocket();
    return isConnected;
}

void IoTNetwork::loop()
{
    if (WiFi.status() != WL_CONNECTED)
    {
        unsigned long currentMillis = millis();
        if (currentMillis - lastReconnectAttempt >= config->getReconnectionRetryDelay())
        {
            lastReconnectAttempt = currentMillis;
            Serial.println("WiFi disconnected. Attempting to reconnect...");
            connectToWiFi();
        }
    }

    if (isConnected)
    {
        webSocket.poll();
    }
    else
    {
        unsigned long currentMillis = millis();
        if (currentMillis - lastReconnectAttempt >= config->getReconnectionRetryDelay())
        {
            lastReconnectAttempt = currentMillis;
            Serial.println("Attempting to reconnect WebSocket...");
            setupWebSocket();
        }
    }
}

String IoTNetwork::preparePackage(MessageType type, String &payload)
{
    StaticJsonDocument<1024> doc;

    doc["token"] = config->getAuthToken();

    switch (type)
    {
    case MessageType::VEHICLE_STATUS:
        doc["type"] = "VEHICLE_STATUS";
        break;
    case MessageType::SET_VEHICLE_STATUS:
        doc["type"] = "SET_VEHICLE_STATUS";
        break;
    case MessageType::CAR_INTERNAL:
        doc["type"] = "CAR_INTERNAL";
        break;
    }

    StaticJsonDocument<512> payloadDoc;
    deserializeJson(payloadDoc, payload);
    doc["payload"] = payloadDoc;

    String output;
    serializeJson(doc, output);
    return output;
}

bool IoTNetwork::send(String &message)
{
    if (!isConnected)
    {
        Serial.println("Cannot send message: WebSocket not connected");
        return false;
    }

    return webSocket.send(message);
}