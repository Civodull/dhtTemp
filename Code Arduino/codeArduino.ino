#include<IRremote.h>  
#include "DHT.h"
#define Type DHT11
#define ledR 8
#define ledV 7
//
int sensorPin = 2;
DHT objetDHT11(sensorPin, Type);
float humidite;
float tempC;
float tempF;
int setime = 500;
int delayTime = 1000;
int vitessMoteur = 5;
int direction1 = 3;
int direction2 = 4;
const int buzzer = 9;
int VitessMaxMoteur = 255;
const int RECV_PIN = 10;// on branche le capteur infrarouge
IRrecv capteurIR(RECV_PIN);
decode_results decodage;

void setup() {
 capteurIR.enableIRIn();
 capteurIR.blink13(false);
 pinMode(vitessMoteur, OUTPUT);
 pinMode(direction1, OUTPUT);
 pinMode(direction2, OUTPUT);
 Serial.begin(9600);
objetDHT11.begin();
delay(setime);
pinMode(ledV,OUTPUT);
pinMode(ledR,OUTPUT);
}
void loop() {
humidite = objetDHT11.readHumidity();
tempC = objetDHT11.readTemperature();
tempF = objetDHT11.readTemperature(true);

//si on detecte un appui sur la télécommande
  if(capteurIR.decode(&decodage)){
    //si l'appui est faite sur la touche 1 de la telecommande 
    //on declanche le ventillateur
      if(decodage.value == 0xFF30CF){
     //si l'appui est faite sur la touche 1 de la telecommande 
    //on declanche le ventillateur
        digitalWrite(direction1,HIGH);
        digitalWrite(direction2,LOW);
        digitalWrite(vitessMoteur,VitessMaxMoteur);
        //on affiche le message sur le moniteur serie
        Serial.print("Ventillateur Demarrer\n");
        }
     //si l'appui est faite sur la touche 2 de la telecommande 
    //on etteint le ventillateur
        else{
          digitalWrite(direction1,LOW);
          digitalWrite(direction2,HIGH);
          digitalWrite(vitessMoteur,VitessMaxMoteur);
          }
            Serial.println(decodage.value, HEX);
            capteurIR.resume();
            delay(500);
      }
      delay(delayTime);
if(tempC <= 26 ){
                digitalWrite(direction1,LOW);
                digitalWrite(direction2,LOW);
                noTone(buzzer);
                digitalWrite(vitessMoteur,VitessMaxMoteur);
               ledOn(ledV);
               ledOff(ledR);
  }
  else{
                digitalWrite(direction1,HIGH);
                digitalWrite(direction2,LOW);
                tone(buzzer, 1000, 500);
                digitalWrite(vitessMoteur,VitessMaxMoteur);
               ledOn(ledR);
               ledOff(ledV);
}

Serial.print(tempC);
Serial.println(humidite);

capteurIR.resume();
delay(500);
}
//sous-programme

void ledOn(int numLed){
  digitalWrite(numLed, HIGH);
  }
 void ledOff(int numLed){
  digitalWrite(numLed, LOW);
  }
