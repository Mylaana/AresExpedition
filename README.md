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

### CD (to be added)
- Triggerred when new code is merged on main branch   
- TBD (pbly AWS LightSail)   

# WIP : 
## /!\Critical BUG/!\ :
Events related to card played not saved in eventstate (see a card with oceanflip/draw and put this event on top then refresh)   
Double activation count being ignored by multiple activation option cards (18/27/43)   
Corpo selection blocking the game if refreshed after corp selected and before subsequent event resolution if refreshed (eg: DevTechs)   
card status position bugged (see dev techs)   
drawQueue not purged after researchResult   
All played cards displaying vp   

## Must have for v1 :
### Refactoring
root services: reorganize services/stateless classes and tree   
Rework Buildable system in playableCardComponent   

### Cards
Create Event type :   
    - removing any ressource in list on played card   
    - adding any ressource in list on played card   
    - new builder event   
    - discard type/Quantity watching discarded card datas (mars univ/49)   
    - "action portal" type event casting subsequent events   
Activation:   
    - Droplist/Custom value selection on activation (card 32/47)   
Other:   
    - Need prerequisite offset mechanic   
    - Standard tech reduction mechanic   
    - Droplist   

### Misc
Add victory check   

### Interface
Design production phase screen   
Add scan/keep modifier display   
Always display steel/titanium cost mod   
Rollback button does nothing   
Fix multiple activation display (transfer wrapper to activationList)   

### CI/CD
Frontend automated testing: Ongoing   
Backend automated testing: no backend yet   
Deploy on AWS Lightsail   

### Security
Add backend REST requests content validation   

## Nice to have for v1
### Non-Critical Bug :
Escape keyboard not exiting card builder selection   
Websocket connection error while not in the game   
Project card: layers superposition creating visual bug on edges   

### Refactoring :
Websocket: remove the global channel and switch to multiple sendings on private ones   
text with image component: refactoring   
test needs: empty components from the app logic and transfer it into services/classes    
global: removing obvious comments   
Optimize data volume exchanged   
Refactor playable cards component should be storing clientstate and not repeatedly check for state   
Refactor Ressource system (scaling, base etc.)   
Refactor Tag System   

### Interface
Add Display property for current event, so the screen does not flash when resolving technical events   
Add log   
Add main buttons help popup   
Add onClick visual effect for buttons   
Add popup-like window for non-production phase gains   
Action phase: Switch buttons to vertical on the left
Production phase: add cards drew display   
Card Builder: show already built card on refresh   
Add proper Hybrid production zone looks   
Rework effect summary zone (refacto + looks)   
Create switch button   

### Responsiveness
Game creation menu
Previous phase selected resizing   
Hand size   
hand border radius   
Command buttons / setting button position   
project card: reduce stock size on small card version   
Effect zone: need an autoshrink calculation   

### Misc
Add settings options   
Add game modes   

## Game Options
initial mulligan is an andvanced game mode option, not base   
merger   
fanmade cards   
some projects cards should only be accessible when 5+ players   
switch infrastructure completion to be optionnal   