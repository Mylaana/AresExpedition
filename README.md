# AresExpedition - Opensource private project  
This project is NOT related to Asmodee or Fryxgames and is designed for personnal and non commercial use only.

# In Game Design
## Planification Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_planification_2.png)
## Construction Phase
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/fullscreen_construction_2.png)

# Architecture and Concepts
## Technologies used :
Frontend: Angular 17
Backend: Java 23
API: Java Spring Boot, websocket STOMP
Misc: script in Python  

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
- Tech used TBD

# WIP : 
## Refactoring :
gameEventComponent: add Lockpile control   
text with image component: refactoring   
project card list component : split the component into multiple ones (selector/hand/played)  
test needs: empty components from the app logic and transfer it into services/classes   
global: removing obvious comments   
websocket: finish the game state saving system
project-card-info-service (and some other?): switch to static
TriggerState: switch out trigger id checks from model to a service

## /!\BUG/!\ :
Card builder: when first card selected but not yet build, selecting a card in other builder resets first button states but keeps card in.   
Builder locked should still show buttons
Optional card seller: when card is selected but event is exited by cancelling cards are still sold


## New features :
### Phase cards
Phase 3  
Phase cards upgrade: a phase card type can only be upgraded once   

### Cards
Discard Event should "lock" the Sell card button while being resolved  
Prerequisites for playing project cards feature

## Misc
Global parameter increase applied at EOT  
Lakes feature

## CI
Frontend automated testing: Ongoing  
Backend automated testing: no backend yet  
Github Actions Build & test

## CD
Nothing done yet  
Tech TBD  

## Backend
API: Java Springboot  

## Deployment
CI/CD Pipeline
Cloud option selection
