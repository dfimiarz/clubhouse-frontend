import utils from '@/services/utils'

describe('Service Utils minToTime', () => {

    it('returns null when wrong or no param supplied', () => {

        expect(utils.minToTime()).toBe(null)
        expect(utils.minToTime("12")).toBe(null)
      })

    it('returns null when minutes are out of range < 0, > 1439', () => {

      expect(utils.minToTime(-1)).toBe(null)
      expect(utils.minToTime(1440)).toBe(null)
    })

    it('returns correct time for valid minutes', () => {

        expect(utils.minToTime(0)).toMatch("00:00")
        expect(utils.minToTime(299)).toMatch("04:59")
        expect(utils.minToTime(300)).toMatch("05:00")
        expect(utils.minToTime(601)).toMatch("10:01")
        expect(utils.minToTime(1439)).toMatch("23:59")
        
    })
  })