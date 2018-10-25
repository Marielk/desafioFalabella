// función que llama en API de ML a producto ingresado en filtro inicial
const getdatamatch = (id) => {

  let producto = id;
  let productoconc = producto.replace(/ /g, '+');

  return new Promise((resolve) => {

    fetch(`https://api.mercadolibre.com/sites/MLC/search?q=${productoconc}`).then((response) => {

      if (response.ok) {
        return response.json();
      } else {
        throw new Error('La llamada a la API falló');
      };

    }).then((respuestaJson) => {
      resolve(respuestaJson);
    })
      .catch((err) => {
        console.error(err);
      });
  });
};


// función que obtiene nickname del seller
const getdataseller = (id) => {

  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/users/${id}`).then((response) => {

      if (response.ok) {
        return response.json();
      } else {
        throw new Error('La llamada a la API falló');
      };
    }).then((respuestaJson) => {
      resolve(respuestaJson);
    })
      .catch((err) => {
        console.error(err);
      });
  });
};


// función que realiza coincidencia desde producto ingresado con obtenidos en llamado API, retorna el con mayor match
getProductmatch = (producto, resultados) => {

  let may = 0;

  // funciones que compara con funciones de librería "string-similarity", basado en coeficiente de Sorensen-Dice
  const compareTwoStrings = (str1, str2) => {
    if (!str1.length && !str2.length) return 1;
    if (!str1.length || !str2.length) return 0;
    if (str1.toUpperCase() === str2.toUpperCase()) return 1;
    if (str1.length === 1 && str2.length === 1) return 0;

    const pairs1 = wordLetterPairs(str1);
    const pairs2 = wordLetterPairs(str2);
    const union = pairs1.length + pairs2.length;
    let intersection = 0;
    pairs1.forEach(pair1 => {
      for (let i = 0, pair2; pair2 = pairs2[i]; i++) {
        if (pair1 !== pair2) continue;
        intersection++;
        pairs2.splice(i, 1);
        break;
      };
    });
    return intersection * 2 / union;
  };
  const wordLetterPairs = (str) => {
    const pairs = str.toUpperCase().split(' ').map(letterPairs);
    return flattenDeep(pairs);
  };
  const flattenDeep = (arr) => {
    return Array.isArray(arr) ? arr.reduce((a, b) => a.concat(flattenDeep(b)), []) : [arr];
  };
  const letterPairs = (str) => {
    const pairs = [];
    for (let i = 0, max = str.length - 1; i < max; i++) pairs[i] = str.substring(i, i + 2);
    return pairs;
  };

  // recorro arreglo desde API y busco match y guardo el mayor
  for (let index = 0; index < resultados.length; index++) {

    let similarity = compareTwoStrings(producto, resultados[index].title);
    if (similarity > may) {
      may = similarity;
      var dataML = {
        "nombreML": resultados[index].title,
        "precioML": resultados[index].price,
        "match": similarity,
        "idseller": resultados[index].seller.id
      };
    };
  };
  return dataML;
};


// función controladora de lectura de producto ingresado y que lo escribe en firebase
const compareAndAddMatch = (id) => {
  Porcent(id);

  let producto = id;
  let idProd = id.replace(/\//g, '');

  const firestore = firebase.firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  firestore.settings(settings);

  getdatamatch(producto).then(data => {

    const dataML = getProductmatch(producto, data.results);
    getdataseller(dataML.idseller).then(elem => {

      const datatoFirebase = {
        "nombreML": dataML.nombreML,
        "precioML": dataML.precioML,
        "match": dataML.match,
        "seller": elem.nickname
      };


      firestore.collection("products").doc(idProd).update(datatoFirebase);
    });
  });
};


// función para agregar porcentaje de cada precio
const Porcent = (nombre) => {

  let idProd = nombre.replace(/\//g, '');

  const firestore = firebase.firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  firestore.settings(settings);

  var docRef = firestore.collection("products").doc(idProd);

  docRef.get().then(function (doc) {

    if (doc.exists) {

      let PML = doc.data().precioML;
      let PF = doc.data().valorOrigen
      let PorcentF = (PML / PF);
      let PorcentML = (PF / PML);

      if (PorcentF > 1) {
        PorcentF = 1
      };

      if (PorcentML > 1) {
        PorcentML = 1
      };

      let dataPorcent = {
        "PorFal": PorcentF,
        "PorML": PorcentML
      };

      firestore.collection("products").doc(idProd).update(dataPorcent);

    } else {
      console.log("No such document!");
    };

  }).catch(function (error) {
    console.log("Error getting document:", error);
  });
};