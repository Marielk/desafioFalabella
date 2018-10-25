// const firestore = firebase.firestore();
let sellersOnly = [];
let fullDataSellers = [];
let fullDataSellers2 = [];
let newSellerList = [];

const dataExtractor = (jsonFile) => {
  return new Promise((resolve, reject) => {
    fetch(jsonFile) 
    .then(response => response.json())
      .then(data => { 
        const fullDataSellers = data;  
            return resolve(fullDataSellers);
        })
        // aca adentro va la funcion que haremos con esa respuesta que se recibe, reslove es ok reject es fail
  
      .catch((error) => {
          return reject(console.log('error' + error));
          
         });    
  });
};

window.onload = () => {
  dataExtractor('../../products.json').then((result) => {
    // console.log('promesa ejecutada' + JSON.stringify(result));
    fullDataSellers2 = result;
    result.forEach(element => {
      // console.log(element.Tienda);
      sellersOnly.push({
        "Seller": element.Tienda
      })
      // let newArr = element;
      // let output = eliminateDuplicates(newArr);
      // newSellerList.push(output);
    })  
    //  console.log(newSellerList);
    printSellers();
  })
}

const printSellers = () => {
  const sellerList = document.getElementById('sellerListResultPlace');
  if (sellersOnly.length === 583){
    // console.log(sellersOnly);
    sellersOnly.forEach(seller => {
      // let id = seller.Seller; 
      // console.log(id);
      sellerList.innerHTML += `
      <li class="list-group-item">${seller.Seller}<button class="float-right" id=${seller.Seller} onclick="findSellerMatches(this.id)">Comparar</button></li>
      `
    })
  }
}

const findSellerMatches = (id) => {
  // console.log(sellersOnly);
  // console.log(fullDataSellers2); 
  const placeResult = document.getElementById('productSellerResultPlace');
  // console.log(id);
  let matches = fullDataSellers2.forEach((element) => {
      if (element.Tienda === id) {
        // console.log(element.Producto);
        let buttonID = element.Producto.replace(/ /g, "");
        // let buttonID2 = buttonID.replace(/\//g, '');
        placeResult.innerHTML += `
        <li class="list-group-item">${element.Producto}<button class="float-right btn cyan" id=${buttonID} onclick="showProduct2(this.id)">Ver Producto</button></li>
       `
        return element;
      } else {
        // console.log('no match');  
      }
    })
  };

    

  const showProduct2 = (id) => {

    //console.log(id);
    //console.log(fullData[0].nombre);
    let match = fullDataSellers2.find((element) => {
      if (element.Producto.replace(/ /g, "") === id) {
        return element;
      }
    });
    // console.log(match);
    compareAndAddMatch(match.Producto)
    showProductPlace.innerHTML = `
      <img src="${match.Thumbnail}">
      <p>Nombre ${match.Producto}</p>
      <p>Tienda ${match.Tienda}</p>
      <p>Precio ${match.ValorUnidad}</p>
    `;
  };

  function eliminateDuplicates(arr) {
    var i,
        len=arr.length,
        out=[],
        obj={};
   
    for (i=0;i<len;i++) {
       obj[arr[i]]=0;
    }
    for (i in obj) {
       out.push(i);
    }
    return out;
   }