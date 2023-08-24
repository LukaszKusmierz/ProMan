import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {

            const cardBuilder = htmlFactory(htmlTemplates.card);
            const content = cardBuilder(card);
            domManager.addChild(`.accordion-body[data-board-id="${boardId}"] .col-body`, content);
            domManager.addEventListener(
                `.card[data-card-id="${card.id}"]`,
                "click",
                deleteButtonHandler
            );
        }
    },
};

function deleteButtonHandler(clickEvent) {
    const cardId = clickEvent.target.dataset.cardId;
    const cardElement = document.querySelector(`#board${boardId} .accordion-body .card[data-card-id="${cardId}"]`);
    dataHandler.deleteCard()
}

// select board_statuses from boards
// where id=2;
// select *, 2 as board_id from statuses s
// join boards b on s.board_id = b.id
// where s.id = any(array (select board_statuses from boards
// where id=2));
//
// go
// select *, 2 as board_id from statuses
//                where id = any(array (select board_statuses from boards
//                where id=2))
//
// ta jest ok:
// WITH selected_statuses AS (
//     SELECT *, 2 as board_id
//     FROM statuses
//     WHERE id = ANY (array
//         (SELECT board_statuses
//         FROM boards
//         WHERE id = 2)
//     )
// )
// SELECT * FROM selected_statuses;
// wyciąga z aray status_id i buduje tabelę
// SELECT
//     id,
//     title,
//     unnest(board_statuses) AS status_id
// FROM
//     boards;

// wyciąga statusy należące do boardów
//
// SELECT
//     b.id AS board_id,
//     b.title AS board_title,
//     s.id,
//     s.title
// FROM
//     boards b
// JOIN
//     (SELECT
//          id,
//          title,
//          unnest(board_statuses) AS status_id
//      FROM
//          boards) unnested
// ON
//     b.id = unnested.id
// JOIN
//     statuses s
// ON
//     unnested.status_id = s.id;
