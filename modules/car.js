// const 賦予 value，不可以修改
// const 賦予 object，不可以修改整個 object，但可以修改指定的 key 的 value
// 修改指定的 key 的 value，算是變成物件的下一層，所以可以修改
const car = {
    brand: 'Ford',
    color: 'yellow',
};

exports.getColor() = () => {
    return car.color;
}

// exports.setColor(color) = () => {
//     car.color = color;
//     return car.color;
// }


// 會改變所有
// module.exports = {}

/********** import 版本 **********/
// function setColor(color) {
//     car.color = color;
//     return car.color;
// }

// export { setColor };
