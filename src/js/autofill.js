const firestore = firebase.firestore();
let namesAndStore = [];
let fullData = [];
const showList = document.getElementById('placeList');
const showProductPlace = document.getElementById('productResultPlace');
const showML = document.getElementById('productResultPlaceML');

const getData = () => {
  const settings = {/* your settings... */ timestampsInSnapshots: true };
  firestore.settings(settings);
  firestore.collection("products")
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        formObject(doc);
        getFullData(doc);
      })
      let search = getInput();
      if (search !== null && search !== undefined && search.length > 1) {

        let encontrados = namesAndStore.forEach(element => {
          // console.log(element.name);
          // console.log(search);
          let nombres = element.name.toLowerCase();
          // let result = [];
          if (nombres.search(search) != -1) {

            // console.log('tiene' + element.name);
            let id = element.name.replace(/ /g, "");
            showList.innerHTML += `
            <li class="list-group-item">${element.name}<button class="float-right btn verde" id=${id} onclick="showProduct(this.id)">Comparar</button></li>
           `
            // result.push(nombres)
          } else { // console.log('nothing');
          }
        })
      } else {
        console.log('input vacio');
      }
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });



  const formObject = (doc) => {
    namesAndStore.push({
      "name": doc.data().producto,
      "seller": doc.data().tienda
    });
  };
  const getFullData = (doc) => {
    // console.log(doc.data().producto);
    fullData.push({
      "nombre": doc.data().producto,
      "url": doc.data().image,
      "seller": doc.data().tienda,
      "precioFalabella": doc.data().valorOrigen
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
}

const showProduct = (id) => {

  //console.log(id);
  //console.log(fullData[0].nombre);
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
  console.log(match);
  
  showML.innerHTML = `
    <div class="col-md-1 col-4">
    <img src="./img/mercado libre.png" class=" rounded-circle" height="40px">
  </div>
  <div class="col-md-2 col-4">
    <img class=" align-middle" src="${match.url}">
  </div>
  <div class="col-md-6">${match.nombre}/${match.seller}</div>

  <div class="col-md-3">$399990</div>
  `
};