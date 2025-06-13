function insertar(valor) {
    document.getElementById('pantalla').value += valor;
}

function borrarTodo() {
    document.getElementById('pantalla').value = '';
}

function retroceso() {
    let pantalla = document.getElementById('pantalla');
    pantalla.value = pantalla.value.slice(0, -1);
}

function calcular () {
    try {
        let resultado = eval(document.getElementById('pantalla').value);
        document.getElementById('pantalla').value = resultado;
    } catch {
        document.getElementById('pantalla').value = 'Error';
    }
}