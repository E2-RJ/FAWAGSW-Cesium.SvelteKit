import Resizer from "react-image-file-resizer";

const resize = Resizer.imageFileResizer;

let rawImgs;  // The uncompressed version of the uploaded images, they are bound to the form input element below

/* 
   This function will be called multiple times if multiple files are uploaded, it takes a 
   file object from a form (the typical e.target.files[0]), and resizes it.
   It will be used in the resizeImages function.
 */
let resizeImage = (file) => {
    return new Promise((resolve, reject) => {
        resize(file, 256, 256, "WEBP", 100, 0, uri => resolve(uri), "file");
    });
};
/* 
  This function takes an array of files (the typical e.target.files array), resizes every files
  and returns an array of resized files. it uses the function resizeImage defined above.
*/
export let resizeImages = async (files) => {
    let resized = [];
    for (let i = 0; i < files.length; i++) resized.push(await resizeImage(files[i]));
    return resized;
};