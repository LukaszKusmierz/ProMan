
export const htmlTemplates = {
    board: 1,
    status: 2,
    card: 3
}

export const builderFunctions = {
    [htmlTemplates.board]: boardBuilder,
    [htmlTemplates.status]: statusBuilder,
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
    console.log('board object:', board);
    return `
        <div class="accordion" id="boards">
            <div class="accordion-item" data-board-id="${board.id}">
                <h2 class="accordion-header" data-board-id="${board.id}" id="heading${board.id}">
                    <button class="accordion-button collapsed" data-board-id="${board.id}" type="button" data-bs-toggle="collapse" data-bs-target="#board${board.id}" aria-expanded="false" aria-controls="board${board.id}">
                        <a id="renameBoardLink" data-bs-toggle="modal" data-bs-target="#renameBoardModal" data-board-id="${board.id}" href="#renameBoardModal">
                        ${board.title}
                        </a>
                    </button>
                </h2>
                <div id="board${board.id}" class="accordion-collapse collapse" aria-labelledby="heading${board.id}" data-bs-parent="#boards">
                    <div class="accordion-body" data-board-id="${board.id}">                        
                        <button type="button" id="addStatusButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addStatusModal" data-board-id="${board.id}">Add status</button> 
                        <button type="button" id="addCardButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#addCardModal" data-board-id="${board.id}"> Add Card</button>
                        <button type="button" id="deleteBoardButton" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#deleteBoardModal" data-board-id="${board.id}">Delete Board</button>                        
                          <div class="container text-center" id="containerColumn">
                            <div class="row align-items-start">        
                               ${board.statuses.map(status => statusBuilder(status, board)).join("")}
                            </div>
                          </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function statusBuilder(status, board) {
    return `<div class="col draggable-column" id="${status.status_id}" draggable="true" data-board-id="${board.id}">
                <a id="rename" data-bs-toggle="modal" data-bs-target="#renameStatusModal" data-id="${status.status_id}" data-board-id="${board.id}" href="#renameStatusModal">
                  ${status.title}
                </a>
                <div class="col-body" col-body-id="${status.status_id}">
                    ${status.cards.map(card => cardBuilder(card)).join("")}
                </div>
            </div>`
}

function cardBuilder(card) {
    return `<div class="card" id="${card.card_id}" status-id="${card.status_id}" draggable="true">
                <h3>${card.card_title}</h3>
                <p>${card.card_message}</p>
            </div>`;
}
