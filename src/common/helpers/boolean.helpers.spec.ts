import { convertBoolStrToBoolean } from './boolean.helpers';

describe('boolean helpers tests', () => {
  describe('convertBoolStrToBoolean', () => {
    it('should be return result equal to boolean true if string "true" was passed', () => {
      const result = convertBoolStrToBoolean('true');

      expect(typeof result).toBe('boolean');
      expect(result).toBe(true);
    });

    it('should be return result equal to boolean false if string "false" was passed', () => {
      const result = convertBoolStrToBoolean('false');

      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });

    it('should be return result equal to boolean false if string that is not equal to "true" was passed (case 0)', () => {
      const result = convertBoolStrToBoolean('test');

      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });

    it('should be return result equal to boolean false if string that is not equal to "true" was passed (case 1)', () => {
      const result = convertBoolStrToBoolean('');

      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });
  });
});
