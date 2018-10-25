const firestore = firebase.firestore();
let namesAndStore = [];
let fullData = [];
let newDataML = [];
const showList = document.getElementById('placeList');
const showProductPlace = document.getElementById('productResultPlace');
const showML = document.getElementById('productResultPlaceML');

// const getData = () => {
//   const settings = {/* your settings... */ timestampsInSnapshots: true };
//   firestore.settings(settings);
//   firestore.collection("products")
//     .get()
//     .then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
//         formObject(doc);
//         getFullData(doc);
//       })
//       let search = getInput();
//       if (search !== null && search !== undefined && search.length > 1) {

//         let encontrados = namesAndStore.forEach(element => {
//           // console.log(element.name);
//           // console.log(search);
//           let nombres = element.name.toLowerCase();
//           // let result = [];
//           if (nombres.search(search) != -1) {

//             // console.log('tiene' + element.name);
//             let id = element.name.replace(/ /g, "");
//             showList.innerHTML += `
//             <li class="list-group-item">${element.name}<button class="float-right btn verde" id=${id} onclick="showProduct(this.id)">Comparar</button></li>
//            `
//             // result.push(nombres)
//           } else { // console.log('nothing');
//           }
//         })
//       } else {
//         console.log('input vacio');
//       }
//     })
//     .catch(function (error) {
//       console.log("Error getting documents: ", error);
//     });

    const getData = () => {
      dataExtractor('../../products.json').then((result) => {
        // console.log('promesa ejecutada' + JSON.stringify(result));
        result.forEach(element => {
          // console.log(element);
          formObject(element);
          getFullData(element);
        })  
        let search = getInput();
      if (search !== null && search !== undefined && search.length > 1) {

        let encontrados = namesAndStore.forEach(element => {
          // console.log(namesAndStore);
          
          // console.log(element.name);
          // console.log(search);
          let nombres = element.name.toLowerCase();
          // let result = [];
          if (nombres.search(search) != -1) {

            // console.log('tiene' + element.name);
            let id = element.name.replace(/ /g, "");
            showList.innerHTML += `
            <li class="list-group-item">${element.name}<button class="float-right btn verde" id=${id} onclick="showProduct(this.id)">Comparar</button></li>
           `;
          }
          })
        }  
    })
  }

  const formObject = (doc) => {
    namesAndStore.push({
      "name": doc.Producto,
      "seller": doc.Tienda
    });
  };
  const getFullData = (doc) => {
    // console.log(doc.data().producto);
    fullData.push({
      "nombre": doc.Producto,
      "url": doc.Thumbnail,
      "seller": doc.Tienda,
      "precioFalabella": doc.ValorUnidad
    })
    // console.log(fullData);

  };

  const getInput = () => {
    let searchOrigin = document.getElementById('searchInput').value;
    let search = searchOrigin.toLowerCase();
    if (search.length > 0 && search !== null && search !== undefined) {
      return search;
    };
  }


const showProduct = (id) => {

  //console.log(id);
  // console.log(fullData);
  let match = fullData.find((element) => {
    if (element.nombre.replace(/ /g, "") === id) {
      return element;
    }
  });
  // console.log(match);
  compareAndAddMatch(match.nombre);
  showProductML(id, match);
  showProductPlace.innerHTML = `
    <div class="col-md-1 col-4">
      <img src="./img/icon_falabella.png" class=" rounded-circle" height="40px">
    </div>
    <div class="col-md-2 col-4">
      <img class=" align-middle" src="${match.url}">
   </div>
  <div class="col-md-6">${match.nombre}/${match.seller}</div>

  <div class="col-md-3">$${match.precioFalabella}</div>
  `;
};

const showProductML = (id, match) => {
  const settings = {/* your settings... */ timestampsInSnapshots: true };
  firestore.settings(settings);
  firestore.collection("products")
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      newDataML.push({
        "nombre": doc.data().producto,
        "url": doc.data().image,
        "seller": doc.data().tienda,
        "precioFalabella": doc.data().valorOrigen,
        "precioML": doc.data().precioML,
        "sellerNick": doc.data().seller
      });
    })
    
  }).catch(function (error) {
      console.log("Error getting documents: ", error);
    });
    // console.log(newDataML);
      let match2 = newDataML.find((element) => {
        if (element.nombre.replace(/ /g, "") === id) {
          console.log(element);
          return element;
        }  
        
      showML.innerHTML = `
        <div class="col-md-1 col-4">
        <img src="./img/mercado libre.png" class=" rounded-circle" height="40px">
      </div>
      <div class="col-md-2 col-4">
        <img class=" align-middle" src="${match.url}">
      </div>
      <div class="col-md-6">${match.nombre}/${match.seller}</div>

      <div class="col-md-3">$${match2.precioML}</div>
      `
        })

  
}