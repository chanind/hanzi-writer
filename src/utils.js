export function inArray(val, array) {
    for (var arrayVal of array) {
        if (val === arrayVal) return true;
    }
    return false;
};