const addSkills = require('./AddSkills');

test('addSkills should add new skills to the existing list', () => {
    expect(
        addSkills("java", ["python", "c"])
    ).toEqual(["python", "c", "java"]); 
});
