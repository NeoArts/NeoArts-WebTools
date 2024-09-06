const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function getSpanishFormattedDate() {
    const today = new Date();
    
    const day = today.getDate();
    const year = today.getFullYear();
    
    const monthName = monthNames[today.getMonth()];
    
    return `${day} de ${monthName} de ${year}`;
}

export function getLastMonth() {
    const today = new Date();
    
    const monthName = monthNames[(today.getMonth() - 1 + 12) % 12];
    return monthName;
}