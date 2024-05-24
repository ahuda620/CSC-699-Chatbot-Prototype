const searchJobPost = require ('./SearchJobPost');

test('test JSearch API should return object', async()=> {
    const search = "software";
    const page = "1";
    const expectedResult = Array.from({ length: 10 }, () => (expect.any(Object)));
    const result = await searchJobPost(search, page);
    expect(result).toEqual(expectedResult);
}, 20000);