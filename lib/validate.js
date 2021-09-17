const duplicates = (value,array) => {
    array.forEach(element => {
        if(element === value)
        return true
    });   
    return false; 

};

module.exports = duplicates;