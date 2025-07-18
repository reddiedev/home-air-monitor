#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define OUTPUT_LED D4

const char* WIFI_SSID = "";
const char* WIFI_PASSWORD = "";
const char* API_URL = "http://192.168.1.17:8000/api/upload";

void setup() {
  Serial.begin(115200);
  Serial.println();
  delay(500);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());

  pinMode(OUTPUT_LED, OUTPUT); // onboard LED

  randomSeed(analogRead(0));
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(OUTPUT_LED, LOW); // active LOW
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, API_URL);
    http.addHeader("Content-Type", "application/json");

    float temperature = random(200, 300) / 10.0; 
    float humidity = random(10, 91);               
    
    String jsonData = "{\"temperature\":";
    jsonData += String(temperature, 2); 
    jsonData += ", \"humidity\":";
    jsonData += String(humidity, 2);
    jsonData += "}";
    
    int httpCode = http.POST(jsonData);

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.println(payload);
    } else {
      Serial.printf("HTTP POST failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    
    http.end();
    digitalWrite(OUTPUT_LED, HIGH);
  } else {
    Serial.println("WiFi not connected!");
  }

  delay(2 * 1000); 
}