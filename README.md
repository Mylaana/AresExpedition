# AresExpedition - Opensource private project  
This project is NOT related to Asmodee or Fryxgames and is designed for personnal and non commercial use only.

## Architecture and Concepts
### Technologies used :
Frontend: Angular 17
Backend: Java (to be confirmed)
Cards data parser: Python

### Architecture
# In Game Design
## Cards design
![image](https://github.com/Mylaana/AresExpedition/blob/main/ressources/images/cards%20design.png)

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
Write automated tests

## Server
Chose a technology (Python Django / Java Spring)
Create the server

## Deployment
CI/CD Pipeline
Cloud option selection
