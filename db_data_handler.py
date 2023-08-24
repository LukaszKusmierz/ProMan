import connection


@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        """
        SELECT * FROM boards;
        """)
    return cursor.fetchall()


@connection.connection_handler
def get_board(cursor, board_id):
    cursor.execute(
        """
        SELECT * FROM boards
        WHERE id = %(board_id)s;
        """, {"board_id": board_id})
    return cursor.fetchall()

#TODO return Id
@connection.connection_handler
def add_board(cursor, title):
    cursor.execute("""
    INSERT INTO boards(title)
    VALUES (%(title)s)
    RETURNING id;
    """, {"title": title})
    return cursor.fetchone()['id']


@connection.connection_handler
def delete_board_by_id(cursor, board_id):
    cursor.execute(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s;
        """, {"board_id": board_id})


@connection.connection_handler
def update_board_by_id(cursor, board_id, title):
    cursor.execute("""
    UPDATE boards
    SET title = %(title)s
    WHERE id = %(board_id)s;
    """, {"board_id": board_id,
          "title": title})


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
def add_card(cursor, board_id, title):
    cursor.execute(
        """
        INSERT INTO cards(board_id, status_id, title, card_order)
        VALUES (%(board_id)s, 1, %(title)s, 1);
        """, {"board_id": board_id,
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


@connection.connection_handler
def get_card_status(cursor, status_id):
    cursor.execute(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s;
        """,
        {"status_id": status_id})

    return cursor.fetchone()


@connection.connection_handler
def get_statuses_for_board(cursor, board_id):
    cursor.execute(
        """
        WITH UnnestedStatuses AS (
        SELECT
            id AS board_id,
            unnest(board_statuses) AS status_id
        FROM
            boards)
        SELECT
            u.board_id,
            u.status_id,
            s.title
        FROM
            UnnestedStatuses u
        JOIN
            boards b ON u.board_id = b.id
        JOIN
            statuses s ON u.status_id = s.id
        WHERE
            u.board_id = %(board_id)s;
        """, {"board_id": board_id})
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor):
    cursor.execute(
        """
        SELECT * FROM statuses;
        """)
    return cursor.fetchall()


@connection.connection_handler
def add_new_status(cursor, board_id, title):
    cursor.execute(
        """
        INSERT INTO statuses(title)
        VALUES ( %(title)s)
        RETURNING id;
        """, {"board_id": board_id,
              "title": title})
    new_status_id = cursor.fetchone()['id']
    cursor.execute(
        """
        UPDATE boards
        SET board_statuses = array_append(board_statuses, %(new_status_id)s)
        WHERE id = %(board_id)s;
        """, {"new_status_id": new_status_id,
              "board_id": board_id})


@connection.connection_handler
def get_user_by_name(cursor, user_name, email):
    cursor.execute("""
                   SELECT *
                   FROM users
                   WHERE  user_name = %(user_name)s or email = %(email)s
                    """,
                   {"user_name": user_name,
                    "email": email})
    return cursor.fetchone()


@connection.connection_handler
def add_user(cursor, user_name, email, password):
    cursor.execute("""
                    INSERT INTO users(user_name, email, password)
                    VALUES (%(user_name)s, %(email)s, %(password)s)
                    RETURNING id;""",
                   {"user_name": user_name, "email": email, "password": password})
    return cursor.fetchone()["id"]
