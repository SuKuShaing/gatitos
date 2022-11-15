// const URL = "https://URL.normal/Llamada-EndPoint?queryParameter&loQueEstaDespuesDelSignoDeInterrogación&sirveParaFiltrarYOtros";
//Documentación de la Api:  https://docs.thecatapi.com/pagination
const API_URL_RAMDOM = "https://api.thecatapi.com/v1/images/search?limit=2&page=2";
const API_URL_FAVORITES = "https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = "https://api.thecatapi.com/v1/images/upload";

//--- Axios ---
const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    timeout: 1000,
    headers: {'x-api-key': 'live_bHgRd3MqtiQbVqpR1KYNGOyjfDSVMYpnpLtXvTCLLykeK1Tii4Fkn8BC02l2zMJP'}
});

const spanError = document.getElementById('error');

//--- Método Promesa ---
function llamarGato() {
    fetch(API_URL_RAMDOM) //el método fetch devuelve una promesa
        .then(res => res.json()) //convertimos la respuesta a algo que entienda js, un json por ejemplo
        .then(data => {
            const img = document.getElementById('img_gatito');
            img.src = data[0].url;
        });
}

//--- Método Async y await ---
//Carga gatos aleatoriamente
async function loadRandomMichis() {
    try {
        const respuesta = await fetch(API_URL_RAMDOM); //el método fetch devuelve una promesa, esta variable "respuesta", nos dice como quedo el status code, entrega una respuesta incluso sí falla
        const data = await respuesta.json(); //debe ir el await, sino va se rompe el código, puesto .json() retorna una promesa que entregará un objeto javaScript
        //esto espera a que se resuelva los awaits y después siguen con el resto de la fc
        console.log("Random Data")
        console.log(data)

        if (respuesta.status !== 200) { //valida que el status en la respuesta sea 200 (correcto)
            spanError.innerHTML = "Hubo un error: " + respuesta.status + " " + data.message;
        } else {
            const img1 = document.getElementById('img_gatito_1');
            const img2 = document.getElementById('img_gatito_2'); 
            const btn1 = document.getElementById('btn1'); 
            const btn2 = document.getElementById('btn2'); 

            img1.src = data[0].url;
            img2.src = data[1].url;

            btn1.onclick = () => saveFavoriteMichis(data[0].id);//al declararlo como una arrow fc apenas se declaraba la variable, se ejecutaba, ahora se declara la arrow fc y al hacer click se ejecuta la de adentro 
            btn2.onclick = () => saveFavoriteMichis(data[1].id);//btn1.onclick = saveFavoriteMichis(data[0].id)
        }

    } catch (err) {
        console.error("ERROR PUTITO", err);
    }
}

//carga los gatitos guardados en favoritos
async function loadFavoritesMichis() {
    try {
        const respuesta = await fetch(API_URL_FAVORITES, { //el método fetch devuelve una promesa
            method: 'GET',
            headers: {
                'x-api-key': "live_bHgRd3MqtiQbVqpR1KYNGOyjfDSVMYpnpLtXvTCLLykeK1Tii4Fkn8BC02l2zMJP"
            }
        });
        const data = await respuesta.json(); //debe ir el await, sino va se rompe el código
        //esto espera a que se resuelva los awaits y después siguen con el resto de la fc
        
        console.log("Favourite Data")
        console.log(data) //es un tipo array
    
        if (respuesta.status !== 200) { //valida que el status en la respuesta sea 200 (correcto)
            spanError.innerHTML = "Hubo un error: " + respuesta.status;
        } else {
            const section = document.getElementById('favoritesMichis');
            section.innerHTML = "";
            data.forEach(objGato => {
                const article = document.createElement('article');
                const img = document.createElement('img');
                const btn = document.createElement('button');
                const btnText = document.createTextNode('Sacar al michi de favoritos');
                
                img.src = objGato.image.url
                // img.width = 150; // forma para agregar la propiedad a width que estará en el html limitando el tamaño de la imagen
                btn.appendChild(btnText);
                btn.onclick = () => deleteFavouriteMiche(objGato.id);
                article.appendChild(img);//appendChild() coloca dentro de sí en el HTML
                article.appendChild(btn);//btn ya tiene incluido el texto
                section.appendChild(article);
            });
        }

    } catch (err) {
        console.error("ERROR PUTITO", err);
    }
}

//Guarda el gatito seleccionado en Favoritos
async function saveFavoriteMichis(id) {
    try {
        const res = await api.post('/favourites', { //codigo escrito con Axios
            image_id: id
        });


        // const res = await fetch(API_URL_FAVORITES, {
        //     method: 'POST', //Cuando la solicitud es distinta de GET, se debe especificar el contenido del header y el contenido del body
        //     headers: {
        //         "content-type": "application/json",
        //         'x-api-key': "live_bHgRd3MqtiQbVqpR1KYNGOyjfDSVMYpnpLtXvTCLLykeK1Tii4Fkn8BC02l2zMJP",
        //     },
        //     body: JSON.stringify({
        //         image_id: id 
        //     })
        // });
        // const data = await res.json();
        // console.log(res);
        
        if (res.status !== 200) { //valida que el status en la respuesta sea 200 (correcto)
            spanError.innerHTML = "Hubo un error: " + res.status + " " + data.message;
        } else {
            console.log(`Michi guardado en favoritos, id de la imagen: "${id}"`);
            loadFavoritesMichis(); //para que se carguen de nuevo con el michi agregado 
            const IMG = document.getElementById('imagePreview');
            IMG.src = "";
        }

    } catch (err) {
        console.log("entré al catch");
        console.log(err);
        if (res.status !== 200) { //valida que el status en la respuesta sea 200 (correcto)
            console.log("entré al res.status");
            spanError.innerHTML = "Hubo un error: " + res.status + " " + data.message;
        }
        if (err.status !== 200) { //valida que el status en la respuesta sea 200 (correcto)
            spanError.innerHTML = "Hubo un error: " + res.status + " " + data.message;
        }
        console.log("ERROR", err.status);
        console.log("ERRORO", err.message);
    }
}

//Sacar a un gato de la lista de favoritos
async function deleteFavouriteMiche(id) {
    const res = await fetch(API_URL_FAVORITES_DELETE(id), {
        method: 'DELETE',
        headers: {
            'x-api-key': "live_bHgRd3MqtiQbVqpR1KYNGOyjfDSVMYpnpLtXvTCLLykeK1Tii4Fkn8BC02l2zMJP"
        }
    });
    const data = await res.json();

    // console.log(res);
    if (res.status !== 200) { //valida que el status en la respuesta sea 200 (correcto)
        spanError.innerHTML = "Hubo un error: " + res.status + " " + data.message;
    } else {
        console.log(`Michi Eliminado de favoritos, id de la imagen: "${id}"`);
        loadFavoritesMichis();
    }
}

async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            'x-api-key': 'live_bHgRd3MqtiQbVqpR1KYNGOyjfDSVMYpnpLtXvTCLLykeK1Tii4Fkn8BC02l2zMJP'
        },
        body: formData,
    });
    const data = await res.json();
    console.log({ res });
    console.log(res);
    console.log({ data });
    console.log(data);

    spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`;
    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`;
        console.log({ data });
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        saveFavoriteMichis(data.id) //para agregar el michi cargado a favoritos.
        const imageUp = document.getElementById('fileUpload');
        const michiUp = document.getElementById('michiUp');
        imageUp.onchange = evt => {
            const [file] = imageUp.files
            if (file) {
                michiUp.src = URL.createObjectURL(file)
            }
        }
    }
}

function previewImage () {
    const IMG = document.getElementById('imagePreview');
    const reader = new FileReader();
    const filePreview = document.getElementById('fileUpload').files[0];
    reader.addEventListener('load', () => {
        IMG.src = reader.result; 
    }, false);
    if(filePreview) {
        reader.readAsDataURL(filePreview)
    }
}

//Se llama a la fc para que se apenas carga la pagina
loadRandomMichis();
loadFavoritesMichis();