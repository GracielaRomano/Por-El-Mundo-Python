var form = document.getElementById("formulario");

async function handleSubmit(event) { //una funcion asincronica para que el usuario tenga el control del formulario una vez que el servidor obtuvo respuesta
    event.preventDefault();
    var status = document.getElementById("my-form-status");

    var inputs = document.querySelectorAll('#formulario input');
    var estaOK = true;
    inputs.forEach((input) => { //valida el input por su name
        switch (input.name) {
            case "nombre":
                success = validarCampo(expresiones.nombre, input, 'nombre');
                break;
            case "apellido":
                success = validarCampo(expresiones.apellido, input, 'apellido');
                break;
            case "correo":
                success = validarCampo(expresiones.correo, input, 'correo');
                break;
            case "telefono":
                success = validarCampo(expresiones.telefono, input, 'telefono');
                break;
        }

        if (!success) { 
            estaOK = false;
        };
    });

    if (!estaOK) {  //si los inputs no fueron llenados de manera correcta, se lanza el alerta
        alert('ojo, algun campo tiene error, Verifique!');
        return;
    }

    var data = new FormData(event.target); //se envia el formulario a "https://formspree.io/f/xvoldkrq"
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => { //si el envio del formulario es correcto, limpia el formulario
        if (response.ok) {
            status.innerHTML = "Tu comentario fue enviado exitosamente!";
            form.reset()
            setTimeout(() => {
                status.innerHTML = "";
            }, 3000);
            document.querySelectorAll('.contacto__grupo-correcto').forEach((icono) => {  //limpia los iconos una vez enviado el formulario
                icono.classList.remove('contacto__grupo-correcto');
            });
        } else {
            response.json().then(data => {  // si hay un error en el json
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                } else {
                    status.innerHTML = "Oops! Hubo un problema al enviar su formulario"
                }
            })
        }
    }).catch(error => { //si el error es desconocido
        status.innerHTML = "Oops! Hubo un problema al enviar su formulario"
    });
};

form.addEventListener("submit", handleSubmit);

//const formulario = document.getElementById('contacto-form');
const inputs = document.querySelectorAll('#formulario input');

const expresiones = {
    nombre: /^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, // Letras y espacios, pueden llevar acentos.
    apellido: /^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, // Letras y espacios, pueden llevar acentos.
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono: /^\d{7,14}$/ // 7 a 14 numeros.
}

const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            validarCampo(expresiones.nombre, e.target, 'nombre');
            break;
        case "apellido":
            validarCampo(expresiones.apellido, e.target, 'apellido');
            break;
        case "correo":
            validarCampo(expresiones.correo, e.target, 'correo');
            break;
        case "telefono":
            validarCampo(expresiones.telefono, e.target, 'telefono');
            break;
    }
    return;
}
const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)) {
        document.getElementById(`grupo__${campo}`).classList.remove('contacto__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.add('contacto__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
        document.querySelector(`#grupo__${campo} .contacto__input-error`).classList.remove('contacto__input-error-activo');
        return true;
    } else {
        document.getElementById(`grupo__${campo}`).classList.add('contacto__grupo-incorrecto');
        document.getElementById(`grupo__${campo}`).classList.remove('contacto__grupo-correcto');
        document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
        document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
        document.querySelector(`#grupo__${campo} .contacto__input-error`).classList.add('contacto__input-error-activo');
        return false;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
})