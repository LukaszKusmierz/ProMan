import connection


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s;
        """,
        {"board_id": board_id})

    return cursor.fetchall()


@connection.connection_handler
def get_card_by_id(cursor, card_id):
    cursor.execute("""
        SELECT * 
        FROM cards
        WHERE id = %(card_id)s;
        """, {"card_id": card_id})
    return cursor.fetchone()

#TODO return Id/
@connection.connection_handler
def add_card(cursor, board_id, status_id,  title):
    cursor.execute(
        """
        INSERT INTO cards(board_id, status_id, title, card_order)
        VALUES (%(board_id)s, %(status_id)s, %(title)s, 1);
        """, {"board_id": board_id,
              "status_id": status_id,
              "title": title})


@connection.connection_handler
def delete_card_by_id(cursor, card_id):
    cursor.execute(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s;
        """, {"card_id": card_id})


@connection.connection_handler
def update_card_title_by_id(cursor, card_id, title):
    cursor.execute("""
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(card_id)s;
    """, {"title": title,
          "card_id": card_id})
