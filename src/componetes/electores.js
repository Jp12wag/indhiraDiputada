const fs = require('fs');
const pdf = require('pdf-parse');
const PDFExtract = require('pdf.js-extract').PDFExtract;

// Instalar pdf.js-extract utilizando npm: npm install pdf.js-extract

/* Función para extraer el número de cédula del PDF
const dataBuffer = fs.readFileSync('../archivo/M0024.pdf');

function extraerCedula() {  
        let cedula=['001-0136825-6'];
        pdf(dataBuffer).then(function(data) {
   
            const text = data.text;
            const lines = text.split('\n');
           
            lines.forEach(line => {
    
                const trimmedLine = line.trim();
    
                const cedulaMatch = trimmedLine.match(/^\d{3}-\d{7}-\d$/);
                if(trimmedLine.startsWith(cedulaMatch)){
                cedula.push(trimmedLine);
                }
              
            });
        })

       
        return cedula;
}
*/
async function extraerFotos(pdfPath, outputFolder) {
    try {
        const pdfExtract = new PDFExtract();
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdfExtract.extractBuffer(dataBuffer);

        // Verificar si la extracción del PDF fue exitosa
        if (!data || !data.pages || !Array.isArray(data.pages)) {
            throw new Error('Extracción de PDF fallida o datos no válidos.');
        }

        data.pages.forEach((page, pageIndex) => {
            if (!page || !page.images || !Array.isArray(page.images)) {
                console.error(`No se encontraron imágenes en la página ${page.images}.`);
                return; // Salir de la iteración actual si no hay imágenes
            }
            
            page.images.forEach((image, imageIndex) => {
                const imagePath = `${outputFolder}/image_${pageIndex}_${imageIndex}.png`;
                fs.writeFileSync(imagePath, Buffer.from(image.data, 'base64'));
                console.log('Imagen guardada:', imagePath);
            });
        });
    } catch (error) {
        console.error('Error al extraer imágenes:', error);
    }
}


async function extraerImagenes() {
    const pdfExtract = new PDFExtract();
    const pdfPath = '../archivo/M0024.pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfExtract.extractBuffer(dataBuffer);

    // Verificar si la extracción del PDF fue exitosa
    if (!data || !data.pages || !Array.isArray(data.pages)) {
        throw new Error('Extracción de PDF fallida o datos no válidos.');
    }

    // Recorrer las páginas del PDF
    data.pages.forEach((page, pageIndex) => {
        // Verificar si la página tiene imágenes
        if (page.images && Array.isArray(page.images)) {
            // Recorrer las imágenes de la página
            page.images.forEach((image, imageIndex) => {
                // Acceder a los datos de la imagen
                const imageData = image.data;
                const imageType = image.type;
                console.log("esto es una imagen"+imageData)

                // Hacer algo con los datos de la imagen, como guardarla en disco
                // fs.writeFileSync(`image_${pageIndex}_${imageIndex}.${imageType}`, imageData);
            });
        }
    });
}

// Ejemplo de uso

extraerImagenes()
    .then(() => {
        console.log('Imágenes extraídas correctamente.');
    })
    .catch(error => {
        console.error('Error:', error);
    });


// Función para renombrar las imágenes con el número de cédula
function renombrarImagenes(outputFolder, cedula) {
    fs.readdirSync(outputFolder).forEach(file => {
        if (file.endsWith('.png')) {
            const oldPath = `${outputFolder}/${file}`;
            const newPath = `${outputFolder}/${cedula}.png`;
            fs.renameSync(oldPath, newPath);
        }
    });
}

// Función principal
async function main(pdfPath) {
    const outputFolder = 'output_images';
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
    }

    try {
        // Extraer el número de cédula
        const cedula = '001-0136825-6';
        if (cedula) {
            console.log('Número de cédula encontrado:', cedula);

            // Extraer las imágenes
            await extraerFotos(pdfPath,outputFolder);
         
            // Renombrar las imágenes con el número de cédula
            renombrarImagenes(outputFolder, cedula);
            console.log('Imágenes extraídas y renombradas correctamente.');
        } else {
            console.log('No se encontró el número de cédula en el PDF.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const pdfPath = '../archivo/M0024.pdf'; // Ruta del PDF
main(pdfPath);
