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

//Dependencias
const express = require('express');
const app = express();
const fs = require('node:fs');

// Establecemos el puerto de la aplicación
process.loadEnvFile()
const PORT = process.env.PORT || 4000;

//Cargamos el fichero de datos
const escuela = fs.readFileSync('escuela.json', 'utf-8');
const escuelaData = JSON.parse(escuela);


app.get('/', (req, res) => {
    // =========================
    // Listado de alumnos via web
    // =========================
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

});



app.get('/:asignatura', (req, res) => {

    // =========================
    // Alumnos de la asignatura via web
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
    

});


app.get('/:nombre/:apellido', (req, res) => {
    // =========================
    // Datos de alumno via web
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
    


});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});

