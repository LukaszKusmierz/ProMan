import connection


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
def get_statuses(cursor):
    cursor.execute(
        """
        SELECT * FROM statuses;
        """)
    return  cursor.fetchall()
