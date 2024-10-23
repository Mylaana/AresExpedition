# AresExpedition - Opensource private project  
This project is NOT related to Asmodee or Fryxgames and is designed for personnal and non commercial use only.

# In Game Design
## Cards design
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/cards%20design.png)

# Architecture and Concepts
## Technologies used :
Frontend: Angular 17  
Server: Java websocket   
API: Java Springboot  
Cards data parser: Python  

## Testing
Frontend: Automated tests (unit & integration): Jasmine, Karma, Istanbul. Target code coverage > 80%

## Architecture & Design pattern
- MVC: game-event-component and its handlers being the 'main' controller, game-state-service being the main model  
- Event Driven Architecture: The whole front uses RJXS system and a custom pile duo to resolve most game events.  

## CI/CD
### CI
- GitHub Actions  
- Feature branches will be merged in Development-QA branch
- Development-QA will trigger automated tests
- If tests are successfull, create a PR and automerge to main branch

### CD
- Triggerred when new code is merged on main branch
- Tech used TBD

# WIP : 
## Refactoring :
gameEventComponent: add back optional sell button & Lockpile control
text with image component: cleanup the code
project card list component : split the component into multiple ones (selector/hand/played)  
test needs: empty components from the app logic and transfer it into services/classes 
global: cleaning of code  (renaming, etc.)

## New features :
### Phase cards
Phase 3  
Phase card project full effect (owner and general)  
Phase card upgraded effects

### Cards
Discard Event should "lock" the Sell card button while being resolved  
Prerequisites for playing project cards feature

## Misc
Global parameter increase applied at EOT  
Lakes feature

## Clean Code
Comments & naming: do some check, comments should be added only if function name is not obvious enough   

## CI
Frontend automated testing: Ongoing  
Backend automated testing: no backend yet  
Github Actions Build & test

## CD
Nothing done yet  
Tech TBD  

## Backend
Server: Java websocket   
API: Java Springboot  

## Deployment
CI/CD Pipeline
Cloud option selection
