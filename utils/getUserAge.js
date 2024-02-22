const userAge = (birthYear) => {
    if (!birthYear) {
        // Return a default age or handle the case when birthYear is not provided
        return 0; // or return some default age
    }

    const today = new Date();
    const birthDate = new Date(birthYear);

    if (isNaN(birthDate.getTime())) {
        // Handle the case when birthDate is not a valid date
        return 0; // or return some default age
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    console.log(today,birthDate,birthYear)

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

module.exports = { userAge };
