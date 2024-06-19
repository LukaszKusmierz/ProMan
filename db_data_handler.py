import connection


@connection.connection_handler
def get_boards(cursor):
    cursor.execute(
        """
        SELECT * FROM boards
        ORDER BY id ASC;
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

#TODO explanatios for the queries - clean code?
@connection.connection_handler
def add_board(cursor, title):
    cursor.execute(
        """
        INSERT INTO boards(title)
        VALUES (%(title)s)
        RETURNING id;
        """, {"title": title})

    board_id = cursor.fetchone()['id']
    status_titles = ['new', 'in_progress', 'testing', 'done']
    status_ids = []
    for status_title in status_titles:
        cursor.execute(
            """
            INSERT INTO statuses(title, board_id)
            VALUES (%(title)s, %(board_id)s)
            RETURNING id;
            """, {"title": status_title,
                  "board_id": board_id})
        status_ids.append(cursor.fetchone()['id'])

    cursor.execute(
        """
        UPDATE boards
        SET board_statuses = %(status_ids)s
        WHERE id = %(board_id)s;
        """, {"status_ids": status_ids, "board_id": board_id})

    return board_id


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
        SELECT c.id AS card_id, c.title AS card_title, c.card_message,
               s.id AS status_id,
               b.id AS board_id
        FROM cards c
        JOIN statuses s ON c.status_id = s.id
        JOIN boards b ON c.board_id = b.id
        WHERE c.board_id = %(board_id)s
        ORDER BY array_position(s.status_cards, c.id);
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
def add_card(cursor, board_id, title, card_message):
    cursor.execute(
        """
        SELECT board_statuses[1] AS status_id
        FROM boards
        WHERE id = %(board_id)s;
        """, {"board_id": board_id})
    status_id = cursor.fetchone()['status_id']

    cursor.execute(
        """
        INSERT INTO cards(board_id, status_id, title, card_message)
        VALUES (%(board_id)s, %(status_id)s, %(title)s, %(card_message)s)
        RETURNING id;
        """, {"board_id": board_id,
              "status_id": status_id,
              "title": title,
              "card_message": card_message})
    card_id = cursor.fetchone()['id']

    cursor.execute(
        """
        UPDATE statuses
        SET status_cards = array_append(status_cards, %(card_id)s)
        WHERE id = %(status_id)s;
        """, {"status_id": status_id,
              "card_id": card_id})


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
def update_cards_order(cursor, status_id, status_cards):
    cursor.execute(
        """
        UPDATE statuses
        SET status_cards = %(status_cards)s
        WHERE id = %(status_id)s;
        """, {"status_cards": status_cards,
              "status_id": status_id})


@connection.connection_handler
def get_statuses_for_board(cursor, board_id):
    cursor.execute(
        """
        WITH UnnestedStatuses AS (
            SELECT
                id AS board_id,
                unnest(board_statuses) AS status_id,
                row_number() OVER () AS status_order
            FROM
                boards
        )
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
            u.board_id = %(board_id)s
        ORDER BY
            array_position(board_statuses, status_id)
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
        INSERT INTO statuses(title, board_id)
        VALUES ( %(title)s, %(board_id)s)
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
def status_update(cursor, status_id, status_title):
    cursor.execute(
        """
        UPDATE statuses
        SET title = %(status_title)s
        WHERE id = %(status_id)s;
        """, {"status_id": status_id,
               "status_title": status_title})


@connection.connection_handler
def update_status_order(cursor, board_id, board_statuses):
    cursor.execute(
        """
        UPDATE boards
        SET board_statuses = %(board_statuses)s
        WHERE id = %(board_id)s;
        """, {"board_statuses": board_statuses,
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
