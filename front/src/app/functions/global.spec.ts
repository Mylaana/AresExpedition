import { MinMaxEqualTreshold } from "../interfaces/global.interface"
import { ProjectCardModel } from "../models/cards/project-card.model"
import { deepCopy, getValueVsTreshold } from "./global.functions"

describe('Functions', () => {
    describe('copy', () => {
        it('should return a jsonified copy', () => {
            let testValue = 'abc'
            let result = deepCopy(testValue)
            expect(result).toEqual(testValue)
        })
        it('should return a jsonified copy of object', () => {
            let testObject = new ProjectCardModel
            let result = deepCopy(testObject)
            expect(result).not.toEqual(testObject)
        })
    })
    describe('getValueVsTreshold', () => {
        let testTreshold: MinMaxEqualTreshold
        //equal
        it('should return equal comparison as false', () => {
            testTreshold = {treshold: "equal", tresholdValue: 2, value: 1}
            expect(getValueVsTreshold(testTreshold)).toBeFalse()
        })
        it('should return equal comparison as true', () => {
            testTreshold = {treshold: "equal", tresholdValue: 2, value: 2}
            expect(getValueVsTreshold(testTreshold)).toBeTrue()
        })

        //min
        it('should return min comparison as false', () => {
            testTreshold = {treshold: "min", tresholdValue: 2, value: 1}
            expect(getValueVsTreshold(testTreshold)).toBeFalse()
        })
        it('should return min comparison as true', () => {
            testTreshold = {treshold: "min", tresholdValue: 2, value: 5}
            expect(getValueVsTreshold(testTreshold)).toBeTrue()
        })

        //max
        it('should return max comparison as false', () => {
            testTreshold = {treshold: "max", tresholdValue: 2, value: 4}
            expect(getValueVsTreshold(testTreshold)).toBeFalse()
        })
        it('should return max comparison as true', () => {
            testTreshold = {treshold: "max", tresholdValue: 2, value: 0}
            expect(getValueVsTreshold(testTreshold)).toBeTrue()
        })
    })
})