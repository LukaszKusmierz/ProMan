export const htmlTemplates = {
    board: 1,
    card: 2
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.card]: cardBuilder
};

export function htmlFactory(template) {
    if (builderFunctions.hasOwnProperty(template)) {
        return builderFunctions[template];
    }

    console.error("Undefined template: " + template);

    return () => {
        return "";
    };
}

// function boardBuilder(board) {
//     return `<div class="board-container">
//                 <div class="board">
//                     <div class="board-header" data-board-id="${board.id}">${board.title}
//                     <button class="toggle-board-button" data-board-id="${board.id}">&#9660;</button></div>
//                 <div class="board-data" data-board-id="${board.id}"></div>
//                 </div>
//             </div>`;
//
// }

// function boardBuilder(board) {
//     return `<div class="board-container">
//                 <div class="board" data-board-id=${board.id}>${board.title}
//                 <button class="toggle-board-button" data-board-id="${board.id}">&#9660;</button></div>
//             </div>`;
// }

function boardBuilder(board) {
    return `
        <div class="accordion" id="boards">
            <div class="accordion-item" data-board-id="${board.id}">
                <h2 class="accordion-header" data-board-id="${board.id}" id="heading${board.id}">
                    <button class="accordion-button collapsed" data-board-id="${board.id}" type="button" data-bs-toggle="collapse" data-bs-target="#board${board.id}" aria-expanded="false" aria-controls="board${board.id}">
                        ${board.title}
                    </button>
                </h2>
                <div id="board${board.id}" class="accordion-collapse collapse" aria-labelledby="heading${board.id}" data-bs-parent="#boards">
                    <div class="accordion-body" data-board-id="${board.id}"></div>
                </div>
            </div>
        </div>
    `;
}

function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

