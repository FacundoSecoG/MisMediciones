let comidas = JSON.parse(localStorage.getItem('comidas')) || [];

const promedioInsulina = calcularPromedioInsulina();
document.getElementById('promedioInsulina').textContent = promedioInsulina;

const promedioCarbohidratos = calcularPromedioCarbohidratos();
document.getElementById('promedioCarbohidratos').textContent = promedioCarbohidratos;


const promedioGlucosa = calcularPromedioGlucosa();
document.getElementById('glucosaDiaria').textContent = promedioGlucosa;

function agregarComida(event) {
    event.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const insulina = document.getElementById('insulina').value;
    const glucosa = document.getElementById('glucosa').value;
    const carbohidratos = document.getElementById('carbohidratos').value;
    const alimentos = document.getElementById('comida').value;
    const tipoComida = document.getElementById('tipoComida').value;

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

    localStorage.setItem('comidas', JSON.stringify(comidas));

    document.getElementById('insulina').value = '';
    document.getElementById('glucosa').value = '';
    document.getElementById('carbohidratos').value = '';
    document.getElementById('comida').value = '';

    actualizarTablaComidas();

    const promedioInsulina = calcularPromedioInsulina();
    document.getElementById('promedioInsulina').textContent = promedioInsulina;

    const promedioCarbohidratos = calcularPromedioCarbohidratos();
    document.getElementById('promedioCarbohidratos').textContent = promedioCarbohidratos;

    const promedioGlucosa = calcularPromedioGlucosa();
    document.getElementById('glucosaDiaria').textContent = promedioGlucosa;
}

function actualizarTablaComidas() {
    // Start with a clean slate
    tablaComidas.innerHTML = "";

    let fechaSection = null;
    let tipoComidaSection = null;
    let fecha = null;
    let tipoComida = null;
    let fechaAnterior = null;
    let isFirstComida = true;
    let ordenComidas = {
        "desayuno": 1,
        "almuerzo": 2,
        "merienda": 3,
        "cena": 4
    };    

    comidas.sort((a, b) => {
        return new Date(b.fecha) - new Date(a.fecha);
    });
    
    comidas.sort((a, b) => {
        if (a.fecha === b.fecha) {
            return ordenComidas[a.tipoComida] - ordenComidas[b.tipoComida];
        }
    });

    comidas.forEach(comida => {

        // If we encounter a new date, create a new fechaSection
        // and reset the tipoComida tracker
        if (comida.fecha !== fecha) {
            fecha = comida.fecha;
            tipoComida = null;

            fechaSection = document.createElement('section');
            const fechaTitle = document.createElement('h2');
            fechaTitle.textContent = fecha;
            fechaSection.appendChild(fechaTitle);
            fechaSection.className = 'section-fecha'

            // Create hr element
            const hr = document.createElement('hr');
            hr.className = 'hr-comidas';

            // Append hr and fechaSection to tablaComidas
            if (fecha !== comidas[0].fecha) {
                tablaComidas.appendChild(hr);
            }
            tablaComidas.appendChild(fechaSection);
        }

        // If we encounter a new type of meal within the current date,
        // create a new tipoComidaSection
        if (comida.tipoComida !== tipoComida) {
            tipoComida = comida.tipoComida;

            tipoComidaSection = document.createElement('section');
            tipoComidaSection.className = 'section-Comidas';
            const tipoComidaTitle = document.createElement('h3');
            tipoComidaTitle.textContent = tipoComida;
            tipoComidaSection.appendChild(tipoComidaTitle);

            const table = document.createElement('table');
            table.innerHTML = `
                <tr>
                    <th>Hora</th>
                    <th>Insulina</th>
                    <th>Carbohidratos</th>
                    <th>Glucosa</th>
                    <th>Comida</th>
                </tr>
            `;
            tipoComidaSection.appendChild(table);

            fechaSection.appendChild(tipoComidaSection);
        }

        // Add a new row to the current tipoComidaSection
        const table = tipoComidaSection.querySelector('table');
        const rowHtml = `
            <tr>
                <td>${comida.hora}</td>
                <td>${comida.insulina}</td>
                <td>${comida.carbohidratos}</td>
                <td>${comida.glucosa}</td>
                <td>${comida.alimentos}</td>
            </tr>
        `;
        table.innerHTML += rowHtml;

        // Add the delete button outside the table, in the tipoComidaSection
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btnEliminar', 'top-right');
        btnEliminar.innerHTML = '<i class="fas fa-times"></i>';
        btnEliminar.className = 'btnEliminar';
        btnEliminar.addEventListener('click', function () {
            comidas = comidas.filter(c => c !== comida);
            localStorage.setItem('comidas', JSON.stringify(comidas));
            actualizarTablaComidas();
        });
        tipoComidaSection.appendChild(btnEliminar);
    });

    for (let fecha in comidasAgrupadas) {
        const tablaFecha = document.createElement('table');
        tablaFecha.innerHTML = `<thead><tr><td colspan="7">${fecha}</td></tr></thead><tbody></tbody>`;
        cuerpoTablaComidas.appendChild(tablaFecha);

        const cuerpoTablaFecha = tablaFecha.querySelector('tbody');

        for (let tipo in comidasAgrupadas[fecha]) {
            if (comidasAgrupadas[fecha][tipo].length > 0) {
                const filaTipo = document.createElement('tr');
                filaTipo.innerHTML = `<td colspan="7">${tipo}</td>`;
                cuerpoTablaFecha.appendChild(filaTipo);

                const filaHeaders = document.createElement('tr');
                filaHeaders.innerHTML = `
                <th>Hora</th>
                <th>Insulina</th>
                <th>Carbohidratos</th>
                <th>Glucosa</th>
                <th>Comida</th>
                <th>Eliminar</th>
                `;
                cuerpoTablaFecha.appendChild(filaHeaders);

                for (let comida of comidasAgrupadas[fecha][tipo]) {
                    const filaComida = document.createElement('tr');
                    filaComida.innerHTML = `
                        <td>${comida.hora}</td>
                        <td>${comida.insulina}</td>
                        <td>${comida.carbohidratos}</td>
                        <td>${comida.glucosa}</td>
                        <td>${comida.alimentos}</td>
                    `;

                    const btnEliminar = document.createElement('button');
                    const icon = document.createElement('i');
                    btnEliminar.className = 'btnEliminar';
                    icon.className = 'myIconClass';
                    icon.className = 'fas fa-trash fa-4x';
                    icon.style.color = 'red';
                    btnEliminar.appendChild(icon);
                    btnEliminar.classList.add('eliminar');

                    filaComida.appendChild(btnEliminar);

                    btnEliminar.addEventListener('click', function (event) {
                        event.preventDefault();
                        event.stopPropagation();

                        comidas = comidas.filter(c => c !== comida);

                        localStorage.setItem('comidas', JSON.stringify(comidas));

                        actualizarTablaComidas();
                    });

                    cuerpoTablaFecha.appendChild(filaComida);

                    const promedioInsulina = calcularPromedioInsulina();
                    document.getElementById('promedioInsulina').textContent = promedioInsulina;

                    const promedioCarbohidratos = calcularPromedioCarbohidratos();
                    document.getElementById('promedioCarbohidratos').textContent = promedioCarbohidratos;

                    const promedioGlucosa = calcularPromedioGlucosa();
                    document.getElementById('glucosaDiaria').textContent = promedioGlucosa;
                }
            }
        }
    }
}

document.getElementById('closeButton').addEventListener('click', function() {
    document.getElementById('welcomeImageContainer').style.display = 'none';
});

function calcularPromedioInsulina() {
    const promedioInsulina = Math.ceil(comidas.reduce((total, comida) => total + Number(comida.insulina), 0) / comidas.length);
    return (promedioInsulina)
}

function calcularPromedioCarbohidratos() {
    const promedioCarbohidratos = Math.ceil(comidas.reduce((total, comida) => total + Number(comida.carbohidratos), 0) / comidas.length);
    return (promedioCarbohidratos)
}

function calcularPromedioGlucosa() {
    const promedioGlucosa = Math.ceil(comidas.reduce((total, comida) => total + Number(comida.glucosa), 0) / comidas.length);
    return (promedioGlucosa)
}

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

document.getElementById('formularioComida').addEventListener('submit', agregarComida);

actualizarTablaComidas();