// ajax版
// $.ajax({
//     method: 'GET',
//     url: 'api/stocks',
// })
//     .done((data) => {
//         console.log(data);
//     })
//     .fail((err) => {
//         console.log(err);
//     });

// axios版
// promised based
// axios({
//     method: 'GET',
//     url: 'api/stocks',
//     responseType: 'json',
// }).then((response) => {
//     console.log(response.data);
// });

// fetch版
// fetch('api/stocks', {
//     method: 'get',
// }).then((response) => {
//     console.log(response.json());
// });
