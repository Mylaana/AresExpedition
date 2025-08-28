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
## /!\Critical BUG/!\ : 
-

## Other BUG:   
autohex background height bug on being displayed after resolving another event on top (eg : action phase -> upgrade standard -> action phase)   

## Must have for v1 :
### Refactoring
Rework Buildable system in playableCardComponent   

### Cards
Create Event type :   
Activation:   
    - Droplist/Custom value selection on activation (card 32/47)    
add trigger resolution priority   

### Interface
display other player production

### CI/CD
Frontend automated testing: Ongoing   
Backend automated testing: no backend yet   

## Nice to have for v1
### Non-Critical Bug :
Escape keyboard not exiting card builder selection   
Expression has changed on client refresh with all the player pannel if something moves (VP increased with arklight, any gain)   

### Refactoring :
Websocket: remove the global channel and switch to multiple sendings on private ones   
Optimize data volume exchanged   
Refactor playable cards component should be storing clientstate and not repeatedly check for state   
Refactor Ressource system (scaling, base etc.)   
Refactor Tag System   

### Interface
Add log   
Add main buttons help popup   
Add onClick visual effect for buttons   
Add popup-like window for non-production phase gains   
Add proper Hybrid production zone looks   
Rework effect summary zone (refacto + looks)   
Builder: display visual list of active triggers   
Add a wizz button when player being too long to play <3   
have "lines" the same size between navigation pannels (eg: global parameter line size should be the same as players so 3 player game should be same height as global parameter pannel)   


### Responsiveness
-

### Misc
-

## Game Options
initial mulligan is an andvanced game mode option, not base   
some projects cards should only be accessible when 5+ players   
autoexpand player pannel when in planification phase   
