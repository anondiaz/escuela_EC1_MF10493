// APLICACIÓN: ESCUELA

// El objetivo es matricular alumnos en una escuela y poder mostrar esa información.
// Utilizaremos un fichero llamado escuela.js para la programación y otro llamado escuela.json
// para guardar los datos.

// La matriculación se realizará así:
// node escuela.js nombre_alumno apellido_alumno edad asignatura

// Nota 1: No sabremos por adelantado cuáles son las asignaturas.
// Nota 2: Admitiremos nombres compuestos si se escriben 
// con un guión en medio, así: Anna-Maria

// En cada matriculación los datos del alumno se incorporarán al fichero .json,
// donde quedarán registrados en ese formato, obviamente.

// Podremos borrar un alumno de la lista así:
// node escuela.js nombre_alumno apellido_alumno -1
// Si el alumno no está en la lista debe aparecer este mensaje:
// "No tenemos matriculado a ese alumno"

// Si escribimos:
// node escuela.js
// Apareceran los datos de todos los alumnos, así:

// Alumnos matriculados
// ====================
// nombre_1 apellido_1 edad_1 asignatura_x
// nombre_2 apellido_2 edad_2 asignatura_y
// ...
// nombre_n apellido_n edad_n asignatura_z
// ---------------------------------------
// Total: n alumnos matriculados

// Ordenados por apellido, nombre, asignatura de forma descendente
// (de la A a Z)

// Si escribimos:
// node escuela.js nombre_alumno apellido_alumno
// Deben aparecer las asignaturas en las que está matriculado así:

// El alumno nombre_alumno apellido_alumno está matriculado de:
//     -- X 
//     -- Y

// Pero si no estuviera en la lista debe aparecer este mensaje:
// "No tenemos matriculado a ese alumno"

// Si escribimos:
// node escuela.js asignatura (cualquiera que sea)
// Aparecerán los datos de los alumnos matriculados en ella, así:

// Alumnos matriculados en X (X es la asignatura)
// =========================
// nombre_1 apellido_1 edad_1
// nombre_2 apellido_2 edad_2
// ...
// nombre_n apellido_n edad_n
// --------------------------------
// Total: n alumnos matriculados

// Cualquier otra forma de acceder a los datos debe de considerarse un error
// y debe aparecer el correspondiente mensaje

// ------------------------------------------------------------------------------------

// Cuando funcione la versión por terminal prepara otra por servidor web, así:

// http://localhost:4000/ <- todos los alumnos
// http://localhost:4000/nombre_alumno/apellido_alumno <- datos de un alumno
// http://localhost:4000/asignatura <- alumnos de una asignatura

// ------------------------------------------------------------------------------------
// Aquí empezamos con el programa:
// ------------------------------------------------------------------------------------
// Opciones:
// Vacio -> Listado de alumnos
// Asignatura -> Alumnos de una asignatura
// Nombre y apellido -> Datos de un alumno
// Nombre, apellido y -1 -> Borrar un alumno
// Nombre, apellido, edad y asignatura -> Matricular un alumno
// ------------------------------------------------------------------------------------

// Funcion para establecer el titulo del proceso
function establecerTitulo(titulo) {
    
    tituloProceso = titulo;
    console.log(tituloProceso);
    console.log("=".repeat(tituloProceso.length - 1) + "\n");
}

//Cargamos el fichero de datos
const fs = require('node:fs');
const escuela = fs.readFileSync('escuela.json', 'utf-8');
const escuelaData = JSON.parse(escuela);

// Definimos el título del proceso
let tituloProceso = "";

// Recuperamos los argumentos de la línea de comandos
const argumento1 = process.argv[2];
const argumento2 = process.argv[3];
const argumento3 = process.argv[4];
const argumento4 = process.argv[5];

// Leemos los argumentos de la línea de comandos
if (process.argv.length == 2 ) { // 2 + 0 = 2 (0 - 1)
    // =========================
    // Listado de alumnos
    // =========================
    // Llamamos a la función para establecer el título
    tituloProceso = "\nAlumnos matriculados :";
    establecerTitulo(tituloProceso);
    // Ordenamos los alumnos por apellido, nombre y asignatura
    escuelaData.sort((a, b) => {
        if (a.apellido === b.apellido) {
            if (a.nombre === b.nombre) {
                return a.asignatura.localeCompare(b.asignatura);
            }
            return a.nombre.localeCompare(b.nombre);
        }
        return a.apellido.localeCompare(b.apellido);
    });
    // Mostramos los datos de los alumnos
    escuelaData.forEach(alumno => {
        console.log(`${alumno.nombre} ${alumno.apellido} ${alumno.edad} ${alumno.asignatura}`);
    });
    console.log("\n" + "-".repeat(tituloProceso.length - 1) + "\n");
    console.log(`Total: ${escuelaData.length} alumnos matriculados\n`);
    // console.log(escuelaData);
    // console.log(process.argv.length);
    process.exit(1);
} else if (process.argv.length == 3) { // 2 + 1 = 3 (2 - 2)
    // =========================
    // Alumnos de la asignatura
    // =========================
    // Comprobamos si el argumento es una asignatura valida
    if (!escuelaData.some(alumno => alumno.asignatura === argumento1)) {
            // Montamos el titulo del proceso
        tituloProceso = `\nNo tenemos matriculado a ningún alumno en ${argumento1} :`;
        establecerTitulo(tituloProceso);
        // console.log(process.argv.length);
        //vamos a mostrar las asignaturas disponibles
        console.log("Asignaturas disponibles :\n");
        const asignaturas = [];
        escuelaData.forEach(alumno => {
            let asignaturaSeleccionada = alumno.asignatura;
            // Comprobamos si la asignatura ya está en el array
            if (asignaturas.includes(asignaturaSeleccionada)) {
                return; // Si ya está, no la añadimos
            }
            asignaturas.push(asignaturaSeleccionada);
        });
        // console.log(asignaturas);
        asignaturas.forEach(asignatura => {
            console.log(`- ${asignatura}`);
        });
        process.exit(1);
    }

    // Montamos el titulo del proceso
    tituloProceso = `\nAlumnos matriculados en ${argumento1} :`;
    establecerTitulo(tituloProceso);
    // Filtramos los alumnos por asignatura
    alumnosMatriculados = 0;
    escuelaData.forEach(alumno => {
        if (alumno.asignatura === argumento1) {
            console.log(`${alumno.nombre} ${alumno.apellido} ${alumno.edad}`);
            alumnosMatriculados++;
        }
    });
    console.log("\n" + "-".repeat(tituloProceso.length - 1) + "\n");
    console.log(`Total: ${alumnosMatriculados} alumnos matriculados\n`);
    // console.log(process.argv.length);
    process.exit(1);
} else if (process.argv.length == 4) { // 2 + 2 = 4 (2 - 3)
    // =========================
    // Datos de alumno
    // =========================
    // Comprobamos si el alumno está matriculado
    const alumno = escuelaData.find(alumno => 
        alumno.nombre === argumento1 && alumno.apellido === argumento2
    );
    if (!alumno) {
        // Montamos el titulo del proceso
        tituloProceso = `\nNo tenemos matriculado a ese alumno :`;
        establecerTitulo(tituloProceso);
        console.log(`${argumento1} ${argumento2} no está matriculado`);
        process.exit(1);
    }
    // Montamos el titulo del proceso
    //El alumno nombre_alumno apellido_alumno
    tituloProceso = `\nEl alumno ${argumento1} ${argumento2} está matriculado de :`;
    establecerTitulo(tituloProceso);

    escuelaData.forEach(alumno => {
        if (alumno.nombre == argumento1 && alumno.apellido == argumento2) {
            console.log(`-- ${alumno.asignatura}`);
        }
    });
    
    // console.log(process.argv.length);
    process.exit(1);
} else if (process.argv.length == 5 && process.argv[4] == '-1') { // 2 + 3 = 5 (2 - 4)
    // =========================
    // Borrar alumno
    // =========================
    // Comprobamos si el tercer argumento es -1
    if (argumento3 !== '-1') {
        // Montamos el titulo del proceso
        tituloProceso = `\nPara borrar el tercer argumento debe ser -1 :`;
        establecerTitulo(tituloProceso);
        // console.log("Error: El tercer argumento debe ser -1 para borrar un alumno");
    } else {
        // Comprobamos si el alumno está matriculado
        const alumnoIndex = escuelaData.findIndex(alumno =>
            alumno.nombre === argumento1 &&
            alumno.apellido === argumento2
        );
        if (alumnoIndex === -1) {
            // Montamos el titulo del proceso
            tituloProceso = `\nNo tenemos matriculado a ese alumno :`;
            establecerTitulo(tituloProceso);
            console.log(`${argumento1} ${argumento2} no está matriculado`);
            process.exit(1);
        }
        tituloProceso = `\nEl alumno ${argumento1} ${argumento2} ha sido borrado`;
        establecerTitulo(tituloProceso);
        // Borramos el alumno
        escuelaData.splice(alumnoIndex, 1);
        // Guardamos los cambios en el fichero  
        fs.writeFileSync('escuela.json', JSON.stringify(escuelaData, null, 2), 'utf-8');
        console.log(`${argumento1} ${argumento2} ha sido borrado`);
    }    
    
    // console.log(process.argv.length);
    process.exit(1);
} else if (process.argv.length == 6) { // 2 + 4 = 6 (2 - 5)
    // =========================
    // Matriculación de alumno
    // =========================
    // Comprobamos si el alumno ya esta matriculado en la asignatura
    const alumnoExistente = escuelaData.find(alumno => 
        alumno.nombre === argumento1 && 
        alumno.apellido === argumento2 && 
        alumno.asignatura === argumento4
    );
    if (alumnoExistente) {
        // Montamos el titulo del proceso
        tituloProceso = `\nEl alumno ${argumento1} ${argumento2} ya está matriculado en ${argumento4} :`;
        establecerTitulo(tituloProceso);
        process.exit(1);
    }
    // Llamamos a la función para establecer el título
    tituloProceso = "\nMatriculado el alumno :";
    establecerTitulo(tituloProceso);
    console.log(`${argumento1} ${argumento2} en ${argumento4}`);

    // console.log(tituloProceso);
    // console.log("=".repeat(tituloProceso.length - 1) + "\n");
    // console.log(nombreAlumno, apellidoAlumno, edadAlumno, asignatura);

    escuelaData.push({
        nombre: argumento1,
        apellido: argumento2,
        edad: parseInt(argumento3, 10),
        asignatura: argumento4
    });

    fs.writeFileSync('escuela.json', JSON.stringify(escuelaData, null, 2), 'utf-8');

    // console.log(escuelaData);
    // console.log(process.argv.length);
    process.exit(1);
} else {
    // =========================
    // Error
    // =========================
    console.log("Error: Parámetros incorrectos");
    console.log("Uso: node escuela.js [nombre_alumno] [apellido_alumno] [edad] [asignatura]");
    console.log("O: node escuela.js [nombre_alumno] [apellido_alumno] -1");
    console.log("O: node escuela.js [asignatura]");
    console.log("O: node escuela.js");
    // console.log(process.argv.length);
    process.exit(1);
}



