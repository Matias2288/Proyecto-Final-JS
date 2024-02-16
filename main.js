const modal = new bootstrap.Modal('#modalCarrito', {});
const btnModalCarrito = document.querySelector('#btnModalCarrito');
const cartCount = document.querySelector('#cartCount');
const cartSum = document.querySelector('#cartSum');
const inputSearch = document.querySelector('#inputSearch');
const listProducts = document.querySelector('#listProducts');
const selectCategory = document.querySelector('#selectCategory');
const modalListProducts = document.querySelector('#modalListProducts');
const btnClose = document.querySelector('#btnClose');
const btnSave = document.querySelector('#btnSave');
const btnOrderMenos = document.querySelector('#btnOrderMenos');
const btnOrderMas = document.querySelector('#btnOrderMas');
const modalCarrito = document.querySelector('#modalCarrito');

let products_list = [];

const listCart = JSON.parse(localStorage.getItem('cart')) || [];
const cart = new Cart(listCart);

cartCount.innerText = cart.getCount();

modalCarrito.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-delete')) {
        const productId = event.target.getAttribute('data-id');
        removeProduct(productId);
    }
});

// Función para eliminar un producto del carrito
function removeProduct(productId) {
    cart.removeProduct(productId);
    const list = cart.getProducts();
    redenCart(list);
    cartCount.innerText = cart.getCount();
    cartSum.innerText = cart.getSum();
}

btnModalCarrito.addEventListener('click', () => {
    const list = cart.getProducts();
    cartSum.innerText = cart.getSum();
    redenCart(list);
    modal.show();
});

btnSave.addEventListener('click', ()=> {
    if(cart.getCount() >= 1){
        setTimeout( () => {

        
            Swal.fire({
                title: "Compra realizada con exito",
                text: "La compra se a realizado exitosamente",
                icon: "success"
            }).then(function() {
                location.reload();
            });
        
    
        }, 500)
    
        localStorage.removeItem('cart');
        modal.hide();

        
       
    }else{
        Swal.fire({
            title: "Error con la compra",
            text: "No haz agregado ningun producto",
            icon: "error"
        });
    }
    }
);

btnClose.addEventListener('click', () => {
    modal.hide();
});

inputSearch.addEventListener('input', (event) => {
    const search = event.target.value.toLowerCase();
    const newList = products_list.filter((product) => product.name.toLowerCase().includes(search));
    renderProducts(newList);
});

selectCategory.addEventListener('change', (e) => {
    const id_category = selectCategory.value;
    filtroCategoria(id_category);
});

// Funciones de ordenamiento
const orderByPriceAsc = (a, b) => a.price - b.price;
const orderByPriceDesc = (a, b) => b.price - a.price;

const filtroCategoria = (id_category) => {
    let newList = [];
    if (id_category === "1") { // Si se selecciona la categoría "All"
        newList = products_list;
    } else {
        newList = products_list.filter((product) => product.id_category == id_category);
    }
    renderProducts(newList);
};

// Llamada a las funciones
btnOrderMenos.addEventListener('click', () => renderProducts(products_list.sort(orderByPriceAsc)));
btnOrderMas.addEventListener('click', () => renderProducts(products_list.sort(orderByPriceDesc)));

 /* ------- Pasa los productos al HTML ------- */
const renderProducts = (list) => {
    listProducts.innerHTML = '';
    list.forEach(product => {
        listProducts.innerHTML += // html
            `<div class="col-sm-4 col-md-3">
                <div class="card p-2">
                    <h4>${product.name} </h4>
                    <img class="img-fluid" src="${product.img}" alt="${product.name}">
                    <h3 class="text-center">$${product.price} </h3>
                    <button data-id="${product.id_product}" type="button" class="btn btn-primary btnAddCart">
                        <i class="fa-solid fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>`;
    });

    /* -------------- Agregar los productos al carritos ------------- */
    const btns = document.querySelectorAll('.btnAddCart');
    btns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });

};

const addToCart = ( e )=> {
    const id = e.target.getAttribute('data-id');
    const product = products_list.find( item => item.id_product == id ); // Cambiar 'id_product' aquí
    console.table(product);
    cart.addToCart( product);
    cartCount.innerText = cart.getCount();
    
    Toastify({
        close: true,
        text: "Producto agregado",
        gravity: 'bottom',
        duration: 3500,
        style: {
            background: "linear-gradient(to right, #ea96f3, #7e3086)",
          },
    }).showToast();
};


const redenCart = (list) => {
    // Limpiamos el contenido del modal
    modalListProducts.innerHTML = '';
    
    // Iteramos sobre la lista de productos y creamos los elementos HTML
    list.forEach(product => {
        const tr = document.createElement('tr');
        
        const tdName = document.createElement('td');
        tdName.textContent = product.name;
        tr.appendChild(tdName);
        
        const tdUnits = document.createElement('td');
        tdUnits.textContent = product.units;
        tr.appendChild(tdUnits);
        
        const tdPrice = document.createElement('td');
        tdPrice.textContent = `$${product.price}`;
        tr.appendChild(tdPrice);
        
        const tdTotal = document.createElement('td');
        tdTotal.textContent = `$${product.price * product.units}`;
        tr.appendChild(tdTotal);
        
        const tdButton = document.createElement('td');
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-delete', 'btn-sm');
        button.setAttribute('data-id', product.id_product);
        button.innerHTML = '<i class="fa-solid fa-trash"></i> Eliminar';
        tdButton.appendChild(button);
        tr.appendChild(tdButton);
        
        modalListProducts.appendChild(tr);
    });
};


const renderCategory = (list) =>{
    selectCategory.innerHTML = '';
    list.forEach(category => {
        selectCategory.innerHTML +=  //html
        `<option value="${category.id_category}"> ${category.name}</option>`;
    });
};

// Solicitud AJAX -> Fetch

const getProducts = async() => {
    try {
        const endPoint = 'productos.json';
        const resp = await fetch(endPoint);
        const json = await resp.json();

        const { products, category } = json;
        products_list = products;
        console.table(products);
        renderProducts(products);
        renderCategory(category);

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: 'Ups... parece que algo salió mal. Por favor intente más tarde :)',
            icon: "error",
            confirmButtonText: 'Aceptar'
        });

        console.log(error);
    }
};

getProducts();
