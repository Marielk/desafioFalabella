// función que extrae elementos desde el json
const getProductJson = () => {

  return new Promise((resolve) => {
    fetch('products.json')
      .then(res => res.json())
      .then(data => { resolve(data) });
  });
};

// función que lee datos y los escribe en firebase
const readProduct = () => {

  const firestore = firebase.firestore();
  const settings = {
    timestampsInSnapshots: true
  };

  firestore.settings(settings);

  getProductJson().then(data => {

    for (let i = 0; i < data.length; i++) {

      let Producto = data[i].Producto;
      let ValorUnidad = data[i].ValorUnidad;
      let Tienda = data[i].Tienda;
      let Thumbnail = data[i].Thumbnail;
      let name = data[i].Producto.replace(/\//g, '');

      let dataFirebase = {
        producto: Producto,
        valorOrigen: ValorUnidad,
        tienda: Tienda,
        image: Thumbnail
      };

      firestore.collection("products").doc(name).set(dataFirebase);
    };
  });
};
// readProduct();