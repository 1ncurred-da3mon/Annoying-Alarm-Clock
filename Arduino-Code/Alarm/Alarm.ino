#define LIGHTCOUNT 9
const int LED[LIGHTCOUNT] = {2, 3, 4, 5, 6, 7, 8, 9, 10};
bool lights_on = false;
int previousLED = -1;
int randomLED = previousLED;

void setup() {
  // put your setup code here, to run once:
  for (int i = 0; i < LIGHTCOUNT; i++)
    pinMode(LED[i], OUTPUT);

  Serial.begin(9600);
  Serial.println("REDE");
}

void StopLights() {
  for (int i = 0; i < LIGHTCOUNT; i++)
    digitalWrite(LED[i], LOW);
}

void RandomLightFunc() {
  delay(30);
  while (true) {
      randomLED = LED[random(0, LIGHTCOUNT)];
      if (randomLED != previousLED) {
        previousLED = randomLED;
        break;
      }
  }
  digitalWrite(randomLED, HIGH);
  delay(30);
  digitalWrite(LED[random(0, LIGHTCOUNT)], LOW);
}

void loop() {
  // Raspberry Pi or User enters input
  if (Serial.available() > 0) {
    String readData = Serial.readStringUntil('\n');
    // Start the lights
    if (readData.equals("STARTL")) {
      lights_on = true;
    }
    // Stop the lights
    else if (readData.equals("HALT")) {
      lights_on = false;
    }
    // Check the status of the lights
    else if (readData.equals("CHECKL")) {
      Serial.println((lights_on) ? "STATUS:LIVE" : "STATUS:OFF");
    }
    // Check if Arduino is connected
    else if (readData.equals("PING")) {
      Serial.println("LIVE");
    }
  }
  
  // if the lights are on
  if (lights_on) {
    RandomLightFunc();
  }
  // otherwise, stop all the lights from being output
  else {
    StopLights();
  }
  
}
