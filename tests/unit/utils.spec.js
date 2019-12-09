import utils from '@/services/utils'

describe('Service Utils minToTime', () => {

    it('returns null when wrong or no param supplied', () => {

        expect(utils.minToTime()).toBe(null)
        expect(utils.minToTime("12")).toBe(null)
      })

    it('returns null when minutes are out of range < 0, > 1440', () => {

      expect(utils.minToTime(-1)).toBe(null)
      expect(utils.minToTime(1441)).toBe(null)
    })

    it('returns correct time for valid minutes', () => {

        expect(utils.minToTime(0)).toMatch("00:00")
        expect(utils.minToTime(299)).toMatch("04:59")
        expect(utils.minToTime(300)).toMatch("05:00")
        expect(utils.minToTime(601)).toMatch("10:01")
        expect(utils.minToTime(1439)).toMatch("23:59")
        expect(utils.minToTime(1440)).toMatch("24:00")
        
    })
  })

  describe('Service Utils timeToMinutes', () => {

    it('returns NaN when wrong or no param supplied', () => {

        expect(utils.timeToMinutes()).toBe(NaN)
        expect(utils.timeToMinutes(23)).toBe(NaN)
        expect(utils.timeToMinutes(false)).toBe(NaN)
        expect(utils.timeToMinutes("12")).toBe(NaN)
        expect(utils.timeToMinutes("12:")).toBe(NaN)
        expect(utils.timeToMinutes("0:_")).toBe(NaN)
        expect(utils.timeToMinutes("12:er")).toBe(NaN)
        expect(utils.timeToMinutes("er:er")).toBe(NaN)
        expect(utils.timeToMinutes("er:12")).toBe(NaN)
        expect(utils.timeToMinutes("24:01")).toBe(NaN)
      })

    it('returns correct minutes for valid time', () => {

        expect(utils.timeToMinutes("00:00")).toEqual(0)
        expect(utils.timeToMinutes("0:0")).toEqual(0)
        expect(utils.timeToMinutes("01:00:02")).toEqual(60)
        expect(utils.timeToMinutes("10:01:02")).toEqual(601)
        expect(utils.timeToMinutes("23:59")).toEqual(1439)
        expect(utils.timeToMinutes("24:00")).toEqual(1440)
       
        
    })
  })