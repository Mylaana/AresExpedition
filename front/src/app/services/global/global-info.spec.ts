import { GameItemType } from "../../types/global.type";
import { GlobalInfo } from "./global-info.service";

describe('Service - Global Info', () => {
    describe('UNIT TEST', () => {
        let expectedUrl: string
        let expectedId: number
        let expectedType: GameItemType
		let expectedCategory: 'tag' | 'ressource'

        beforeAll(() => {
            expectedUrl = 'assets/tag/power.png'
            expectedId = 3
            expectedType = 'power'
			expectedCategory = 'tag'
        })
        it('should evaluate getUrlFromID returning existing value', () => {
            let url =  GlobalInfo.getUrlFromID(expectedId)

            expect(url).toEqual(expectedUrl)
        })
        it('should evaluate getUrlFromID returning empty value', () => {
            let url =  GlobalInfo.getUrlFromID(-1)

            expect(url).toEqual('')
        })
        it('should evaluate getUrlFromTextName returning existing value', () => {
            let Url =  GlobalInfo.getUrlFromName("$tag_power$")

            expect(Url).toEqual(expectedUrl)
        })
        it('should evaluate getUrlFromTextName returning empty value', () => {
            let url =  GlobalInfo.getUrlFromName("fake")

            expect(url).toEqual('')
        })
        it('should evaluate getIdFromType returning existing value', () => {
            let id =  GlobalInfo.getIdFromType(expectedType, expectedCategory)

            expect(id).toEqual(expectedId)
        })
        it('should evaluate getIdFromType returning -1', () => {
            let id =  GlobalInfo.getIdFromType('' as GameItemType, expectedCategory)

            expect(id).toEqual(-1)
        })
    })
})
