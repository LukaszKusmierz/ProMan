import {dataHandler} from "../data/dataHandler.js";
import {htmlFactory, htmlTemplates} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();

        for (let board of boards) {
            const statuses = await dataHandler.getStatusesForBoard(board.id);
            board.statuses = statuses;

            const boardBuilder = htmlFactory(htmlTemplates.board);
            const content = boardBuilder(board);

            domManager.addChild("#root", content);
            domManager.addEventListener(
                `.accordion-button[data-board-id="${board.id}"]`,
                "click",
                showHideButtonHandler
            );
            domManager.addEventListener(
                `#buttonNewBoard`,
                "click",
                createNewBoard
            );
            domManager.addEventListener(
                `#renameBoardButton[data-board-id="${board.id}"]`,
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
               `.col [data-board-id="${board.id}"]`,
               "click",
               renameStatus
            );
            domManager.addEventListener(
                `#addCardButton[data-board-id="${board.id}"]`,
                "click",
                createNewCard
            );
            domManager.addEventListener(
                `.draggable-column`,
                "dragStart",
                dragStart
            );
            domManager.addEventListener(
                `.draggable-column`,
                "dragOver",
                dragOver
            );
            domManager.addEventListener(
                `.draggable-column`,
                "drop",
                drop
            );
        }
    dragAndDrop();
    },
}


async function createNewBoard() {
    const formCreateNewBoard = document.querySelector(`.formCreateBoard`)
    formCreateNewBoard.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formCreateNewBoard);
        const data = Object.fromEntries(formData)
        const boardTitle = document.getElementById('titleBoard').value
        if (boardTitle) {
            await dataHandler.createNewBoard(data)

            const myModal = document.getElementById('newBoardModal')
            myModal.classList.remove('show');
            myModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            location.reload()
        }
    });
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
    const boardId = clickEvent.target.dataset.boardId;
    const formRenameStatus = document.querySelector(`.formRenameStatus`)
    formRenameStatus.addEventListener("submit", async event => {
        event.preventDefault()
        const formData = new FormData(formRenameStatus);
        const data = Object.fromEntries(formData)

        await dataHandler.updateStatus(boardId, data)
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
            location.reload()
        }
    });
}

async function createNewCard(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const formCreateNewCard = document.querySelector(`.formAddCard`)
    formCreateNewCard.addEventListener("submit", async event => {
        event.preventDefault();
        const formData = new FormData(formCreateNewCard);
        const data = Object.fromEntries(formData)
        const cardTitle = document.getElementById('addCard').value
        if (cardTitle) {
            await dataHandler.createNewCard(boardId, data)

            const myModal = document.getElementById('addCardModal')
            myModal.classList.remove('show');
            myModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            location.reload()
        }
    });
}

function dragAndDrop() {
    const draggableStatuses = document.querySelectorAll(".col.draggable-column");
    const dragContainers = document.querySelectorAll(".container");

    draggableStatuses.forEach(draggableStatus => {
        draggableStatus.addEventListener("dragstart", () => {
            draggableStatus.classList.add("dragging")
        })
        draggableStatus.addEventListener("dragend", () => {
            draggableStatus.classList.remove("dragging")
        });
    });

    dragContainers.forEach(dragContainer => {
        dragContainer.addEventListener("dragover", e => {
            e.preventDefault()
            const draggableStatus = document.querySelector(".dragging")
            dragContainer.appendChild(draggableStatus)
        })
    })

    const targetColumns = document.querySelectorAll(".draggable-column");

    targetColumns.forEach(column => {
        column.addEventListener("dragOver", dragOver);
        column.addEventListener("drop", drop);
    });
}

// function dragOver(event) {
//     event.preventDefault();
//     console.log(event.target)
//     console.log("......." + event.type)
// }
//
// function dragStart(event) {
//     event.dataTransfer.setData("text", event.target.id)
//     console.log(event.target)
//     console.log("......." + event.type)
//     event.target.style = 'border: 2px solid red;'
// }
//
// function drop(event) {
//     event.preventDefault();
//     let transfer = event.dataTransfer.getData("text")
//     let targetNumber = event.target.firstChild.textContent
//     let draggedItem = document.getElementById(transfer)
//     let draggedItemNumber = draggedItem.textContent
//
//     console.log("draggedItemNumber" + draggedItemNumber)
//     console.log("targetNumber" + targetNumber)
//
//     if(draggedItemNumber === targetNumber) {
//         draggedItem.parentNode.removeChild(draggedItem)
//         event.target.appendChild(draggedItem)
//     }
//
//     console.log(transfer)
//     console.log(event.target)
//     console.log("......." + event.type)
//
// }

async function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId;
    const boardElement = document.querySelector(`#board${boardId} .col-body`);
    boardElement.innerHTML = "";
    cardsManager.loadCards(boardId);
}
