exports.getDate = () => {

    const today = new Date();
    const option = {
        weekday: 'long',
        day:'numeric',
        month:'long'
    };

    return today.toLocaleDateString('en-US', option);
}


exports.getDay = () => {

    const today = new Date();
    const option = {
        weekday: 'long'
    };

    return today.toLocaleDateString('en-US', option);
}


console.log(module.exports);