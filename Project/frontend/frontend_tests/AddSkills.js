const addSkills = (newSkill, prevSkills) => {
    const updatedSkills = prevSkills.includes(newSkill)
      ? prevSkills.filter((skill) => skill !== newSkill)
      : [...prevSkills, newSkill];
    const skillsWithCommas = updatedSkills.join(', ');
    console.log("selectedSkills: " + skillsWithCommas);
    return updatedSkills;
};

module.exports = addSkills