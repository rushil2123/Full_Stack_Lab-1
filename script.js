// array of terms to be displayed on the page
const terms = ["SEO", "Abstraction", "IDE", "OOP", "Runtime"];

const populateTermList = (listNode, terms) => {
    // iterate over term array
    terms.forEach(term => {
        // create new DOM node
        const newLiNode = document.createElement("li");

        // modify HTML in new DOM node to include iterated term value
        newLiNode.innerHTML = `<a href="#">${term}</a>`;

        // append new LI node as child element of list argument node
        listNode.appendChild(newLiNode);
    });
}


/** 
// add event listener to the "document" node
// callback function invokes when event "fires" on element that listener was
appended to, in this case, when the DOM has loaded fully
*/ 
document.addEventListener("DOMContentLoaded", () => {
    // store the DOM node referencing an element with class "top-terms__list"
    const termListNode = document.querySelector(".top-terms__list");

    // invoke function passing in DOM node and terms array
    populateTermList(termListNode, terms);
});