  
export const todayDateWithFormat = () => {

    let todayDate = new Date();
    let today;
    var dd = String(todayDate.getDate()).padStart(2, '0');
    var mm = String(todayDate.getMonth() + 1).padStart(2, '0');
    var yyyy = todayDate.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    today = today.replaceAll('/','-');

    return today;
}