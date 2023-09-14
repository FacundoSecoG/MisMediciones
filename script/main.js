let comidas = JSON.parse(localStorage.getItem('comidas')) || [];

const tipoComidaSelect = document.getElementById('tipoComida');
const insulinaTardiaContainer = document.getElementById('insulinaTardiaContainer');
const comidaNormalContainer = document.getElementById('tipoDeComidaNormal');
const formSioNo = document.getElementById('camposDelForm');

tipoComidaSelect.addEventListener('change', function () {
    actualizarFormulario();
});

function actualizarFormulario() {
    const tipoComida = tipoComidaSelect.value;

    if (tipoComida === 'Opciones') {
        formSioNo.style.display = 'none';
    } else if (tipoComida === 'insulinaTardia') {
        insulinaTardiaContainer.style.display = 'block';
        formSioNo.style.display = 'Block';
        comidaNormalContainer.style.display = 'none';
    } else {
        insulinaTardiaContainer.style.display = 'none';
        comidaNormalContainer.style.display = 'block';
        formSioNo.style.display = 'Block';
    }
}

function calcularPromedioInsulina() {
    let totalInsulina = 0;
    let count = 0;

    comidas.forEach(comida => {
        if (comida.tipoComida !== "insulinaTardia") {
            totalInsulina += parseFloat(comida.insulina);
            count++;
        }
    });

    if (count === 0) {
        return 0;
    }

    return (totalInsulina / count).toFixed(2);
}

function calcularPromedioCarbohidratos() {
    let totalCarbohidratos = 0;
    let count = 0;

    comidas.forEach(comida => {
        if (comida.tipoComida !== "insulinaTardia") {
            totalCarbohidratos += parseFloat(comida.carbohidratos);
            count++;
        }
    });

    if (count === 0) {
        return 0;
    }

    return (totalCarbohidratos / count).toFixed(2);
}

function calcularPromedioGlucosa() {
    let totalGlucosa = 0;
    let count = 0;

    comidas.forEach(comida => {
        if (comida.tipoComida !== "insulinaTardia") {
            totalGlucosa += parseFloat(comida.glucosa);
            count++;
        }
    });

    if (count === 0) {
        return 0;
    }

    return (totalGlucosa / count).toFixed(2);
}

const promedioInsulina = calcularPromedioInsulina();
document.getElementById('promedioInsulina').textContent = promedioInsulina;

const promedioCarbohidratos = calcularPromedioCarbohidratos();
document.getElementById('promedioCarbohidratos').textContent = promedioCarbohidratos;

const promedioGlucosa = calcularPromedioGlucosa();
document.getElementById('glucosaDiaria').textContent = promedioGlucosa;


document.getElementById("fecha").addEventListener("change", function () {
    var selectedDate = this.value;
    var table = document.getElementById("tablaComidas");
    var rows = table.getElementsByTagName("tr");

    var dateExists = false;
    for (var i = 1; i < rows.length; i++) {
        var rowDate = rows[i].cells[0].innerHTML;
        if (rowDate === selectedDate) {
            dateExists = true;
            break;
        }
    }

    var insulinaTardiaInput = document.getElementById("insulinaTardia");
    if (dateExists) {
        insulinaTardiaInput.style.display = "none";
    } else {
        insulinaTardiaInput.style.display = "block";
    }
});

function validarFormulario(event) {
    var seleccion = document.getElementById('tipoComida').value;

    if (seleccion === "Opciones") {
        event.preventDefault();
        alert('Por favor selecciona una opción');
    }
}


function agregarComida(event) {
    event.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const tipoComida = document.getElementById('tipoComida').value;

    if (tipoComida === 'insulinaTardia') {
        const insulinaTardia = document.getElementById('insulinaTardia').value;

        const comida = {
            fecha,
            hora,
            insulina: insulinaTardia,
            tipoComida: 'insulinaTardia'
        };

        const mealExists = comidas.some(c => c.fecha === comida.fecha && c.tipoComida === comida.tipoComida);

        if (mealExists) {
            alert('La comida ingresada ya existe.');
        } else {
            comidas.push(comida);
            localStorage.setItem('comidas', JSON.stringify(comidas));
            actualizarTablaComidas();
        }

        document.getElementById('insulinaTardia').value = '';
        document.getElementById('hora').value = '';
        document.getElementById('fecha').value = '';
    } else {
        const insulina = document.getElementById('insulina').value;
        const glucosa = document.getElementById('glucosa').value;
        const carbohidratos = document.getElementById('carbohidratos').value;
        const alimentos = document.getElementById('comida').value;

        const comida = {
            fecha,
            hora,
            insulina,
            glucosa,
            carbohidratos,
            alimentos,
            tipoComida
        };

        const mealExists = comidas.some(c => c.fecha === comida.fecha && c.tipoComida === comida.tipoComida);

        if (mealExists) {
            alert('La comida ingresada ya existe.');
        } else {
            comidas.push(comida);
            localStorage.setItem('comidas', JSON.stringify(comidas));
            actualizarTablaComidas();
        }

        document.getElementById('insulina').value = '';
        document.getElementById('glucosa').value = '';
        document.getElementById('carbohidratos').value = '';
        document.getElementById('alimentos').value = '';
        document.getElementById('hora').value = '';
        document.getElementById('fecha').value = '';
    }

    const promedioInsulina = calcularPromedioInsulina();
    document.getElementById('promedioInsulina').textContent = promedioInsulina;

    const promedioCarbohidratos = calcularPromedioCarbohidratos();
    document.getElementById('promedioCarbohidratos').textContent = promedioCarbohidratos;

    const promedioGlucosa = calcularPromedioGlucosa();
    document.getElementById('glucosaDiaria').textContent = promedioGlucosa;
}

function parseDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return Date.parse(`${year}-${month}-${day}`);
}


function actualizarTablaComidas() {
    const tablaComidas = document.getElementById('tablaComidas');
    tablaComidas.innerHTML = '';

    const sortingOrders = ['insulinaTardia', 'desayuno', 'almuerzo', 'merienda', 'cena'];

    if (comidas.length > 0) {
        const comidasOrdenadas = comidas.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            if (dateA > dateB) {
                return -1;
            }
            if (dateA < dateB) {
                return 1;
            }
            const orderComparison = sortingOrders.indexOf(a.tipoComida) - sortingOrders.indexOf(b.tipoComida);
            return orderComparison;
        });

        const seccionesPorFecha = {};

        comidasOrdenadas.forEach(comida => {
            if (!(comida.fecha in seccionesPorFecha)) {
                seccionesPorFecha[comida.fecha] = document.createElement('section');
                seccionesPorFecha[comida.fecha].classList.add('section-fecha');

                const fechaEncabezado = document.createElement('h2');
                fechaEncabezado.textContent = comida.fecha;
                seccionesPorFecha[comida.fecha].appendChild(fechaEncabezado);

                tablaComidas.appendChild(seccionesPorFecha[comida.fecha]);
            }

            const seccionTipoComida = document.createElement('section');
            seccionTipoComida.classList.add('section-Comidas');
            const tipoComidaEncabezado = document.createElement('h3');
            tipoComidaEncabezado.textContent = comida.tipoComida;
            tipoComidaEncabezado.classList.add('titulo-tablacomidas');
            seccionTipoComida.appendChild(tipoComidaEncabezado);

            const fila = document.createElement('tr');

            if (comida.tipoComida === "insulinaTardia") {
                const tabla = document.createElement('table');
                tabla.classList.add('tabla-registroDeComidas');

                const headerRow = document.createElement('tr');
                const headers = ['Hora', 'Insulina Lantus'];
                for (let i = 0; i < headers.length; i++) {
                    const th = document.createElement('th');
                    th.textContent = headers[i];
                    headerRow.appendChild(th);
                }
                tabla.appendChild(headerRow);

                const fila = document.createElement('tr');

                const celdaHora = document.createElement('td');
                celdaHora.textContent = comida.hora;
                fila.appendChild(celdaHora);

                const celdaInsulinaTardia = document.createElement('td');
                celdaInsulinaTardia.textContent = comida.insulina;
                fila.appendChild(celdaInsulinaTardia);

                tabla.appendChild(fila);
                seccionTipoComida.appendChild(tabla);

                const btnEliminar = document.createElement('button');
                btnEliminar.innerHTML = '<i class="fas fa-times"></i>';
                btnEliminar.classList.add('btnEliminar');
                btnEliminar.addEventListener('click', () => {
                    eliminarComida(comida);
                    fila.remove();
                    if (seccionTipoComida.children.length === 1) {
                        seccionTipoComida.remove();
                    }
                    if (Object.keys(seccionesPorFecha[comida.fecha].children).length === 1) {
                        seccionesPorFecha[comida.fecha].remove();
                    }
                });

                fila.appendChild(btnEliminar);
            } else {
                const tablaComidasTipo = document.createElement('table');
                tablaComidasTipo.classList.add('tabla-registroDeComidas');

                const cabecera = document.createElement('tr');
                const headers = ['Hora', 'Insulina', 'Glucosa', 'Carbohidratos', 'Alimentos'];

                for (let i = 0; i < headers.length; i++) {
                    const th = document.createElement('th');
                    th.textContent = headers[i];
                    cabecera.appendChild(th);
                }

                tablaComidasTipo.appendChild(cabecera);


                const hora = document.createElement('td');
                hora.textContent = comida.hora;
                fila.appendChild(hora);

                const insulina = document.createElement('td');
                insulina.textContent = comida.insulina;
                fila.appendChild(insulina);

                const glucosa = document.createElement('td');
                glucosa.textContent = comida.glucosa;
                fila.appendChild(glucosa);

                const carbohidratos = document.createElement('td');
                carbohidratos.textContent = comida.carbohidratos;
                fila.appendChild(carbohidratos);

                const alimentos = document.createElement('td');
                alimentos.textContent = comida.alimentos;
                fila.appendChild(alimentos);

                tablaComidasTipo.appendChild(fila);
                seccionTipoComida.appendChild(tablaComidasTipo);
            }

            const btnEliminar = document.createElement('button');
            btnEliminar.innerHTML = '<i class="fas fa-times"></i>';
            btnEliminar.classList.add('btnEliminar');
            btnEliminar.addEventListener('click', () => {
                eliminarComida(comida);
                fila.remove();
                if (seccionTipoComida.children.length === 1) {
                    seccionTipoComida.remove();
                }
                if (Object.keys(seccionesPorFecha[comida.fecha].children).length === 1) {
                    seccionesPorFecha[comida.fecha].remove();
                }
            });

            fila.appendChild(btnEliminar);

            seccionesPorFecha[comida.fecha].appendChild(seccionTipoComida);
        });

        const fechas = Object.keys(seccionesPorFecha);
        for (let i = 0; i < fechas.length - 1; i++) {
            const hr = document.createElement('hr');
            hr.classList.add('hr-comidas');
            tablaComidas.insertBefore(hr, seccionesPorFecha[fechas[i + 1]]);
        }
    }
}










function eliminarComida(comida) {
    const index = comidas.findIndex(c => c === comida);
    if (index !== -1) {
        comidas.splice(index, 1);

        // Guardar los cambios en el almacenamiento local
        localStorage.setItem('comidas', JSON.stringify(comidas));

        // Actualizar la tabla de comidas en la interfaz de usuario
        actualizarTablaComidas();
    }
}












document.getElementById('closeButton').addEventListener('click', function () {
    document.getElementById('welcomeImageContainer').style.display = 'none';
});

function generarPDF() {
    event.preventDefault();
    let doc = new jsPDF();

    // Set the fill color to gray
    doc.setFillColor(169, 169, 169); // RGB color code for gray
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');

    // Set the text color to white
    doc.setTextColor(255, 255, 255); // RGB color code for white

    let tablaComidas = document.getElementById('tablaComidas');

    html2canvas(tablaComidas).then(canvas => {
        let imgData = canvas.toDataURL('image/png');

        // Get the dimensions of the PDF page
        let pdfWidth = doc.internal.pageSize.getWidth();
        let pdfHeight = doc.internal.pageSize.getHeight();

        // Calculate the aspect ratio of the canvas
        let canvasAspectRatio = canvas.width / canvas.height;

        // Calculate the width and height of the image, maintaining its aspect ratio
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / canvasAspectRatio;

        // If the height exceeds the page height, adjust the dimensions
        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight * canvasAspectRatio;
        }

        // Calculate the position to center the image
        let imgPosX = (pdfWidth - imgWidth) / 2;
        let imgPosY = (pdfHeight - imgHeight) / 2;

        // Add the image to the PDF, adjusting the position and dimensions as per your requirements
        doc.addImage(imgData, 'PNG', imgPosX, imgPosY, imgWidth, imgHeight);

        doc.save('comidas.pdf');
    });
}

function generarExcel() {
    event.preventDefault();
    let comidasFiltradas = comidas.filter(comida => comida !== null && comida !== undefined);

    let ordenComidas = {
        "desayuno": 1,
        "almuerzo": 2,
        "merienda": 3,
        "cena": 4
    };

    comidasFiltradas.sort((a, b) => {
        let dateComparison = new Date(b.fecha) - new Date(a.fecha); // Change this line
        if (dateComparison !== 0) return dateComparison;

        return ordenComidas[a.tipoComida] - ordenComidas[b.tipoComida];
    });

    let wb = XLSX.utils.book_new();

    let ws = XLSX.utils.json_to_sheet(comidasFiltradas);

    let colWidths = comidasFiltradas.reduce((widths, row) => {
        Object.keys(row).forEach((key, i) => {
            let len = (row[key] || '').toString().length;
            if (widths[i] < len) {
                widths[i] = len;
            }
        });
        return widths;
    }, new Array(Object.keys(comidasFiltradas[0]).length).fill(0));

    Object.keys(comidasFiltradas[0]).forEach((key, i) => {
        let len = key.length;
        if (colWidths[i] < len) {
            colWidths[i] = len;
        }
    });

    ws['!cols'] = colWidths.map(w => ({ wch: w }));

    XLSX.utils.book_append_sheet(wb, ws, "Comidas");

    XLSX.writeFile(wb, "comidas.xlsx");
}

let argentina_datetime_str = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
let date_argentina = new Date(argentina_datetime_str);

let year = date_argentina.getFullYear();
let month = ("0" + (date_argentina.getMonth() + 1)).slice(-2);
let date = ("0" + date_argentina.getDate()).slice(-2);
let date_time = year + "-" + month + "-" + date;

document.getElementById('fecha').value = date_time;

let ahora = new Date();
let horas = ahora.getHours();
let minutos = ahora.getMinutes();
horas = horas < 10 ? '0' + horas : horas;
minutos = minutos < 10 ? '0' + minutos : minutos;
document.getElementById('hora').value = horas + ':' + minutos;

document.getElementById('formularioComida').addEventListener('submit', function (event) {
    agregarComida(event);
    validarFormulario(event);
});

document.getElementById('tipoComida').addEventListener('change', actualizarFormulario);


document.addEventListener('DOMContentLoaded', (event) => {
    actualizarTablaComidas();
});

window.addEventListener('load', function () {
    actualizarFormulario();
});
