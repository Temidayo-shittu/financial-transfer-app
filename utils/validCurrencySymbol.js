const validCurrencySymbols = ['₦', '$', '€', '£', '¥']; // Add more symbols as needed;

const isValidCurrencySymbol = (value)=> {
    // Check if the value is a string
    if (typeof value !== 'string') {
        return false;
    }

    // Check if the value is in the list of valid currency symbols
    return validCurrencySymbols.includes(value);
};

module.exports = { isValidCurrencySymbol };