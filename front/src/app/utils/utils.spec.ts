import { MinMaxEqualTreshold } from "../interfaces/global.interface"
import { PlayableCardModel } from "../models/cards/project-card.model"
import { Logger, Utils } from "./utils"

describe('Functions', () => {
    describe('copy', () => {
        it('should return a jsonified copy', () => {
            let testValue = 'abc'
            let result = Utils.jsonCopy(testValue)
            expect(result).toEqual(testValue)
        })
        it('should return a jsonified copy of object', () => {
            let testObject = new PlayableCardModel
            let result = Utils.jsonCopy(testObject)
            expect(result).not.toEqual(testObject)
        })
    })
    describe('log', () => {
        it('should call console.log', () => {
            const spy = spyOn(console, 'log')

            Logger.logText('some text')

            expect(spy).toHaveBeenCalled()
        })
    })
    describe('getValueVsTreshold', () => {
        let testTreshold: MinMaxEqualTreshold
        //equal
        it('should return equal comparison as false', () => {
            testTreshold = {treshold: "equal", tresholdValue: 2, value: 1}
            expect(Utils.getValueVsTreshold(testTreshold)).toBeFalse()
        })
        it('should return equal comparison as true', () => {
            testTreshold = {treshold: "equal", tresholdValue: 2, value: 2}
            expect(Utils.getValueVsTreshold(testTreshold)).toBeTrue()
        })

        //min
        it('should return min comparison as false', () => {
            testTreshold = {treshold: "min", tresholdValue: 2, value: 1}
            expect(Utils.getValueVsTreshold(testTreshold)).toBeFalse()
        })
        it('should return min comparison as true', () => {
            testTreshold = {treshold: "min", tresholdValue: 2, value: 5}
            expect(Utils.getValueVsTreshold(testTreshold)).toBeTrue()
        })

        //max
        it('should return max comparison as false', () => {
            testTreshold = {treshold: "max", tresholdValue: 2, value: 4}
            expect(Utils.getValueVsTreshold(testTreshold)).toBeFalse()
        })
        it('should return max comparison as true', () => {
            testTreshold = {treshold: "max", tresholdValue: 2, value: 0}
            expect(Utils.getValueVsTreshold(testTreshold)).toBeTrue()
        })
    })
})
