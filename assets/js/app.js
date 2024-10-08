// URL base de la API
const API_URL = 'https://67059607031fd46a83107aa1.mockapi.io/alurageek/productos';

// Seleccionar el contenedor donde se mostrarán los productos
const cardsProductos = document.querySelector('.cards_productos');

// Función para obtener productos desde la API
const obtenerProductos = async () => {
  try {
    // Vaciar el contenedor antes de agregar nuevos productos
    cardsProductos.innerHTML = '';

    // Realizamos la petición GET a la API de MockAPI
    const respuesta = await fetch(`${API_URL}`);
    const productos = await respuesta.json();
    
    // Recorremos los productos y los agregamos al HTML
    productos.forEach(producto => {
      const { nombre, precio, imagen, id } = producto;
      
      const productoHTML = `
        <div class="card_detalles" data-id="${id}">
          <div class="imagen_producto"><img src="${imagen}" alt="${nombre}"></div>
          <p>${nombre}</p>
          <div class="info_compra">
            <p>${precio}</p>
            <img src="/assets/img/papelera.png" alt="Eliminar" class="btn-eliminar" data-id="${id}">
          </div>
        </div>
      `;
      
      // Insertamos el producto en el contenedor
      cardsProductos.insertAdjacentHTML('beforeend', productoHTML);
    });

    // Añadir eventos para eliminar productos
    agregarEventosEliminar();
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
};


// Función para agregar eventos a los botones de eliminar
const agregarEventosEliminar = () => {
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');
  
  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      
      // Eliminar el producto del servidor
      await eliminarProducto(id);
      
    });
  });
};

// Función para eliminar el producto de la API
const eliminarProducto = async (id) => {
  try {
    // Eliminar el producto de MockAPI
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    // Eliminar el producto del DOM
    eliminarProductoDelDOM(id);

    // Mostrar una alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'Producto eliminado',
      text: 'El producto ha sido eliminado exitosamente!',
      timer: 2000,
      showConfirmButton: false
    });
    
  } catch (error) {
    console.error('Error al eliminar el producto:', error);

    // Mostrar una alerta de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al eliminar el producto.',
    });
  }
};

// Función para eliminar el producto del DOM
const eliminarProductoDelDOM = (id) => {
  // Seleccionar el producto en el DOM por su data-id
  const productoElemento = document.querySelector(`.card_detalles[data-id="${id}"]`);
  
  // Si existe el producto, lo removemos del DOM
  if (productoElemento) {
    productoElemento.remove();
  }
};


// Llamamos a la función para mostrar los productos al cargar la página
document.addEventListener('DOMContentLoaded', obtenerProductos);


// Agregar productos
// Seleccionar el formulario por su ID
const formulario = document.getElementById('formulario');

// Función para generar un ID único
const generarIdUnico = () => {
  return Date.now().toString();
};

// Función para agregar un nuevo producto a la API
const agregarProducto = async (producto) => {
  try {
    // Realizamos la petición POST a la API (en este caso, el JSON local)
    await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(producto)
    });

    // Mostrar el producto en la página después de agregarlo
    obtenerProductos();

    // Mostrar una alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado',
      text: 'El producto ha sido agregado exitosamente!',
      timer: 2000,
      showConfirmButton: false
    });
  } catch (error) {
    console.error('Error al agregar producto:', error);

    // Mostrar una alerta de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al agregar el producto.',
    });
  }
};

// Evento para capturar el envío del formulario
formulario.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Capturar los valores de los inputs
  const nombre = document.getElementById('nombreProducto').value;
  const precio = "$"+document.getElementById('precioProducto').value;
  const imagen = document.getElementById('imagenProducto').value;

  // Crear un nuevo objeto de producto con un ID único
  const nuevoProducto = {
    id: generarIdUnico(),
    nombre,
    precio,
    imagen
  };

  // Llamar a la función para agregar el producto
  await agregarProducto(nuevoProducto);

  // Limpiar el formulario después de enviar
  formulario.reset();
});



// Validación del formulario
// Validación de cada campo por separado
const validarNombre = () => {
    const nombre = document.getElementById('nombreProducto').value.trim();
    const nombreError = document.getElementById('nombreError');
    let esValido = true;

    if (nombre === '') {
        nombreError.innerText = 'El nombre del producto es obligatorio.';
        nombreError.classList.add('active');
        esValido = false;
    } else {
        nombreError.innerText = '';
        nombreError.classList.remove('active');
    }
    return esValido;
};

const validarPrecio = () => {
    const precio = document.getElementById('precioProducto').value.trim();
    const precioError = document.getElementById('precioError');
    const precioRegex = /^\d+(\.\d{1,2})?$/; // Acepta números con hasta 2 decimales
    let esValido = true;

    if (!precioRegex.test(precio) || precio === '') {
        precioError.innerText = 'El precio debe ser un número válido (ej: 65.26).';
        precioError.classList.add('active');
        esValido = false;
    } else {
        precioError.innerText = '';
        precioError.classList.remove('active');
    }
    return esValido;
};

const validarImagen = () => {
    const imagen = document.getElementById('imagenProducto').value.trim();
    const imagenError = document.getElementById('imagenError');
    const urlRegex = /^(http|https):\/\/[^ "]+$/; // Valida si es una URL
    let esValido = true;

    if (!urlRegex.test(imagen) || imagen === '') {
        imagenError.innerText = 'La URL de la imagen debe ser válida.';
        imagenError.classList.add('active');
        esValido = false;
    } else {
        imagenError.innerText = '';
        imagenError.classList.remove('active');
    }
    return esValido;
};

// Función para verificar si todos los campos son válidos y habilitar el botón
const habilitarBotonEnviar = () => {
    const botonEnviar = document.querySelector('.btn_enviar');
    const esFormularioValido = validarNombre() && validarPrecio() && validarImagen();
    botonEnviar.disabled = !esFormularioValido; // Deshabilita el botón si el formulario no es válido
};

// Eventos para validar campos
const nombreProducto = document.getElementById('nombreProducto');
const precioProducto = document.getElementById('precioProducto');
const imagenProducto = document.getElementById('imagenProducto');

// Asignar múltiples eventos a cada campo
nombreProducto.addEventListener('keyup', () => {
    validarNombre();
    habilitarBotonEnviar();
});

precioProducto.addEventListener('keyup', () => {
    validarPrecio();
    habilitarBotonEnviar();
});

imagenProducto.addEventListener('keyup', () => {
    validarImagen();
    habilitarBotonEnviar();
});


// Evitar el envío del formulario si hay errores
document.getElementById('formulario').addEventListener('submit', function(event) {
    if (!validarNombre() || !validarPrecio() || !validarImagen()) {
        event.preventDefault(); // No permitir el envío si hay errores
    }
});
