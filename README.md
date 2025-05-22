# AresExpedition - Opensource private project  
This project is NOT related to Asmodee or Fryxgames and is designed for personnal and non commercial use only.

# In Game Design
## Home Page
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_lobby.png)
## Planification Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_planification.png)
## Development Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_development.png)
## Construction Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_construction.png)
## Research Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_research.png)
## Starting Hand Selection
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_starting_hand.png)
## Cards design (almost pure CSS)
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_cards.png)

# Architecture and Concepts
## Stack :
Frontend: Angular 19   
Backend: Java 23   
API Websocket: Java Spring Boot + STOMP   
API REST: Java Spring Boot   
Script CSV parser: Python   

## Testing
Frontend: Automated tests (unit & integration): Jasmine, Karma, Istanbul. Target code coverage > 80%   
Backend: Junit   

## Architecture & Design pattern
- MVC: game-event-component and its handlers being the 'main' controller, game-state-service being the main model   
- Event Driven Architecture: RXJS and a custom event pile for frontend.   
- STOMP over Websocket: connection between clients and server for fast two-ways communication.   

## CI/CD
### CI
- GitHub Actions   
- Automated test on branch push   
- If tests are successfull, create a PR and automerge to main branch (to be added).   

### CD (to be added)
- Triggerred when new code is merged on main branch   
- TBD (pbly AWS LightSail)   

# WIP : 
## /!\BUG/!\ :
Production phase: infinite loop (when player has card production ?)   
Expression has changed Error after ocean bonus applied on reload   

## Refactoring :
Websocket: remove the global channel and switch to multiple sendings on private ones   
text with image component: refactoring   
test needs: empty components from the app logic and transfer it into services/classes    
global: removing obvious comments   
project-card-info-service (and some other?): switch to static   
TriggerState: switch out trigger id checks from model to a service   
Optimize data volume exchanged   
Refactor playable cards component should be storing clientstate and not repeatedly check for state   
Create dedicated serverside model for oceanFlip Result   

## Must have for v1 :
### Cards
Prerequisites for playing project cards feature   
Implement all cards   
Implement all corps   
Add Hybrid production zone   
Add Multiple production zones (for corps)   

### Misc
Add victory check   
Add Event removing any ressource in list on played card   

### Interface
Design production phase screen   
Create switch button   

### CI/CD
Frontend automated testing: Ongoing   
Backend automated testing: no backend yet   
Deploy on AWS Lightsail   

### Security
Add backend REST requests content validation   

## Nice to have for v1
### Interface
Add Display property for current event, so the screen does not flash when resolving technical events   
Add log   
Add main buttons help popup   
Add onClick visual effect for buttons   
Add popup-like window for non-production phase gains   
Action phase: Switch buttons to vertical on the left
Production phase: add cards drew display   

### Responsiveness
Game creation menu
Previous phase selected resizing   
Hand size   
hand border radius   
Command buttons / setting button position   

### Misc
Add settings options   
Add game modes   