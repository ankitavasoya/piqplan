import moment from "moment";
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const getCookie = (name) => {
    // Split cookie string and get all individual name=value pairs in an array
    const cookieArr = document.cookie.split(";");
    // Loop through the array elements
    for (let i = 0; i < cookieArr.length; i + 1) {
        const cookiePair = cookieArr[i].split("=");
        /* Removing whitespace at the beginning of the cookie name
            and compare it with the given string */
        if (name === cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    // Return null if not found
    return null;
};

export const dateFunction = (date) => {
    if (moment(date).format("YYYY.MM.DD") === moment(new Date()).format("YYYY.MM.DD")) {
        return "Today";
    } if (moment(date).format("YYYY.MM.DD") === moment(new Date()).subtract(1, "days").format("YYYY.MM.DD")) {
        return "Yesterday";
    }
    return moment(date).format("YYYY.MM.DD");
};


export const checkImageURL = (nationality) => {
    const pngImages = ["Antarctica"];

    let urlImage = `./img/flags/${nationality}.svg`;
    if (pngImages.includes(nationality)) {
        urlImage = `./img/flags/${nationality}.png`;
    }
    return urlImage
}

// export const xwwwFormUrlencoded = (formData) => {
//     const formBody = [];
//     for (const property in formData) {
//         const encodedKey = encodeURIComponent(property);
//         const encodedValue = encodeURIComponent(formData[property]);
//         formBody.push(`${encodedKey} + "=" + ${encodedValue}`);
//     }
//     formBody.join("&");

//     return formBody
// }

export const dateFormate = (date, type) => {
    if (type === 'FullDateTime') {
        return moment(date).format('DD MMM YYYY hh:mm A')
    } if (type === 'Date') {
        return moment(date).format('DD MMM YYYY')
    } if (type === 'Time') {
        return moment(date).format('hh:mm A')
    }
}

export const isJson = (str) => {
    try {
        if(typeof str === "object") {
            return true
        } else {
            return false
        }
    } catch (e) {
        return false;
    }
    // return true;
}

// # These variables describe about user age
// # Basically app is configured for user aged with 65 to 100 years
// # By updating below numbers it'll reflacts on date pickers
const PERSON_AGE_OF = 65; 
const PERSON_AGE_TILL = 100;
const currentYear = new Date().getFullYear()
const START_DATE = new Date(new Date(new Date().getFullYear()).setFullYear(currentYear - PERSON_AGE_TILL))
const END_DATE = new Date(new Date(new Date().getFullYear()).setFullYear(currentYear - PERSON_AGE_OF))
export const PICK_DATE = {AGE_FROM: START_DATE, AGE_TO: END_DATE}
export const POPUP_TIMER = 3000