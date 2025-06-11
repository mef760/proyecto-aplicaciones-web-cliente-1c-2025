

type Persona = {
  nombre: string;
  edad: number;
  activo: boolean;
  estadoCivil?: EstadoCivil;
}

type Estudiante = {
  curso: string;
  calificacion: number;
} 

interface Empleado {
  nombre: string;
  edad: number;
  activo: boolean;
  puesto: string;
  getEdad(): number;
}

interface Director extends Empleado {
    departamento: string;
}



let empleado: Director;
empleado = {
  nombre: "Carlos",
  edad: 30,
  activo: true,
  puesto: "Desarrollador",
  departamento: "Tecnología",
  getEdad: function(): number {
    return this.edad;
  }
};



class Profesor implements Empleado {
  nombre: string;
  edad: number;
  activo: boolean;
    puesto: string;
    constructor(nombre: string, edad: number, activo: boolean) {
    this.nombre = nombre;
    this.edad = edad;
    this.activo = activo;
    this.puesto = "Profesor";
  }
  getEdad(): number {
    return this.edad;
  }

  asignarCurso(curso: string): void {
    console.log(`${this.nombre} ha asignado el curso ${curso}`);
  }
}

enum EstadoCivil {
  Soltero = "Soltero",
  Casado = "Casado",
  Divorciado = "Divorciado",
  Viudo = "Viudo"
}



let profesor = new Profesor("Ana", 35, true);


let alumno:  any;

alumno = {
  nombre: "Juan",
  edad: 20,
  activo: true
};

alumno = "hola mundo";


function mostrarPersona(persona: Persona): never {
  console.log(`Nombre: ${persona.nombre}, Edad: ${persona.edad}, Activo: ${persona.activo}`);
  if (persona.estadoCivil) {
    console.log(`Estado Civil: ${persona.estadoCivil}`);
  }
  throw new Error("Función no implementada");

}


const colores = ["rojo", "verde", "azul"] as const;
type Color = (typeof colores)[number];

let rojo: Color = "azul";
let verde: Color = "verde";
let azul: Color = "azul";


let nombres: Color[];
nombres = ["azul", "verde", "azul"];




interface Producto {
    readonly id: number;
    nombre: string;
    precio: number;
    disponible: boolean;
    categoria?: string;
}

let producto: Producto = {
    id: 1,
    nombre: "Laptop",
    precio: 1500,
    disponible: true
};


producto.nombre = "Laptop Gaming"; // Esto es válido
console.log(producto.id); // Esto causaría un error porque 'id' es readonly