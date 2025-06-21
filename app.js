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
// Aquí empezamos con el programa parte web:
// ------------------------------------------------------------------------------------
// Opciones:
// Vacio -> Listado de alumnos
// Asignatura -> Alumnos de una asignatura
// Nombre y apellido -> Datos de un alumno
// ------------------------------------------------------------------------------------

//Dependencias
const express = require('express');
const app = express();
const fs = require('node:fs');
const path = require("node:path");

// Establecemos el puerto de la aplicación
// process.loadEnvFile()
const PORT = 4000; // || process.env.PORT;

//Middleware para parsear el cuerpo de las peticiones
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios
app.use(express.json()); // Middleware para parsear JSON

//Ruta de acceso a los archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Cargamos el fichero de datos
// const escuela = fs.readFileSync('escuela.json', 'utf-8');
const escuelaData = require("./escuela.json");


// Peticion de todos los alumnos
app.get('/api', (req, res) => {
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
    // Mostramos los datos de los alumnos en el servidor web en formato JSON
    // console.log(escuelaData);    
    res.json(escuelaData);
});


// Petición de alumnos por asignatura
app.get('/api/:asignatura', (req, res) => {
    // =========================
    // Alumnos de la asignatura via web
    // =========================
    // Obtenemos la asignatura de los parámetros de la URL
    const asignatura = req.params.asignatura;

    // Comprobamos si la asignatura existe en la lista de alumnos
    const asignaturaExistente = escuelaData.some(alumno => alumno.asignatura === asignatura);

    // Filtramos los alumnos por la asignatura
    const alumnosAsignatura = escuelaData.filter(alumno => alumno.asignatura === asignatura);
    
    // Vamos a filtrar para obtener todas las asignaturas unitariamente
    // Esto nos servirá para mostrar las asignaturas disponibles si la solicitada no existe
    const asignaturas = [];
    escuelaData.forEach(alumno => {
        let asignaturaSeleccionada = alumno.asignatura;
        // Comprobamos si la asignatura ya está en el array
        if (asignaturas.includes(asignaturaSeleccionada)) {
            return; // Si ya está, no la añadimos
        }
        // Si no está, la añadimos al array
        asignaturas.push(asignaturaSeleccionada);
    });

    // Si la asignatura no existe, mostramos un mensaje
    if (!asignaturaExistente) {
        // Si la asignatura no existe, mostramos el listado de asignaturas
        return res.status(404).send(`No existe la asignatura ${asignatura}. <br> Las asignaturas disponibles son: <br> ${asignaturas .join('<br>')}`);
    }

    // Si no hay alumnos en la asignatura, mostramos un mensaje
    if (alumnosAsignatura.length === 0) {
        return res.status(404).send(`No hay alumnos matriculados en la asignatura ${asignatura}`);
    }

    // Ordenamos los alumnos por apellido, nombre y edad
    alumnosAsignatura.sort((a, b) => {
        if (a.apellido === b.apellido) {
            if (a.nombre === b.nombre) {
                return a.edad - b.edad;
            }
            return a.nombre.localeCompare(b.nombre);
        }
        return a.apellido.localeCompare(b.apellido);
    });

    // Mostramos los datos de los alumnos en la asignatura en formato JSON
    // console.log(alumnosAsignatura);
    res.json({
        // Nombre de la asignatura
        asignatura: asignatura,
        // Alumnos matriculados en la asignatura
        alumnos: alumnosAsignatura,
        // Total de alumnos matriculados en la asignatura
        total: alumnosAsignatura.length
    });    
});


app.get('/api/:nombre/:apellido', (req, res) => {
    // =========================
    // Datos de alumno via web
    // =========================
    // Obtenemos el nombre y apellido de los parámetros de la URL
    const { nombre, apellido } = req.params;
    
    // Buscamos el alumno en la lista con find por simplicidad
    // y filtramos las asignaturas del alumno con filter
    const alumno = escuelaData.find(alumno => alumno.nombre === nombre && alumno.apellido === apellido);
    const asignaturasAlumno = escuelaData.filter(alumno => alumno.nombre === nombre && alumno.apellido === apellido)

    // Si no encontramos al alumno, mostramos un mensaje
    if (!alumno) {
        return res.status(404).send(`No tenemos matriculado a ese alumno ${nombre} ${apellido}`);
    }
    // Mostramos los datos del alumno
    // console.log(asignaturasAlumno);
    res.json({asignaturasAlumno
    }); 
});

app.get('/', (req, res) => {
    // =========================
    // Página de inicio
    // =========================
    res.render('root', {escuelaData});
});

app.get('/:asignatura', (req, res) => {
    // =========================
    // Página de asignatura
    // =========================
    // Obtenemos la asignatura de los parámetros de la URL
    const asignatura = req.params.asignatura;
    // Comprobamos si la asignatura existe en la lista de alumnos
    const asignaturaExistente = escuelaData.some(alumno => alumno.asignatura === asignatura);
    // Filtramos los alumnos por la asignatura
    const alumnosAsignatura = escuelaData.filter(alumno => alumno.asignatura === asignatura);
    // Vamos a filtrar para obtener todas las asignaturas unitariamente
    // Esto nos servirá para mostrar las asignaturas disponibles si la solicitada no existe
    const asignaturas = [];
    escuelaData.forEach(alumno => {
        let asignaturaSeleccionada = alumno.asignatura;
        // Comprobamos si la asignatura ya está en el array
        if (asignaturas.includes(asignaturaSeleccionada)) {
            return; // Si ya está, no la añadimos
        }
        // Si no está, la añadimos al array
        asignaturas.push(asignaturaSeleccionada);
    });
    // Si la asignatura no existe, mostramos un mensaje
    if (!asignaturaExistente) {
        // Si la asignatura no existe, mostramos el listado de asignaturas
        return res.status(404).send(`No existe la asignatura ${asignatura}. <br> Las asignaturas disponibles son: <br> ${asignaturas.join('<br>')}`);
    }
    // Si no hay alumnos en la asignatura, mostramos un mensaje
    if (alumnosAsignatura.length === 0) {
        return res.status(404).send(`No hay alumnos matriculados en la asignatura ${asignatura}`);
    }
    // Ordenamos los alumnos por apellido, nombre y edad
    alumnosAsignatura.sort((a, b) => {
        if (a.apellido === b.apellido) {
            if (a.nombre === b.nombre) {
                return a.edad - b.edad;
            }
            return a.nombre.localeCompare(b.nombre);
        }
        return a.apellido.localeCompare(b.apellido);
    });
    // Mostramos los datos de los alumnos en la asignatura en formato JSON
    // console.log(alumnosAsignatura);
    // console.log(asignatura);
    
    res.render('asignatura', {alumnosAsignatura, asignatura});//, asignatura, total: alumnosAsignatura.length});
});

// Ruta para obtener los datos de un alumno por nombre y apellido
app.get('/:nombre/:apellido', (req, res) => {
    // =========================
    // Página de alumno
    // =========================
    // Obtenemos el nombre y apellido de los parámetros de la URL
    const { nombre, apellido } = req.params;
    
    // Buscamos el alumno en la lista con find por simplicidad
    // y filtramos las asignaturas del alumno con filter
    const alumno = escuelaData.find(alumno => alumno.nombre === nombre && alumno.apellido === apellido);
    const asignaturasAlumno = escuelaData.filter(alumno => alumno.nombre === nombre && alumno.apellido === apellido);

    // Si no encontramos al alumno, mostramos un mensaje
    if (!alumno) {
        return res.status(404).send(`No tenemos matriculado a ese alumno ${nombre} ${apellido}`);
    }
    
    // Mostramos los datos del alumno
    // console.log(asignaturasAlumno);
    
    res.render('alumno', {asignaturasAlumno, nombre, apellido});
    
});

// Manejo de errores 404 por si la ruta no existe
app.use((req, res) => {
    // =========================
    // Error 404
    // =========================
    // Si la ruta no existe, mostramos un mensaje de error
    res.status(404).send('Error: Ruta no encontrada');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});
