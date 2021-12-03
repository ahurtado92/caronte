/*
 * HTTPS Secured Client GET Request
 * Copyright (c) 2019, circuits4you.com
 * All rights reserved.
 * https://circuits4you.com 
 * Connects to WiFi HotSpot. */

#include <ESP8266WiFi.h>
#include "MFRC522.h"
#include <WiFiClientSecure.h> 
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

/*
 * PINOUT
 * +--------------------------------+---------------+
 * | WEMOS D1 ESP8266 BOARD         | CONECT TO PIN |
 * +--------------------------------+---------------+
 * | PIN  | FUCTION  | ESP-8266 PIN | RC522 | RELAY |
 * +------+----------+--------------+-------+-------+
 * | 3.3V | POWER    | 3.3V         | 3.3V  |       |
 * +------+----------+--------------+-------+-------+
 * | 5V   | POWER    | 5V           |       | VCC   |
 * +------+----------+--------------+-------+-------+
 * | GND  | GND      | GND          | GND   | GND   |
 * +------+----------+--------------+-------+-------+
 * | D13  | SCK      | GPIO-14      | SCK   |       |
 * +------+----------+--------------+-------+       +
 * | D12  | MISO     | GPIO-12      | MISO  |       |
 * +------+----------+--------------+-------+       +
 * | D11  | MOSI     | GPIO-13      | MOSI  |       |
 * +------+----------+--------------+-------+       +
 * | D10  | SS (SDA) | GPIO-15      | SDA   |       |
 * +------+----------+--------------+-------+       +
 * | D8   | IO       | GPIO-0       | RESET |       |
 * +------+----------+--------------+-------+-------+
 * | D2   | IO       | GPIO-16      |       | IN1   |
 * +------+----------+--------------+-------+-------+
 */

#define RST_PIN 0 // RST-PIN for RC522 - RFID - SPI - Module GPIO-0 
#define SS_PIN  15  // SDA-PIN for RC522 - RFID - SPI - Module GPIO-15
#define RELAY_PIN 16 // RELAY-PIN in GPI0-16

/* Set these to your desired credentials. */
const char *ssid = "JM";  //ENTER YOUR WIFI SETTINGS
const char *password = "7C239D44D2";

//Link to read data from https://jsonplaceholder.typicode.com/comments?postId=7
//Web/Server address to read/write from 
const char *host = "jm-caronte.herokuapp.com";
const int httpsPort = 443;  //HTTPS= 443 and HTTP = 80

//SHA1 finger print of certificate use web browser to view and copy
const char fingerprint[] PROGMEM = "B8 B9 B1 3F 37 1F 2B 1B 38 E8 A7 72 8E 29 12 07 1E 1F 98 E8";

/*
 * For User Auhentication:
 * https://en.wikipedia.org/wiki/Basic_access_authentication
 * Use user:password in base64
 * Ej: https://webnet77.net/cgi-bin/helpers/base-64.pl
*/

const char* userpass = "xxxx";

int tag[4];
byte mac[6];
char macAddress[18];
String deviceName = "84-0d-8e-92-e7-9e";

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

void dump_byte_array(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? "" : ".");
    Serial.print(buffer[i], DEC);
    tag[i] = buffer[i];
  }
}

/*ESP8266WebServer server(80);

const String postForms = "<html>\
  <head>\
    <title>ESP8266 Web Server POST handling</title>\
  </head>\
  <body>\
    <h1>Servidor OK!</h1><br>\
  </body>\
</html>";

void handleRoot() {
  server.send(200, "text/html", postForms);
  digitalWrite(RELAY_PIN, HIGH); //Relay ON
  Serial.println("Relay Activated");
  delay(3000);
  digitalWrite(RELAY_PIN, LOW); //Relay OFF
}*/


WiFiClientSecure httpsClient;    //Declare object of class WiFiClient


//=======================================================================
//                    Power on setup
//=======================================================================

void setup() {
  delay(1000);

  //Serial.println(host);

  //Serial.printf("Using fingerprint '%s'\n", fingerprint);
  httpsClient.setFingerprint(fingerprint);
  httpsClient.setTimeout(100); // 0.1 Seconds
  
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); //Relay OFF
  
  // Initialize serial communications
  Serial.begin(115200);
  
  delay(10);
  SPI.begin();           // Init SPI bus
  mfrc522.PCD_Init();    // Init MFRC522
  
  WiFi.mode(WIFI_OFF);        //Prevents reconnection issue (taking too long to connect)
  delay(1000);
  WiFi.mode(WIFI_STA);        //Only Station No AP, This line hides the viewing of ESP as wifi hotspot
  
  WiFi.begin(ssid, password);     //Connect to your WiFi router
  Serial.println("");

  Serial.print("Connecting");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  //If connection successful show IP address in serial monitor
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());  //IP address assigned to your ESP

  //server.on("/", handleRoot);
  //server.begin();
  //Serial.println("HTTP server started");
  
}

void openFromWebApp(){
    
  Serial.println("HTTPS Connecting");
    int r=0; //retry counter
    while((!httpsClient.connect(host, httpsPort)) && (r < 30)){
        delay(10);
        Serial.print(".");
        r++;
    }
    if(r==30) {
      Serial.println("Connection failed");
    }
    else {
      Serial.println("Connected to web");
    }
    
    //server.handleClient();

    httpsClient.print(String("GET ") + "/api/doors/open/"+deviceName+" HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +          
                 "Connection: close\r\n\r\n");
    
    Serial.println("request sent");
                    
    while (httpsClient.connected()) { 
      String line2 = httpsClient.readStringUntil('\n');
      if (line2 == "\r") {
        Serial.println("headers received");
        break;
      }
    }
    String line2;
    while(httpsClient.available()){        
      line2 = httpsClient.readStringUntil('\n');  //Read Line by Line
      Serial.println(line2); //Print response
    }
    int pass2 = line2.indexOf("true");
    Serial.println(pass2);
    if(pass2 == 9){
      Serial.println("Access Granted");
        digitalWrite(RELAY_PIN, HIGH); //Relay ON
        Serial.println("Relay Activated");
        delay(2000);
        digitalWrite(RELAY_PIN, LOW); //Relay OFF
        delay(1000);
    }
    else{
      Serial.println("False");
    }
    
}

//=======================================================================
//                    Main Program Loop
//=======================================================================
void loop() {
  /*WiFiClientSecure httpsClient;    //Declare object of class WiFiClient

  //Serial.println(host);

  //Serial.printf("Using fingerprint '%s'\n", fingerprint);
  httpsClient.setFingerprint(fingerprint);
  httpsClient.setTimeout(100); // 0.1 Seconds*/
  delay(200);

  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    delay(100);

    openFromWebApp();
    
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    delay(100);
    return;
  }
  // Show some details of the PICC (that is: the tag/card)
  Serial.println("RFID Tag Detected...");
  Serial.print(F("Card UID:"));
  dump_byte_array(mfrc522.uid.uidByte, mfrc522.uid.size);
  Serial.println();
  
  Serial.println("HTTPS Connecting");
  int r=0; //retry counter
  while((!httpsClient.connect(host, httpsPort)) && (r < 300)){
      delay(10);
      Serial.print(".");
      r++;
  }
  if(r==30) {
    Serial.println("Connection failed");
  }
  else {
    Serial.println("Connected to web");
  }
  
  String ADCData, getData, Link;
  //int adcvalue=analogRead(A0);  //Read Analog value of LDR
  //ADCData = String(adcvalue);   //String to interger conversion

  //GET Data
  Link = "/api/doors/"+deviceName+"/1/"+tag[0]+"."+tag[1]+"."+tag[2]+"."+tag[3];

  Serial.print("requesting URL: ");
  Serial.println(host+Link);

  httpsClient.print(String("GET ") + Link + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +               
               "Connection: close\r\n\r\n");

  Serial.println("request sent");
                  
  while (httpsClient.connected()) { 
    String line = httpsClient.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("headers received");
      break;
    }
  }

  //Serial.println("reply was:");
  //Serial.println("==========");
  String line;
  while(httpsClient.available()){        
    line = httpsClient.readStringUntil('\n');  //Read Line by Line
    //Serial.println(line); //Print response
  }
  //Serial.println(line);
  int pass = line.indexOf("granted");
  Serial.println(pass);
  if(pass == 11){
    Serial.println("Access Granted");
      digitalWrite(RELAY_PIN, HIGH); //Relay ON
      Serial.println("Relay Activated");
      delay(2000);
      digitalWrite(RELAY_PIN, LOW); //Relay OFF
  }
  else{
    Serial.println("False");
  }
  //Serial.println("==========");
  Serial.println("closing connection");
    
  delay(1000);  //GET Data at every 1 second

}
//=======================================================================
