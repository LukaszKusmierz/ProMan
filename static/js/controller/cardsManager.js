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
                `.card[data-card-id="${card.card_id}"]`,
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

