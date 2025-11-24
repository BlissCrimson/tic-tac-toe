let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentShape = 'circle'; // Startform

function init() {
    render();
}

function render() {
    const content = document.getElementById('content');

    let tableHTML = '<table>';

    for (let row = 0; row < 3; row++) {
        tableHTML += '<tr>';
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            const field = fields[index];

            let symbol = '';
            if (field === 'circle') {
                symbol = generateCircleSVG();
            } else if (field === 'cross') {
                symbol = generateCrossSVG();
            }

            tableHTML += `<td onclick="handleClick(${index}, this)">${symbol}</td>`;
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    content.innerHTML = tableHTML;
}

/* ---------------- Klickfunktion ---------------- */
function handleClick(index, tdElement) {
    if (fields[index] === null) {
        fields[index] = currentShape;

        if (currentShape === 'circle') {
            tdElement.innerHTML = generateCircleSVG();
            currentShape = 'cross';
        } else {
            tdElement.innerHTML = generateCrossSVG();
            currentShape = 'circle';
        }

        tdElement.onclick = null;

        const result = checkWin();
        if (result && result !== 'draw') {
            drawWinLine(result);
            alert(`${fields[result[0]]} gewinnt!`);
        } else if (result === 'draw') {
            alert("Unentschieden!");
        }
    }
}

/* ---------------- Spielende prüfen ---------------- */
function checkWin() {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Zeilen
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Spalten
        [0, 4, 8], [2, 4, 6]             // Diagonalen
    ];

    for (const combo of winCombos) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return combo; // Gewinnkombination gefunden
        }
    }

    if (fields.every(f => f !== null)) return 'draw';

    return null;
}

/* ---------------- Gewinnlinie zeichnen ---------------- */
function drawWinLine(combo) {
    const container = document.getElementById('content');
    const table = container.querySelector('table');
    if (!table) return;

    // Alte Linien löschen
    const existingLines = container.querySelectorAll('.win-line');
    existingLines.forEach(line => line.remove());

    // Mittelpunkt der Zellen bestimmen (SVG oder Zelle)
    function getCellCenter(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const cell = table.rows[row].cells[col];
        const innerSvg = cell.querySelector('svg');
        const rect = (innerSvg || cell).getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top  + rect.height / 2 - containerRect.top
        };
    }

    const start = getCellCenter(combo[0]);
    const end   = getCellCenter(combo[2]);

    // Linie als SVG-String
    const lineHTML = `
        <svg class="win-line" width="100%" height="100%" viewBox="0 0 ${container.clientWidth} ${container.clientHeight}" style="position:absolute; top:0; left:0; pointer-events:none;">
            <line 
                x1="${start.x}" y1="${start.y}" 
                x2="${start.x}" y2="${start.y}"
                stroke="white"
                stroke-width="6"
                stroke-linecap="round"
            >
                <animate attributeName="x2" from="${start.x}" to="${end.x}" dur="250ms" fill="freeze"/>
                <animate attributeName="y2" from="${start.y}" to="${end.y}" dur="250ms" fill="freeze"/>
            </line>
        </svg>
    `;

    container.innerHTML += lineHTML; // direkt im content einfügen
}

/* ---------------- SVG-Funktionen ---------------- */
function generateCircleSVG() {
    const size = 70;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle
                cx="${size / 2}"
                cy="${size / 2}"
                r="${radius}"
                stroke="#00B0EF"
                stroke-width="6"
                fill="none"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${circumference}"
            >
                <animate
                    attributeName="stroke-dashoffset"
                    from="${circumference}"
                    to="0"
                    dur="125ms"
                    fill="freeze"
                />
            </circle>
        </svg>
    `;
}

function generateCrossSVG() {
    const size = 70;
    const lineLength = Math.sqrt(2 * Math.pow(50, 2));
    const duration = "125ms";

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <line
                x1="15" y1="15"
                x2="55" y2="55"
                stroke="#FFC000"
                stroke-width="6"
                stroke-linecap="round"
                stroke-dasharray="${lineLength}"
                stroke-dashoffset="${lineLength}"
            >
                <animate attributeName="stroke-dashoffset" from="${lineLength}" to="0" dur="${duration}" fill="freeze" />
            </line>

            <line
                x1="55" y1="15"
                x2="15" y2="55"
                stroke="#FFC000"
                stroke-width="6"
                stroke-linecap="round"
                stroke-dasharray="${lineLength}"
                stroke-dashoffset="${lineLength}"
            >
                <animate attributeName="stroke-dashoffset" from="${lineLength}" to="0" dur="${duration}" fill="freeze" />
            </line>
        </svg>
    `;
}