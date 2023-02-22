import { databaseLog } from '../../src/util/log';

describe("Utility - Log", () => {
  it('Database log works.', () => {
    const logSpy = jest.spyOn(global.console, 'log');
                        
    databaseLog("Test.");
    
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toBeCalledTimes(1);
    // TODO: Test output.
  });
});
