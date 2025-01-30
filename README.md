# AresExpedition - Opensource private project  
This project is NOT related to Asmodee or Fryxgames and is designed for personnal and non commercial use only.

# In Game Design
## Cards design
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/cards%20design.png)

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

## New features :
### Phase cards
Phase 3  
Phase 1 & 2 bug: build button can be clicked without card selected   

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
