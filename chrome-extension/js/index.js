
const getSearchElements = () => {
    console.log();
    let items = document.querySelectorAll('.dl-search-result');

    items.forEach( function(element, index) {
        let name = element.children[0].children[0].children[1].children[0].textContent;
        console.log(name);
    });

    return items;
}

console.log(getSearchElements());
