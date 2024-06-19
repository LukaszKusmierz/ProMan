import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
// import {Modal} from "bootstrap.esm.min.js"
// import { bootstrap, Modal } from '/bootstrap.esm.min.js'

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();

        for (let board of boards) {
            const statuses = await dataHandler.getStatusesForBoard(board.id);
            const cards = await dataHandler.getCardsByBoardId(board.id);

            board.statuses = statuses.map(status => ({
                ...status,
                cards: cards.filter(card => card.status_id === status.status_id)
            }))
            console.log('to moje bordy:', boards)
            console.log('to moje statusy:', board.statuses)
            console.log('to moje karty:', cards)

            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);

            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.accordion-button[data-board-id="${board.id}"]`,
                "click",
                // showHideButtonHandler
            );
            const renameStatusLinks = document.querySelectorAll(`#board${board.id} a#rename`);
            renameStatusLinks.forEach(link => {
            link.addEventListener("click", renameStatus);
            });
            domManager.addEventListener(
                `#renameBoardLink[data-board-id="${board.id}"]`,
                "click",
                renameBoardButtonHandler
            );
            domManager.addEventListener(
                `#deleteBoardButton[data-board-id="${board.id}"]`,
                "click",
                deleteBoard
            );
            domManager.addEventListener(
                `#addStatusButton[data-board-id="${board.id}"]`,
                "click",
                createNewStatus
            );
            domManager.addEventListener(
                `#addCardButton[data-board-id="${board.id}"]`,
                "click",
                addNewCard
            );
            domManager.addEventListener(
                `#formCreateBoard`,
                "submit",
                addNewBoard
            );
            // domManager.addEventListener(
            //     `.col`,
            //     "dragstart",
            //     dragAndDrop
            // );
            // domManager.addEventListener(
            //     `.card`,
            //     "dragstart",
            //     moveCards
            // );
        }
        dragAndDrop()
        moveCards()
        // initializeDragAndDrop();
    },
}
// po schowaniu maodal trzeba zaaktualizować DOM - zamiast reload zlokalizować accordina i dodać nowy element
async function addNewBoard(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData)
        await dataHandler.createNewBoard(data)
}


async function renameBoardButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formRenameBoard = document.querySelector(`.formRenameBoard`)
    formRenameBoard.addEventListener("submit", async event => {
        event.preventDefault()

        const formData = new FormData(formRenameBoard);
        const data = Object.fromEntries(formData)
        await dataHandler.updateBoard(boardId, data)
        const myModal = document.getElementById('renameBoardModal')
        myModal.classList.remove('show');
        myModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        location.reload();
    });
}


async function deleteBoard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formDeleteBoard = document.querySelector(`.formDeleteBoard`)
    formDeleteBoard.addEventListener("submit", async event => {
        event.preventDefault()

        await dataHandler.deleteBoard(boardId)
        const myModal = document.getElementById('deleteBoardModal')
        myModal.classList.remove('show');
        myModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        location.reload()
    });
}


async function renameStatus(clickEvent) {
    const statusId = clickEvent.target.getAttribute("data-id");
    const formRenameStatus = document.querySelector(`.formRenameStatus`)
    formRenameStatus.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameStatus);
        const data = Object.fromEntries(formData)


        await dataHandler.updateStatus(statusId, data)
        const myModal = document.getElementById('renameStatusModal')
        myModal.classList.remove('show');
        myModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
        location.reload()
    });
}

async function createNewStatus(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formCreateNewStatus = document.querySelector(`.formAddStatus`)
    formCreateNewStatus.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formCreateNewStatus);
        const data = Object.fromEntries(formData)
        const statusTitle = document.getElementById('addStatus').value
        if (statusTitle) {
            await dataHandler.createNewStatus(boardId, data)

            const myModal = document.getElementById('addStatusModal')
            myModal.classList.remove('show');
            myModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            const columnContainer = document.querySelector(`#board${boardId} #containerColumn div.row`)
            const columnInnerHTML = `<div class="col draggable-column" id="board-column-title" draggable="true">
                                <a data-bs-toggle="modal" data-bs-target="#renameStatusModal" data-status="${status.id}" data-board-id="${boardId}" href="#renameStatusModal">
                                  ${data.addStatus}
                                </a>
                                <div class="col-body" id="board-column-title"></div>
                              </div>`
            columnContainer.insertAdjacentHTML("beforeend", columnInnerHTML)
            // location.reload()
        }
    });
    // odpowiedzieć na status id jsonem żeby zwrócił status.id
    // zbudować funkcję a'la cardBuilder dla statusów
}

async function addNewCard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formCreateNewCard = document.querySelector(`.formAddCard`)
    formCreateNewCard.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formCreateNewCard);
        const cardTitle = formData.get('cardTitle');
        const cardMessage = formData.get('cardMessage');
        if (cardTitle) {
            const data = { cardTitle, cardMessage };
            await dataHandler.createNewCard(boardId, data)

            const myModal = document.getElementById('addCardModal')
            myModal.hide
            location.reload()
        }
    });
}
// do tąd cofnij
// let isDragAndDropEnabled = true;
// let isMoveCardsEnabled = true;
function dragAndDrop() {
    // if (!isDragAndDropEnabled) {
    //     return;
    // }

    const draggableStatuses = document.querySelectorAll('.col');
    const statusContainer = document.querySelector('.row');

    let draggableStatus;

    draggableStatuses.forEach(status => {
        status.addEventListener('dragstart', () => {
            status.classList.add('dragging');
            console.log('drag start dla kol...', )
        });

        status.addEventListener('dragend', () => {
            status.classList.remove('dragging');
        });
    });

    statusContainer.addEventListener('dragover', e => {
        e.stopPropagation()

        if (!(!e.target.classList.contains('row') || (e.target.classList.contains('col-body') && e.currentTarget.classList.contains('row')))) {
            return
        }
        console.log(e.target.classList)
        const overElement = dragOverElement(statusContainer, e.clientX);
        draggableStatus = document.querySelector('.col.dragging');
        const card = document.querySelector('.card');
// na jutro dalsze próby z logiką warunków
        if (draggableStatus !== card) {
            if (overElement === null) {
                statusContainer.appendChild(draggableStatus);
            } else {
                console.log('to draggable...', draggableStatus)
                statusContainer.insertBefore(draggableStatus, overElement);
            }
        }
    });

    statusContainer.addEventListener('drop', e => {
        e.preventDefault();
        if (e.target.classList.contains('draggable-column') && draggableStatus) {
            const statusOrder = Array.from(statusContainer.querySelectorAll('.col')).map(status => `${status.id}`);
            const boardId = draggableStatus.getAttribute('data-board-id');
            dataHandler.updateStatusOrder(boardId, statusOrder);
            console.log('Drag and drop is active...', statusOrder);
        }
    });
}

    function dragOverElement(statusContainer, x) {

        const draggableElements = [...statusContainer.querySelectorAll(`.col:not(.dragging)`)];
        const lastElement = draggableElements[draggableElements.length - 1];
        const lastElementBox = lastElement.getBoundingClientRect()

        return draggableElements.reduce((closest, child) => {

            const box = child.getBoundingClientRect();
            const offset = x - box.right + box.width / 2;

            if (offset > lastElementBox.right) {
                return {offset: offset, element: lastElement};
            } else if (offset < 0 && offset > closest.offset) {
                return {offset: offset, element: child};
            } else {
                return closest;
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
}


// przełączyć draggable na false w col jak działa funkcja card
function moveCards() {
    // if (isDragAndDropEnabled) {
    //     isDragAndDropEnabled = false;

        const draggableCards = document.querySelectorAll('.card');
        let movingCardId;
        const droppableCols = document.querySelectorAll('.col-body');
        const mainCols = document.querySelectorAll('.col')

        draggableCards.forEach(card => {
            card.addEventListener('dragstart', e => {
                e.stopPropagation()
                card.classList.add('is-dragging');
                const cardId = card.getAttribute('id');
                movingCardId = cardId;
                // mainCols.forEach(column => {
                //     column.setAttribute('draggable', false);
                // });

                console.log('Card is dragging...', cardId);
            });

            card.addEventListener('dragend', e => {

                card.classList.remove('is-dragging');
                // mainCols.forEach(column => {
                //     column.setAttribute('draggable', true);
                // });
            });
            card.addEventListener('dragover', e => {
            e.preventDefault();
                const cardId = movingCardId;
                const draggedCard = document.getElementById(cardId);
                const sourceColumn = card.parentElement;

                if (draggedCard !== card) {
                    sourceColumn.insertBefore(draggedCard, card);
                }
            });
        });

        droppableCols.forEach(zone => {
            // let hasHandledDragOver = false;

            zone.addEventListener('dragover', e => {
                e.preventDefault()
                // e.stopPropagation()

                if (!(!e.target.classList.contains('col_body') || (e.target.classList.contains('card') && e.currentTarget.classList.contains('col-body')))) {
                    return
                }
                console.log('blabla', e.target)
                const cardId = movingCardId;
                console.log('Card ID:', cardId);
                const draggedCard = document.getElementById(cardId);
                const isEmptyZone = e.target.querySelectorAll('.card:not(.is-dragging)').length === 0;
                console.log('to jest empty zone:', e.target.querySelectorAll('.card:not(.is-dragging)'))
                if (isEmptyZone) {
                    zone.appendChild(draggedCard);
                } else {
                    const bottomCard = getClosestCard(zone, e.clientY);
                    zone.insertBefore(draggedCard, bottomCard);
                }

                setTimeout(() => {
                }, 100);

            });

            // zone.addEventListener('drop', e => {
            //     e.preventDefault();
            //     if (movingCardId) {
            //         const draggedCard = document.getElementById(movingCardId);
            //         if (draggedCard) {
            //             zone.appendChild(draggedCard);
            //             movingCardId = null; // Reset the moving card ID
            //         }
            //     }
                // if (e.target.classList.contains('col-body') && draggableStatus) {
                //     const statusOrder = Array.from(statusContainer.querySelectorAll('.col')).map(status => `${status.id}`);
                //     const boardId = draggableStatus.getAttribute('data-board-id');
                //     dataHandler.updateStatusOrder(boardId, statusOrder);
                //     console.log('Drag and drop is active...', statusOrder);
                // }
            // });
        });

        function getClosestCard(zone, mouseY) {
            const cards = [...zone.querySelectorAll('.card:not(.is-dragging)')];
            const lastCard = cards[cards.length - 1];
            const lastCardBox = lastCard.getBoundingClientRect();

            return cards.reduce((closest, card) => {
                const box = card.getBoundingClientRect();
                const offset = mouseY - box.bottom + box.height / 2;

                if (offset > lastCardBox.bottom) {
                    return { offset: offset, card: lastCard };
                } else if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, card: card };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).card;
        }

    //     isDragAndDropEnabled = true;
    // }
}


