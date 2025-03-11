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
## /!\BUG/!\ :
Planification Validation should only work if phase button selected   
Research card selection using sell selection visuals   
Add unsubscriptions to subjects in every component.   

## Refactoring :
text with image component: refactoring   
test needs: empty components from the app logic and transfer it into services/classes   
global: removing obvious comments   
project-card-info-service (and some other?): switch to static
TriggerState: switch out trigger id checks from model to a service   
ProjectCardComposant major refactoring

## v1 planned features :
### Phase cards
Phase 3: trigger service  
Phase 3: dedicated event type listing activations per card   
Phase 3: Add ressource spending buttons to terraform
Phase cards upgrade: a phase card type can only be upgraded once   

### Cards
Discard Event should "lock" the Sell card button while being resolved  
Prerequisites for playing project cards feature
Add back mod cost calculation in hand (removed cause of Expression had changed error), error was due to card showing in hand and cost mod calculated in builder selector with cost modified

## Misc
gameEventComponent: add Lockpile control   
websocket: finish the game state saving system   
Global parameter increase applied at EOT  
Add Ocean last bonus description
Add Angular animations
Add settings options
Add main buttons help popup
Add victory check
Add Forest points

## Interface
Possibly change style to go full transparency for pop-ups + background floating hexes for text
Add floating hexes in the main window   

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
