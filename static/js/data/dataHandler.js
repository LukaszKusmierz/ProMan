export let dataHandler = {
    createUser: async function (data) {
    return await apiPost(`/api/users/registration/`, data)
    },

    getUser: async function (data) {
        return await apiPost(`/api/users/login/`, data)
    },

    getBoards: async function () {
        return await apiGet("/api/boards/");
    },

    getBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/`);
        // the board is retrieved and then the callback function is called with the board
    },

    getStatuses: async function () {
        return await apiGet(`/api/boards/statuses/`)
        // the statuses are retrieved and then the callback function is called with the statuses
    },

    getStatusesForBoard: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/statuses/`)
    // the statuses are retrieved and then the callback function is called with the statuses
    },

    getStatus: async function (statusId) {
        return await apiGet(`/api/boards/statuses/${statusId}/`)
        // the status is retrieved and then the callback function is called with the status
    },

    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },

    getCard: async function (cardId) {
        return await apiGet(`/api/boards/cards/${cardId}/`)
        // the card is retrieved and then the callback function is called with the card
    },

    createNewBoard: async function (boardTitle) {
        return await apiPut("/api/new_board/", boardTitle)
        // creates new board, saves it and calls the callback function with its data
    },

    createNewCard: async function (boardId, data) {
        console.log(data)
        return await apiPut(`/api/boards/${boardId}/new_card/`, data)
        // creates new card, saves it and calls the callback function with its data
    },

    deleteBoard: async function (boardId) {
        return await apiDelete(`/api/delete_board/${boardId}/`)
        // creates new board, saves it and calls the callback function with its data
    },

    deleteCard: async function (cardId) {
        return await apiDelete(`/api/delete_card/${cardId}/`)
        // creates new board, saves it and calls the callback function with its data
    },

    updateBoard: async function (boardId, boardTitle) {
        return await apiPatch(`/api/update_board/${boardId}/`, boardTitle)
        // creates new board, saves it and calls the callback function with its data
    },

    updateCard: async function (cardId, cardTitle) {
        return await apiPatch(`/api/update_card/${cardId}/`, cardTitle)
        // creates new board, saves it and calls the callback function with its data
    },

    updateCardOrder: async function (cardId, data) {
        return await  apiPatch(`/api/update_card_order/${cardId}/`, data)
    },

    createNewStatus: async function (boardId, statusTitle) {
        return await apiPut(`/api/boards/${boardId}/new_status/`, statusTitle)
    },

    updateStatus: async function (statusId, statusTitle) {
        return await apiPatch(`/api/boards/update_status/${statusId}`, statusTitle)
    },
    updateStatusOrder: async function (boardId, statusOrder) {
        return await apiPatch(`/api/boards/${boardId}/update_status_order/`, statusOrder)
    },
};

async function apiGet(url) {
     const response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
}}

async function apiPost(url, payload) {
     const response = await fetch(url, {
        method: "POST",
         body: JSON.stringify(payload),
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         }
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiDelete(url) {
     const response = await fetch(url, {
        method: "DELETE",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPatch(url, payload) {
    const response = await fetch(url, {
        method: "PATCH",
        body: JSON.stringify(payload),
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         }
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPut(url, payload) {
     const response = await fetch(url, {
        method: "PUT",
         body: JSON.stringify(payload),
         headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
         }
    });
    if (response.ok) {
        return await response.json();
    }
}

// async function apiPut(url, payload) {
//     try {
//         const response = await fetch(url, {
//             method: "PUT",
//             body: JSON.stringify(payload),
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             }
//         });
//
//         if (response.ok) {
//             return await response.json();
//         } else {
//             const errorMessage = `Error: ${response.status} - ${response.statusText}`;
//             throw new Error(errorMessage);
//         }
//     } catch (error) {
//         console.error('API Error:', error);
//         throw error;
//     }
// }


