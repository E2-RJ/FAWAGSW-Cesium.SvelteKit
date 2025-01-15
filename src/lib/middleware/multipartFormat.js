export function returnPropertyEntry(arr) {
    // Format and return property key value pair
    if (!Array.isArray(arr)) {
        return false;
    } // Check an array has been received
    let propertyName = "";
    let propertyVal = undefined;
    arr.forEach(function (val, index) {
        if (val.includes("name=")) {
            // Check an object has been received
            propertyName = arr[index].split("name=")[1]; // Strip the form field from the name
            propertyVal = arr[index + 1]; // Add value
        }
    });
    return [propertyName, propertyVal];
}

export function returnFileEntry(arr) {
    // Format and return property key value pair
    if (!Array.isArray(arr)) {
        return false;
    } // Check an array has been received
    let fileName = "";
    let file = undefined;
    arr.forEach(function (val, index) {
        if (val.includes("filename=")) {
            // Check an object has been received
            fileName = arr[index].split("filename=")[1]; // Strip the form field from the name
        }
        if (val.toLowerCase().includes("content-type")) {
            file = arr[index + 1]; // Add file
        }
    });
    return [fileName, file];
}

export function isFile(part) {
    // Check if object is a file
    if (!Array.isArray(part)) {
        return false;
    }
    let filenameFound = false;
    let contentTypeFound = false;
    part.forEach(function (val, index) {
        if (val.includes("filename=")) {
            filenameFound = true;
        }
        if (val.toLowerCase().includes("content-type")) {
            contentTypeFound = true;
        }
    });
    part.forEach(function (val, index) {
        if (!val.length) {
            part.splice(index, 1);
        }
    });
    if (filenameFound && contentTypeFound) {
        return part;
    } else {
        return false;
    }
}

export function isProperty(part) {
    // Check if object is a property
    if (!Array.isArray(part)) {
        return false;
    }
    let propertyNameFound = false;
    let filenameFound = false;
    part.forEach(function (val, index) {
        if (val.includes("name=")) {
            propertyNameFound = true;
        }
    });
    part.forEach(function (val, index) {
        if (val.includes("filename=")) {
            filenameFound = true;
        }
    });
    part.forEach(function (val, index) {
        if (!val.length) {
            part.splice(index, 1);
        }
    });
    if (propertyNameFound && !filenameFound) {
        return part;
    } else {
        return false;
    }
}