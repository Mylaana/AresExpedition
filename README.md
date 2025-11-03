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
- Automated Image build and push   

# WIP : 
## Other BUG:   
autohex background height bug on being displayed after resolving another event on top (eg : action phase -> upgrade standard -> action phase)   

### Cards
add trigger resolution priority   

### Interface
display other player production   


## Nice to have for v1
### Non-Critical Bug :
Escape keyboard not exiting card builder selection   

### Refactoring :
Websocket: remove the global channel and switch to multiple sendings on private ones   
Optimize data volume exchanged   
Refactor Ressource system (scaling, base etc.)   
Refactor Tag System   

### Interface
Add log   
Add main buttons help popup   
Add popup-like window for non-production phase gains   
Add proper Hybrid production zone looks   
Rework effect summary zone (refacto + looks)   
Builder: display visual list of active triggers   

## Game Options
initial mulligan is an andvanced game mode option, not base   
some projects cards should only be accessible when 5+ players   
autoexpand player pannel when in planification phase   
