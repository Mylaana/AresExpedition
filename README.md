# AresExpedition - Opensource private project  
This project is NOT related to Asmodee or Fryxgames and is designed for personnal and non commercial use only.

# In Game Design
## Planification Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_planification_2.png)
## Construction Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_construction_2.png)
## Upgrading a Phase card
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_phase_upgrade.png)
## Cards design (almost pure CSS)
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_cards.png)

# Architecture and Concepts
## Technologies used :
Frontend: Angular 17   
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
Action phase upgrade not working   
Production phase screen not working   
Frontend data not being reset when game rollbacks to initial draft (edge case)   
Game not being saved on backend   

## Refactoring :
Websocket: remove the global channel and switch to multiple sendings on private ones   
text with image component: refactoring   
test needs: empty components from the app logic and transfer it into services/classes    
global: removing obvious comments   
project-card-info-service (and some other?): switch to static   
TriggerState: switch out trigger id checks from model to a service   
Optimize data volume exchanged   

## Planned for v1 :
### Backend
New game creating new DB entry

### Cards
Prerequisites for playing project cards feature
Add back mod cost calculation in hand (removed cause of Expression had changed error), error was due to card showing in hand and cost mod calculated in builder selector with cost modified

### Misc
websocket: finish the game state saving system   
Add Ocean backend mechanic
Add settings options
Add victory check
Add Forest points
Add Event removing any ressource in list on played card

### Interface
Add Ocean last bonus description
Add main buttons help popup
Add onClick visual effect for buttons   
Add phase upgrade count and logo in player pannel
Add popup-like window for non-production phase gains
Add log

### CI
Frontend automated testing: Ongoing  
Backend automated testing: no backend yet  
Github Actions Build & test

### CD
Nothing done yet  
Tech TBD  

### Backend
Add requests validation

### Deployment
CI/CD Pipeline
Cloud option selection
