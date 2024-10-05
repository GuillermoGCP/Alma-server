function extractFileInfo(url) {    
    // Obtener el pathname y dividirlo en partes
    const pathParts = new URL(url).pathname.split('/');
    
    // Obtener el nombre del archivo sin extensión y la carpeta anterior
    const fileNameWithoutExtension = pathParts.pop().split('.').slice(0, -1).join('.');
    const previousFolder = pathParts.pop();

    // Devolver la carpeta anterior y el nombre del archivo sin extensión
    return `${previousFolder}/${fileNameWithoutExtension}`;
}

export default extractFileInfo;


// Servicio para obtener el public_id a partir de la url de la foto